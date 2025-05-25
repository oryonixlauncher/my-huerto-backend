require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const app = express();

// Middlewares de base
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://potager:potager@cluster0.mongodb.net/mi_huerto?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connecté'))
.catch((err) => console.error('❌ Erreur MongoDB :', err));

// Sessions avec stockage dans MongoDB
app.use(session({
  secret: process.env.JWT_SESSION || 'mon_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://potager:potager@cluster0.mongodb.net/mi_huerto?retryWrites=true&w=majority',
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
    httpOnly: true,
    secure: false, // change en true si HTTPS
  }
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes de base
app.get('/', (req, res) => {
  res.send('🌱 Bienvenue sur Mi Huerto Social Backend');
});

// Exemple de route API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
// Ajoute ici d'autres routes comme comments, likes, stories, etc.

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});

