/*
    Path: /api/sauces
*/
const { Router } = require('express'); 
const saucesCtrl = require('../controllers/sauces.controller');


const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

const router = Router();

router.get('/', auth, saucesCtrl.getAllSauces);

router.get('/:id', auth, saucesCtrl.getOneSauce);

router.post('/', auth, multer, saucesCtrl.createSauces);

router.put('/:id', auth, multer, saucesCtrl.updateSauces);

router.delete('/:id', auth, saucesCtrl.deleteSauces);

router.post('/:id/like', auth, saucesCtrl.likeSauces);

module.exports = router;