
const express = require('express');
const router = express.Router();
const database = require('../core/database');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Assurer que le fichier de paramètres existe
database.ensureFile('settings.json', {
  id: 'default',
  general: {
    siteName: 'Riziky-Boutic',
    siteDescription: 'Votre boutique en ligne de confiance',
    siteUrl: 'https://riziky-boutic.com',
    maintenanceMode: false,
    maintenanceMessage: 'Site en maintenance. Nous reviendrons bientôt !',
    allowRegistration: true,
    requireEmailVerification: false,
    maxProductsPerPage: 20,
    defaultCurrency: 'EUR',
    taxRate: 20,
    shippingCost: 5.99,
    freeShippingThreshold: 50,
    contactEmail: 'contact@riziky-boutic.com',
    supportPhone: '+33 1 23 45 67 89',
    socialMediaLinks: {},
    seoSettings: {
      metaTitle: 'Riziky-Boutic - Votre boutique en ligne',
      metaDescription: 'Découvrez notre sélection de produits de qualité',
      metaKeywords: 'boutique, en ligne, qualité'
    },
    analyticsSettings: {},
    paymentSettings: {
      enableStripe: true,
      enablePayPal: true,
      enableCreditCard: true
    },
    emailSettings: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@riziky-boutic.com',
      fromName: 'Riziky-Boutic'
    }
  },
  notifications: {
    emailNotifications: {
      newOrder: true,
      orderStatusChange: true,
      newUser: true,
      contactForm: true,
      lowStock: true,
      newReview: true,
      refundRequest: true,
      systemAlerts: true
    },
    smsNotifications: {
      newOrder: false,
      orderStatusChange: false,
      systemAlerts: true
    },
    pushNotifications: {
      newOrder: true,
      orderStatusChange: true,
      newUser: false,
      newReview: true,
      systemAlerts: true
    },
    slackNotifications: {
      newOrder: false,
      systemAlerts: false,
      errorReports: false
    },
    discordNotifications: {
      newOrder: false,
      systemAlerts: false,
      errorReports: false
    }
  },
  backup: {
    autoBackup: true,
    backupInterval: 'daily',
    backupTime: '23:58',
    emailBackup: true,
    backupEmail: 'vianey.jean@ymail.com',
    retentionDays: 30
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// GET /api/settings - Récupérer les paramètres
router.get('/', (req, res) => {
  try {
    const settings = database.read('settings.json');
    console.log('Paramètres lus depuis la base:', settings);
    res.json(settings);
  } catch (error) {
    console.error('Erreur lors de la lecture des paramètres:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des paramètres' });
  }
});

// PUT /api/settings - Mettre à jour les paramètres
router.put('/', (req, res) => {
  try {
    const currentSettings = database.read('settings.json');
    const updatedSettings = {
      ...currentSettings,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Mise à jour des paramètres:', updatedSettings);
    database.write('settings.json', updatedSettings);
    
    // Si le mode maintenance a été activé/désactivé, on peut ajouter une logique spéciale ici
    if (req.body.general?.maintenanceMode !== undefined) {
      console.log(`Mode maintenance ${req.body.general.maintenanceMode ? 'activé' : 'désactivé'}`);
    }
    
    res.json(updatedSettings);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des paramètres' });
  }
});

// PUT /api/settings/general - Mettre à jour les paramètres généraux
router.put('/general', (req, res) => {
  try {
    const settings = database.read('settings.json');
    console.log('Paramètres actuels:', settings);
    console.log('Données reçues:', req.body);
    
    settings.general = { ...settings.general, ...req.body };
    settings.updatedAt = new Date().toISOString();
    
    console.log('Paramètres après mise à jour:', settings);
    
    const writeSuccess = database.write('settings.json', settings);
    console.log('Écriture réussie:', writeSuccess);
    
    if (writeSuccess) {
      // Vérifier que les données ont bien été écrites
      const verifySettings = database.read('settings.json');
      console.log('Vérification des données écrites:', verifySettings);
      
      res.json(settings);
    } else {
      throw new Error('Échec de l\'écriture dans le fichier');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres généraux:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des paramètres généraux' });
  }
});

// PUT /api/settings/notifications - Mettre à jour les paramètres de notification
router.put('/notifications', (req, res) => {
  try {
    const settings = database.read('settings.json');
    settings.notifications = { ...settings.notifications, ...req.body };
    settings.updatedAt = new Date().toISOString();
    
    database.write('settings.json', settings);
    res.json(settings);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres de notification:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des paramètres de notification' });
  }
});

// POST /api/settings/backup/manual - Sauvegarde manuelle
router.post('/backup/manual', async (req, res) => {
  try {
    const backupData = await createBackup();
    res.json({ message: 'Sauvegarde créée avec succès', backup: backupData });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde manuelle:', error);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde manuelle' });
  }
});

// Fonction pour créer une sauvegarde
async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../backups');
  
  // Créer le dossier de sauvegarde s'il n'existe pas
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Récupérer toutes les données de la base de données
  const backupData = {
    timestamp,
    siteName: 'Riziky-Boutic',
    backupVersion: '1.0',
    data: {
      users: database.read('users.json'),
      products: database.read('products.json'),
      orders: database.read('orders.json'),
      categories: database.read('categories.json'),
      contacts: database.read('contacts.json'),
      reviews: database.read('reviews.json'),
      settings: database.read('settings.json'),
      favorites: database.read('favorites.json'),
      panier: database.read('panier.json'),
      codePromos: database.read('code-promos.json'),
      remboursements: database.read('remboursements.json'),
      flashSales: database.read('banniereflashsale.json'),
      publayout: database.read('publayout.json'),
      clientChat: database.read('client-chat.json'),
      adminChat: database.read('admin-chat.json'),
      visitors: database.read('visitors.json'),
      salesNotifications: database.read('sales-notifications.json')
    },
    stats: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalContacts: 0
    }
  };
  
  // Calculer les statistiques
  try {
    backupData.stats.totalUsers = Array.isArray(backupData.data.users) ? backupData.data.users.length : 0;
    backupData.stats.totalProducts = Array.isArray(backupData.data.products) ? backupData.data.products.length : 0;
    backupData.stats.totalOrders = Array.isArray(backupData.data.orders) ? backupData.data.orders.length : 0;
    backupData.stats.totalContacts = Array.isArray(backupData.data.contacts) ? backupData.data.contacts.length : 0;
  } catch (error) {
    console.log('Erreur lors du calcul des statistiques:', error);
  }
  
  const backupFilename = `riziky-boutic-backup-${timestamp}.json`;
  const backupPath = path.join(backupDir, backupFilename);
  
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
  
  // Envoyer par email si configuré
  const settings = database.read('settings.json');
  if (settings.backup?.emailBackup && settings.backup?.backupEmail) {
    await sendBackupEmail(backupPath, settings.backup.backupEmail, settings.general.emailSettings);
  }
  
  console.log('Sauvegarde créée:', backupFilename);
  return { 
    filename: backupFilename, 
    path: backupPath, 
    size: fs.statSync(backupPath).size,
    stats: backupData.stats
  };
}

