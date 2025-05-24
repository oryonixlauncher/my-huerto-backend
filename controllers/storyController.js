// controllers/storyController.js
const Story = require('../models/Story');
const User = require('../models/User');

// Créer une story
exports.createStory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mediaUrl, isPublic = true } = req.body;

    if (!mediaUrl) {
      return res.status(400).json({ message: 'Se requiere media para la story.' });
    }

    // Durée de validité 24h à partir de maintenant
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newStory = new Story({
      author: userId,
      mediaUrl,
      isPublic,
      createdAt: Date.now(),
      expiresAt,
    });

    await newStory.save();
    res.status(201).json({ message: 'Story creada.', story: newStory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// Récupérer stories visibles par l'utilisateur (publiques + privées d'amis mutuels)
exports.getStories = async (req, res) => {
  try {
    const userId = req.user.id;

    // Trouver les amis mutuels (suivi ET follower)
    const user = await User.findById(userId);

    const friends = user.following.filter(followId => user.followers.includes(followId.toString()));

    // Récupérer stories non expirées
    const now = new Date();

    const stories = await Story.find({
      expiresAt: { $gt: now },
      $or: [
        { isPublic: true },
        { author: { $in: friends } }
      ]
    }).populate('author', 'username photoUrl')
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// Supprimer une story (seulement par son auteur)
exports.deleteStory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storyId } = req.params;

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: 'Story no encontrada.' });

    if (story.author.toString() !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta story.' });
    }

    await Story.findByIdAndDelete(storyId);
    res.json({ message: 'Story eliminada.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

