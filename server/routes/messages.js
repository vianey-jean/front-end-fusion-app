
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const authMiddleware = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const MESSAGES_FILE = path.join(__dirname, '../db/messages.json');

// Fonction utilitaire pour lire les messages
const readMessages = async () => {
  try {
    const data = await fs.readFile(MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Fichier messages non trouvé, création d\'un nouveau');
    await fs.writeFile(MESSAGES_FILE, JSON.stringify([], null, 2));
    return [];
  }
};

// Fonction utilitaire pour écrire les messages
const writeMessages = async (messages) => {
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
};

// GET /api/messages - Récupérer tous les messages
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await readMessages();
    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/messages - Créer un nouveau message
router.post('/', async (req, res) => {
  try {
    const { nom, email, sujet, message } = req.body;
    
    if (!nom || !email || !sujet || !message) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const messages = await readMessages();
    
    const newMessage = {
      id: uuidv4(),
      nom,
      email,
      sujet,
      message,
      dateEnvoi: new Date().toISOString(),
      isRead: false
    };

    messages.unshift(newMessage); // Ajouter au début
    await writeMessages(messages);
    
    console.log('✅ Nouveau message enregistré:', newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('❌ Erreur lors de la création du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/messages/:id/read - Marquer un message comme lu
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readMessages();
    
    const messageIndex = messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    messages[messageIndex].isRead = true;
    await writeMessages(messages);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/messages/:id/unread - Marquer un message comme non lu
router.put('/:id/unread', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readMessages();
    
    const messageIndex = messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    messages[messageIndex].isRead = false;
    await writeMessages(messages);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du marquage comme non lu:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/messages/:id - Supprimer un message
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readMessages();
    
    const filteredMessages = messages.filter(msg => msg.id !== id);
    if (filteredMessages.length === messages.length) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    await writeMessages(filteredMessages);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/messages/unread-count - Compter les messages non lus
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const messages = await readMessages();
    const unreadCount = messages.filter(msg => !msg.isRead).length;
    res.json({ count: unreadCount });
  } catch (error) {
    console.error('Erreur lors du comptage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
