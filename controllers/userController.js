// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Récupérer profil utilisateur par ID ou username
exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// Modifier profil : photo, email, mot de passe
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // À récupérer via middleware d'authentification JWT
    const { email, currentPassword, newPassword, username } = req.body;
    const updateData = {};

    // Vérifier et mettre à jour l'email si besoin
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'Correo ya en uso.' });
      }
      updateData.email = email;
    }

    // Modifier le nom d'utilisateur
    if (username) {
      const userExists = await User.findOne({ username });
      if (userExists && userExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'Nombre de usuario ya usado.' });
      }
      updateData.username = username;
    }

    // Modifier mot de passe
    if (currentPassword && newPassword) {
      const user = await User.findById(userId);
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return res.status(400).json({ message: 'Contraseña actual incorrecta.' });

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // TODO: gérer photo de profil (upload + url)

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    res.json({ message: 'Perfil actualizado.', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// Suivre un utilisateur
exports.followUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { followId } = req.body;

    if (userId === followId) {
      return res.status(400).json({ message: 'No puedes seguirte a ti mismo.' });
    }

    const user = await User.findById(userId);
    const userToFollow = await User.findById(followId);
    if (!userToFollow) return res.status(404).json({ message: 'Usuario a seguir no encontrado.' });

    if (user.following.includes(followId)) {
      return res.status(400).json({ message: 'Ya sigues a este usuario.' });
    }

    user.following.push(followId);
    userToFollow.followers.push(userId);

    await user.save();
    await userToFollow.save();

    res.json({ message: `Ahora sigues a ${userToFollow.username}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// Ne plus suivre un utilisateur
exports.unfollowUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { unfollowId } = req.body;

    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(unfollowId);
    if (!userToUnfollow) return res.status(404).json({ message: 'Usuario no encontrado.' });

    user.following = user.following.filter(id => id.toString() !== unfollowId);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);

    await user.save();
    await userToUnfollow.save();

    res.json({ message: `Has dejado de seguir a ${userToUnfollow.username}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

