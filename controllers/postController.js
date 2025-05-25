const Post = require('../models/Post');
const User = require('../models/User');

// Créer un post
exports.createPost = async (req, res) => {
  try {
    const { userId, content, imageUrl, videoUrl } = req.body;
    const newPost = new Post({
      user: userId,
      content,
      imageUrl,
      videoUrl,
      likes: [],
      comments: [],
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du post.' });
  }
};

// Obtenir tous les posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username photo').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des posts.' });
  }
};

// Obtenir un post par ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username photo');
    if (!post) return res.status(404).json({ error: 'Post introuvable.' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du post.' });
  }
};

// Modifier un post
exports.updatePost = async (req, res) => {
  try {
    const { content, imageUrl, videoUrl } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post non trouvé.' });

    post.content = content || post.content;
    post.imageUrl = imageUrl || post.imageUrl;
    post.videoUrl = videoUrl || post.videoUrl;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
};

// Supprimer un post
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: 'Post non trouvé.' });
    res.status(200).json({ message: 'Post supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
};

// Liker / Unliker un post
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.body.userId;

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter(id => id !== userId);
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du like/unlike.' });
  }
};

// Ajouter un commentaire
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { userId, text } = req.body;

    const comment = {
      user: userId,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’ajout du commentaire.' });
  }
};

