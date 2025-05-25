
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// Chemins vers les fichiers JSON
const refundsPath = path.join(__dirname, '../data/remboursements.json');
const ordersPath = path.join(__dirname, '../data/orders.json');
const commandesPath = path.join(__dirname, '../data/commandes.json');
const productsPath = path.join(__dirname, '../data/products.json');

// Configuration de multer pour l'upload des photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/refund-photos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    const extension = path.extname(file.originalname);
    cb(null, `refund-photo-${timestamp}-${randomNum}${extension}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  }
});

// Fonction utilitaire pour lire un fichier JSON
function readJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return [];
  }
}

// Fonction utilitaire pour écrire dans un fichier JSON
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Erreur lors de l'écriture dans le fichier ${filePath}:`, error);
    return false;
  }
}

// Route pour créer une demande de remboursement
router.post('/', isAuthenticated, upload.array('photos', 5), async (req, res) => {
  try {
    const { orderId, reason, customReason } = req.body;
    
    if (!orderId || !reason) {
      return res.status(400).json({ message: 'ID de commande et raison sont requis.' });
    }

    // Vérifier que la commande existe et appartient à l'utilisateur
    const orders = readJSON(ordersPath);
    const order = orders.find(o => o.id === orderId && o.userId === req.user.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    // Vérifier que le statut permet le remboursement
    const allowedStatuses = ['en préparation', 'en livraison', 'livrée'];
    if (!allowedStatuses.includes(order.status)) {
      return res.status(400).json({ message: 'Cette commande ne peut pas faire l\'objet d\'une demande de remboursement.' });
    }

    // Traitement des photos uploadées
    const photoUrls = req.files ? req.files.map(file => `/uploads/refund-photos/${file.filename}`) : [];

    // Créer la demande de remboursement
    const refunds = readJSON(refundsPath);
    const refundId = `REF-${Date.now()}`;
    
    const newRefund = {
      id: refundId,
      orderId: orderId,
      userId: req.user.id,
      userName: order.userName,
      userEmail: order.userEmail,
      orderItems: order.items,
      orderTotal: order.totalAmount,
      reason: reason,
      customReason: customReason || '',
      photos: photoUrls,
      status: 'vérification',
      adminComments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    refunds.push(newRefund);
    
    if (!writeJSON(refundsPath, refunds)) {
      throw new Error("Erreur lors de l'enregistrement de la demande de remboursement");
    }

    res.status(201).json(newRefund);
  } catch (error) {
    console.error('Erreur lors de la création de la demande de remboursement:', error);
    res.status(500).json({ message: 'Erreur interne du serveur: ' + error.message });
  }
});

// Route pour obtenir les demandes de remboursement de l'utilisateur
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const refunds = readJSON(refundsPath);
    const userRefunds = refunds.filter(refund => refund.userId === req.user.id);
    res.json(userRefunds);
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de remboursement:', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour obtenir une demande de remboursement spécifique
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const refunds = readJSON(refundsPath);
    const refund = refunds.find(r => r.id === req.params.id);
    
    if (!refund) {
      return res.status(404).json({ message: 'Demande de remboursement non trouvée.' });
    }
    
    // Vérifier les permissions
    if (req.user.role !== 'admin' && refund.userId !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }
    
    res.json(refund);
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande de remboursement:', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour obtenir toutes les demandes (admin seulement)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }
    
    const refunds = readJSON(refundsPath);
    res.json(refunds);
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de remboursement:', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour mettre à jour le statut d'une demande de remboursement (admin seulement)
router.put('/:id/status', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Seul un administrateur peut modifier le statut.' });
    }
    
    const { status, comment, decision } = req.body;
    const validStatuses = ['vérification', 'en étude', 'traité'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }
    
    // Si le statut est "traité", un commentaire et une décision sont obligatoires
    if (status === 'traité' && (!comment || !decision)) {
      return res.status(400).json({ message: 'Commentaire et décision sont obligatoires pour le statut traité.' });
    }
    
    const refunds = readJSON(refundsPath);
    const refundIndex = refunds.findIndex(r => r.id === req.params.id);
    
    if (refundIndex === -1) {
      return res.status(404).json({ message: 'Demande de remboursement non trouvée.' });
    }
    
    const refund = refunds[refundIndex];
    
    // Mettre à jour le statut
    refund.status = status;
    refund.updatedAt = new Date().toISOString();
    
    // Ajouter le commentaire de l'admin si fourni
    if (comment) {
      refund.adminComments.push({
        comment: comment,
        adminName: req.user.nom || req.user.email,
        timestamp: new Date().toISOString()
      });
    }
    
    // Si le statut est "traité", gérer la décision
    if (status === 'traité') {
      refund.decision = decision;
      
      if (decision === 'accepté') {
        // Supprimer la commande et restaurer le stock
        const orders = readJSON(ordersPath);
        const commandes = readJSON(commandesPath);
        const products = readJSON(productsPath);
        
        // Trouver et supprimer la commande
        const orderIndex = orders.findIndex(o => o.id === refund.orderId);
        const commandeIndex = commandes.findIndex(c => c.id === refund.orderId);
        
        if (orderIndex !== -1) {
          const order = orders[orderIndex];
          
          // Restaurer le stock des produits
          const updatedProducts = products.map(product => {
            const orderItem = order.items.find(item => item.productId === product.id);
            
            if (orderItem) {
              const newStock = (product.stock || 0) + orderItem.quantity;
              return {
                ...product,
                stock: newStock,
                isSold: newStock > 0
              };
            }
            
            return product;
          });
          
          // Sauvegarder les changements
          writeJSON(productsPath, updatedProducts);
          orders.splice(orderIndex, 1);
          writeJSON(ordersPath, orders);
          
          if (commandeIndex !== -1) {
            commandes.splice(commandeIndex, 1);
            writeJSON(commandesPath, commandes);
          }
        }
      }
    }
    
    refunds[refundIndex] = refund;
    
    if (!writeJSON(refundsPath, refunds)) {
      throw new Error("Erreur lors de la mise à jour");
    }
    
    res.json(refund);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur interne du serveur: ' + error.message });
  }
});

module.exports = router;
