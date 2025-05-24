// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');

// Créer une publication (texte + images/vidéos uploadées)
exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text, mediaUrls } = req.body; // mediaUrls : tableau de liens images/vidéos

    if (!text && (!mediaUrls || mediaUrls.length === 0)) {
      return res.status(400).json({ message: 'El post debe tener texto o media.' });
    }

    const newPost = new Post({
      author: userId,
      text,
      media: mediaUrls,
      createdAt: Date.now(),
    });

    await newPost.save();
    res.status(201).json({ message: 'Publicación creada.', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// Récupérer posts (feed, user, etc.)
exports.getPosts = async (req, res) => {
  try {
    const { username, limit = 20, skip = 0 } = req.query;
    let query = {};

    if (username) {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
      query.author = user._id;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('author', 'username photoUrl');

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// Liker ou unliker une publication
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Publicación no encontrada.' });

    const index = post.likes.findIndex(id => id.toString() === userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ message: 'Like actualizado.', likesCount: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// Ajouter un commentaire
exports.addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId, text } = req.body;

    if (!text) return res.status(400).json({ message: 'Comentario vacío.' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Publicación no encontrada.' });

    post.comments.push({
      author: userId,
      text,
      createdAt: Date.now(),
      reactions: [], // emojis etc.
    });

    await post.save();

    res.json({ message: 'Comentario agregado.', commentsCount: post.comments.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

// Modifier une publication (texte ou médias)
exports.editPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId, newText, newMediaUrls } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Publicación no encontrada.' });

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta publicación.' });
    }

    if (newText !== undefined) post.text = newText;
    if (newMediaUrls !== undefined) post.media = newMediaUrls;

    await post.save();
    res.json({ message: 'Publicación actualizada.', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