// Fonction pour envoyer la sauvegarde par email
async function sendBackupEmail(backupPath, emailAddress, emailSettings) {
  try {
    if (!emailSettings.smtpHost || !emailSettings.smtpUser) {
      console.log('Configuration SMTP incomplète, envoi d\'email annulé');
      return;
    }

    const transporter = nodemailer.createTransporter({
      host: emailSettings.smtpHost,
      port: emailSettings.smtpPort,
      secure: emailSettings.smtpPort === 465,
      auth: {
        user: emailSettings.smtpUser,
        pass: emailSettings.smtpPassword
      }
    });

    const fileStats = fs.statSync(backupPath);
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    const mailOptions = {
      from: `${emailSettings.fromName} <${emailSettings.fromEmail}>`,
      to: emailAddress,
      subject: `Sauvegarde automatique Riziky-Boutic - ${new Date().toLocaleDateString('fr-FR')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🔒 Sauvegarde automatique Riziky-Boutic</h2>
          <p>Voici la sauvegarde automatique de votre site Riziky-Boutic.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📊 Informations de sauvegarde</h3>
            <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
            <p><strong>Taille du fichier:</strong> ${(fileStats.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Format:</strong> JSON</p>
          </div>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📈 Statistiques des données</h3>
            <ul style="list-style: none; padding: 0;">
              <li>👥 Utilisateurs: ${backupData.stats?.totalUsers || 0}</li>
              <li>📦 Produits: ${backupData.stats?.totalProducts || 0}</li>
              <li>🛒 Commandes: ${backupData.stats?.totalOrders || 0}</li>
              <li>📧 Messages: ${backupData.stats?.totalContacts || 0}</li>
            </ul>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">🗃️ Données sauvegardées</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>• Utilisateurs</div>
              <div>• Produits</div>
              <div>• Commandes</div>
              <div>• Catégories</div>
              <div>• Messages de contact</div>
              <div>• Avis clients</div>
              <div>• Paramètres du site</div>
              <div>• Favoris</div>
              <div>• Paniers</div>
              <div>• Codes promo</div>
              <div>• Remboursements</div>
              <div>• Ventes flash</div>
              <div>• Publicités</div>
              <div>• Conversations chat</div>
              <div>• Visiteurs</div>
              <div>• Notifications de vente</div>
            </div>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Cette sauvegarde contient toutes les données de votre site au format JSON. 
            En cas de panne, vous pourrez récupérer toutes vos données grâce à ce fichier.
          </p>
        </div>
      `,
      attachments: [{
        filename: path.basename(backupPath),
        path: backupPath,
        contentType: 'application/json'
      }]
    };

    await transporter.sendMail(mailOptions);
    console.log('Sauvegarde envoyée par email avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la sauvegarde par email:', error);
  }
}

// Planifier les sauvegardes automatiques
function scheduleBackups() {
  const settings = database.read('settings.json');
  
  if (settings.backup?.autoBackup) {
    const backupTime = settings.backup.backupTime || '23:58';
    const [hour, minute] = backupTime.split(':');
    
    // Programmer la sauvegarde quotidienne à l'heure spécifiée
    cron.schedule(`${minute} ${hour} * * *`, async () => {
      console.log('Démarrage de la sauvegarde automatique...');
      try {
        await createBackup();
        console.log('Sauvegarde automatique terminée avec succès');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde automatique:', error);
      }
    });
    
    console.log(`Sauvegarde automatique programmée à ${backupTime} chaque jour`);
  }
}

// Démarrer les sauvegardes automatiques
scheduleBackups();

module.exports = router;
