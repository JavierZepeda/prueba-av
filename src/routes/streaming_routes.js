const { Router } = require('express');
const router = Router();

const controller = require('../public/controllers/controllersDb');

router.get('/', (req, res) => {
    res.redirect('index.html');
});

router.post('/add', controller.saveData);
router.post('/addContact', controller.saveContact);
router.post('/addBluetooth', controller.saveBluetooth)

module.exports = router;