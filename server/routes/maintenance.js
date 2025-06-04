
const express = require('express');
const router = express.Router();
const database = require('../core/database');

// Assurer que le fichier de maintenance existe
database.ensureFile('maintenance.json', {
  maintenance: false,
  description: 'Site en maintenance. Nous reviendrons bientôt !'
});

// GET /api/maintenance - Récupérer le statut de maintenance
router.get('/', (req, res) => {
  try {
    const maintenanceData = database.read('maintenance.json');
    console.log('Données de maintenance lues:', maintenanceData);
    res.json(maintenanceData);
  } catch (error) {
    console.error('Erreur lors de la lecture des données de maintenance:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données de maintenance' });
  }
});

// PUT /api/maintenance - Mettre à jour le statut de maintenance
router.put('/', (req, res) => {
  try {
    const { maintenance, description } = req.body;
    
    const maintenanceData = {
      maintenance: maintenance || false,
      description: description || 'Site en maintenance. Nous reviendrons bientôt !',
      updatedAt: new Date().toISOString()
    };
    
    console.log('Mise à jour des données de maintenance:', maintenanceData);
    const writeSuccess = database.write('maintenance.json', maintenanceData);
    
    if (writeSuccess) {
      console.log('Données de maintenance sauvegardées avec succès');
      res.json(maintenanceData);
    } else {
      throw new Error('Échec de l\'écriture dans le fichier maintenance.json');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données de maintenance:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des données de maintenance' });
  }
});

module.exports = router;
