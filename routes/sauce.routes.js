/*
    Path: /api/sauces
*/
const { Router } = require('express'); 
const { getAllSauces, getOneSauce, createSauces, updateSauces, deleteSauces. likeSauces} = require('../controllers/sauces.controller');
const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');
const { validatorJWT } = require('../middleware/validator-jwt');

const router = Router();

router.get('/', getAllSauces);

router.get('/:id', getOneSauce);

router.post('/', multer, createSauces);

router.put('/:id', multer, updateSauces);

router.delete('/:id', deleteSauces);

router.put('/:id/like', likeSauces);

module.exports = router;