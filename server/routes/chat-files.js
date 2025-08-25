
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middlewares/auth');
const db = require('../core/database');

const router = express.Router();

// Créer les dossiers nécessaires
const uploadsDir = path.join(__dirname, '../uploads');
const chatFilesDir = path.join(uploadsDir, 'chat-files');
const chatAudioDir = path.join(uploadsDir, 'chat-audio');
const chatVideoDir = path.join(uploadsDir, 'chat-video');

[chatFilesDir, chatAudioDir, chatVideoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration multer pour différents types de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = chatFilesDir;
    
    if (file.mimetype.startsWith('audio/')) {
      uploadPath = chatAudioDir;
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = chatVideoDir;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  },
  fileFilter: (req, file, cb) => {
    // Accepter tous les types de fichiers
    cb(null, true);
  }
});

// Route pour upload de fichiers dans le chat admin
router.post('/admin/:conversationId/upload', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const { conversationId } = req.params;
    const { messageText = '' } = req.body;
    
    // Charger les conversations admin
    const adminChatData = db.read('admin-chat.json');
    
    if (!adminChatData.conversations[conversationId]) {
      adminChatData.conversations[conversationId] = {
        messages: [],
        participants: [req.user.id]
      };
    }

    // Créer le message avec fichier
    const fileMessage = {
      id: `msg-${Date.now()}`,
      senderId: req.user.id,
      content: messageText || `Fichier partagé: ${req.file.originalname}`,
      timestamp: new Date().toISOString(),
      read: false,
      fileAttachment: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`
      }
    };

    adminChatData.conversations[conversationId].messages.push(fileMessage);
    
    // Sauvegarder
    db.write('admin-chat.json', adminChatData);

    res.json({
      message: 'Fichier uploadé avec succès',
      messageData: fileMessage
    });

  } catch (error) {
    console.error('Erreur upload admin:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload' });
  }
});

// Route pour upload de fichiers dans le chat service client
router.post('/service/:conversationId/upload', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const { conversationId } = req.params;
    const { messageText = '' } = req.body;
    
    // Charger les conversations client
    const clientChatData = db.read('client-chat.json');
    
    if (!clientChatData.conversations[conversationId]) {
      clientChatData.conversations[conversationId] = {
        messages: [],
        participants: [req.user.id],
        type: 'service'
      };
    }

    // Créer le message avec fichier
    const fileMessage = {
      id: `msg-${Date.now()}`,
      senderId: req.user.id,
      content: messageText || `Fichier partagé: ${req.file.originalname}`,
      timestamp: new Date().toISOString(),
      read: false,
      fileAttachment: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`
      }
    };

    clientChatData.conversations[conversationId].messages.push(fileMessage);
    
    // Sauvegarder
    db.write('client-chat.json', clientChatData);

    res.json({
      message: 'Fichier uploadé avec succès',
      messageData: fileMessage
    });

  } catch (error) {
    console.error('Erreur upload service:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload' });
  }
});

// Route pour télécharger un fichier
router.get('/download/:type/:filename', auth, (req, res) => {
  try {
    const { type, filename } = req.params;
    let filePath;

    switch (type) {
      case 'chat-files':
        filePath = path.join(chatFilesDir, filename);
        break;
      case 'chat-audio':
        filePath = path.join(chatAudioDir, filename);
        break;
      case 'chat-video':
        filePath = path.join(chatVideoDir, filename);
        break;
      default:
        return res.status(400).json({ message: 'Type de fichier invalide' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    // Envoyer le fichier
    res.download(filePath);

  } catch (error) {
    console.error('Erreur téléchargement:', error);
    res.status(500).json({ message: 'Erreur lors du téléchargement' });
  }
});

module.exports = router;
