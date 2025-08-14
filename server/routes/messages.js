
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');

const router = express.Router();
const messagesPath = path.join(__dirname, '../db/messages.json');

// Fonction utilitaire pour lire les messages
async function readMessages() {
  try {
    const data = await fs.readFile(messagesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors de la lecture des messages:', error);
    return [];
  }
}

// Fonction utilitaire pour écrire les messages
async function writeMessages(messages) {
  try {
    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'écriture des messages:', error);
    return false;
  }
}

// GET /api/messages - Récupérer tous les messages
router.get('/', auth, async (req, res) => {
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

    messages.unshift(newMessage);
    
    const success = await writeMessages(messages);
    
    if (success) {
      console.log('Nouveau message créé:', newMessage);
      res.status(201).json(newMessage);
    } else {
      res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/messages/:id/read - Marquer un message comme lu
router.put('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readMessages();
    
    const messageIndex = messages.findIndex(msg => msg.id === id);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    messages[messageIndex].isRead = true;
    
    const success = await writeMessages(messages);
    
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/messages/:id/unread - Marquer un message comme non lu
router.put('/:id/unread', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readMessages();
    
    const messageIndex = messages.findIndex(msg => msg.id === id);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    messages[messageIndex].isRead = false;
    
    const success = await writeMessages(messages);
    
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  } catch (error) {
    console.error('Erreur lors du marquage comme non lu:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/messages/:id - Supprimer un message
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readMessages();
    
    const messageIndex = messages.findIndex(msg => msg.id === id);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    messages.splice(messageIndex, 1);
    
    const success = await writeMessages(messages);
    
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/messages/unread-count - Compter les messages non lus
router.get('/unread-count', auth, async (req, res) => {
  try {
    const messages = await readMessages();
    const unreadCount = messages.filter(msg => !msg.isRead).length;
    res.json({ count: unreadCount });
  } catch (error) {
    console.error('Erreur lors du comptage des messages non lus:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
