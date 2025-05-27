
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Trop de requêtes, veuillez réessayer plus tard' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuration pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/flash-sales/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'flash-sale-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Seuls les fichiers image sont autorisés!'), false);
    }
    cb(null, true);
  }
});

const flashSalesFilePath = path.join(__dirname, '../data/flash-sales.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

// Créer le dossier uploads/flash-sales s'il n'existe pas
const uploadsDir = path.join(__dirname, '../uploads/flash-sales');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Fonction pour nettoyer les entrées utilisateur
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return sanitizeHtml(input, {
      allowedTags: [], 
      allowedAttributes: {},
      disallowedTagsMode: 'recursiveEscape'
    });
  }
  return input;
};

// Middleware pour vérifier si le fichier existe
const checkFileExists = (req, res, next) => {
  if (!fs.existsSync(flashSalesFilePath)) {
    fs.writeFileSync(flashSalesFilePath, JSON.stringify([]));
  }
  next();
};

// Obtenir toutes les flash sales
router.get('/', apiLimiter, checkFileExists, (req, res) => {
  try {
    const flashSales = JSON.parse(fs.readFileSync(flashSalesFilePath));
    res.json(flashSales);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des flash sales' });
  }
});

// Obtenir la flash sale active
router.get('/active', apiLimiter, checkFileExists, (req, res) => {
  try {
    const flashSales = JSON.parse(fs.readFileSync(flashSalesFilePath));
    const now = new Date();
    
    const activeFlashSale = flashSales.find(sale => 
      sale.isActive && 
      new Date(sale.startDate) <= now && 
      new Date(sale.endDate) > now
    );
    
    if (activeFlashSale) {
      res.json(activeFlashSale);
    } else {
      res.status(404).json({ message: 'Aucune flash sale active' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la flash sale active' });
  }
});

// Obtenir les produits d'une flash sale
router.get('/:id/products', apiLimiter, checkFileExists, (req, res) => {
  try {
    const flashSaleId = sanitizeInput(req.params.id);
    const flashSales = JSON.parse(fs.readFileSync(flashSalesFilePath));
    const products = JSON.parse(fs.readFileSync(productsFilePath));
    
    const flashSale = flashSales.find(sale => sale.id === flashSaleId);
    if (!flashSale) {
      return res.status(404).json({ message: 'Flash sale non trouvée' });
    }
    
    const flashSaleProducts = products.filter(product => 
      flashSale.productIds.includes(product.id)
    ).map(product => ({
      ...product,
      originalPrice: product.price,
      discountedPrice: Math.round(product.price * (1 - flashSale.discount / 100) * 100) / 100
    }));
    
    res.json(flashSaleProducts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
  }
});

// Créer une nouvelle flash sale (admin seulement)
router.post('/', isAuthenticated, isAdmin, upload.single('bannerImage'), checkFileExists, (req, res) => {
  try {
    const title = sanitizeInput(req.body.title || '');
    const description = sanitizeInput(req.body.description || '');
    const discount = parseInt(req.body.discount) || 0;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const productIds = JSON.parse(req.body.productIds || '[]');
    
    const flashSales = JSON.parse(fs.readFileSync(flashSalesFilePath));
    
    const bannerImage = req.file ? `/uploads/flash-sales/${req.file.filename}` : null;
    
    const newFlashSale = {
      id: Date.now().toString(),
      title,
      description,
      discount,
      startDate,
      endDate,
      isActive: true,
      productIds,
      bannerImage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    flashSales.push(newFlashSale);
    fs.writeFileSync(flashSalesFilePath, JSON.stringify(flashSales, null, 2));
    
    res.status(201).json(newFlashSale);
  } catch (error) {
    console.error('Erreur lors de la création de la flash sale:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la flash sale' });
  }
});

// Mettre à jour une flash sale (admin seulement)
router.put('/:id', isAuthenticated, isAdmin, upload.single('bannerImage'), checkFileExists, (req, res) => {
  try {
    const flashSaleId = sanitizeInput(req.params.id);
    const flashSales = JSON.parse(fs.readFileSync(flashSalesFilePath));
    const index = flashSales.findIndex(sale => sale.id === flashSaleId);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Flash sale non trouvée' });
    }
    
    const title = sanitizeInput(req.body.title) || flashSales[index].title;
    const description = sanitizeInput(req.body.description) || flashSales[index].description;
    const discount = req.body.discount ? parseInt(req.body.discount) : flashSales[index].discount;
    const startDate = req.body.startDate || flashSales[index].startDate;
    const endDate = req.body.endDate || flashSales[index].endDate;
    const productIds = req.body.productIds ? JSON.parse(req.body.productIds) : flashSales[index].productIds;
    const isActive = req.body.isActive !== undefined ? req.body.isActive === 'true' : flashSales[index].isActive;
    
    let bannerImage = flashSales[index].bannerImage;
    if (req.file) {
      bannerImage = `/uploads/flash-sales/${req.file.filename}`;
    }
    
    flashSales[index] = {
      ...flashSales[index],
      title,
      description,
      discount,
      startDate,
      endDate,
      productIds,
      isActive,
      bannerImage,
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(flashSalesFilePath, JSON.stringify(flashSales, null, 2));
    res.json(flashSales[index]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la flash sale:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la flash sale' });
  }
});

// Supprimer une flash sale (admin seulement)
router.delete('/:id', isAuthenticated, isAdmin, checkFileExists, (req, res) => {
  try {
    const flashSaleId = sanitizeInput(req.params.id);
    const flashSales = JSON.parse(fs.readFileSync(flashSalesFilePath));
    const filteredFlashSales = flashSales.filter(sale => sale.id !== flashSaleId);
    
    if (filteredFlashSales.length === flashSales.length) {
      return res.status(404).json({ message: 'Flash sale non trouvée' });
    }
    
    fs.writeFileSync(flashSalesFilePath, JSON.stringify(filteredFlashSales, null, 2));
    res.json({ message: 'Flash sale supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la flash sale' });
  }
});

module.exports = router;
