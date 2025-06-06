const express = require('express');
const cors = require('cors');
const path = require('path');

// Importation des routes
const authRoutes = require('../routes/auth');
const productsRoutes = require('../routes/products');
const panierRoutes = require('../routes/panier');
const ordersRoutes = require('../routes/orders');
const favoritesRoutes = require('../routes/favorites');
const reviewsRoutes = require('../routes/reviews');
const usersRoutes = require('../routes/users');
const pubLayoutRoutes = require('../routes/pub-layout');
const contactsRoutes = require('../routes/contacts');
const adminChatRoutes = require('../routes/admin-chat');
const clientChatRoutes = require('../routes/client-chat');
const codePromosRoutes = require('../routes/code-promos');
const remboursementsRoutes = require('../routes/remboursements');
const categoriesRoutes = require('../routes/categories');
const flashSalesRoutes = require('../routes/flash-sales');
const visitorsRoutes = require('../routes/visitors');
const settingsRoutes = require('../routes/settings');
const publicSettingsRoutes = require('../routes/public-settings');
const salesNotificationsRoutes = require('../routes/sales-notifications');

// Fonction pour configurer les routes
function setupRoutes(app) {
  // Préfixe pour l'API
  const API_PREFIX = '/api';
  
  // Middleware CORS pour toutes les routes
  app.use(cors());

  // Middleware pour parser le JSON
  app.use(express.json());

  // Middleware pour servir les fichiers statiques depuis le dossier "public"
  app.use(express.static(path.join(__dirname, '../../public')));
  
  // Montage des routes avec le préfixe API
  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/products`, productsRoutes);
  app.use(`${API_PREFIX}/panier`, panierRoutes);
  app.use(`${API_PREFIX}/orders`, ordersRoutes);
  app.use(`${API_PREFIX}/favorites`, favoritesRoutes);
  app.use(`${API_PREFIX}/reviews`, reviewsRoutes);
  app.use(`${API_PREFIX}/users`, usersRoutes);
  app.use(`${API_PREFIX}/pub-layout`, pubLayoutRoutes);
  app.use(`${API_PREFIX}/contacts`, contactsRoutes);
  app.use(`${API_PREFIX}/admin-chat`, adminChatRoutes);
  app.use(`${API_PREFIX}/client-chat`, clientChatRoutes);
  app.use(`${API_PREFIX}/code-promos`, codePromosRoutes);
  app.use(`${API_PREFIX}/remboursements`, remboursementsRoutes);
  app.use(`${API_PREFIX}/categories`, categoriesRoutes);
  app.use(`${API_PREFIX}/flash-sales`, flashSalesRoutes);
  app.use(`${API_PREFIX}/visitors`, visitorsRoutes);
  app.use(`${API_PREFIX}/settings`, settingsRoutes);
  app.use(`${API_PREFIX}/public-settings`, publicSettingsRoutes);
  app.use(`${API_PREFIX}/sales-notifications`, salesNotificationsRoutes);
  
  // Route de base pour vérifier que le serveur fonctionne
  app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur de l\'application !');
  });

  // Route pour la gestion des erreurs 404
  app.use((req, res, next) => {
    res.status(404).send('Erreur 404: Ressource non trouvée');
  });

  // Route pour la gestion des erreurs 500
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erreur 500: Erreur serveur');
  });
}

module.exports = { setupRoutes };
