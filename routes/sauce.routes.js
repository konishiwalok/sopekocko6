/*
    Path: /api/sauces
*/
const { Router } = require('express'); 
const { getAllSauces, getOneSauce, createSauces, updateSauces, deleteSauces, likeSauces} = require('../controllers/sauces.controller');


const multer = require('../middleware/multer-config');
const { validatorJWT } = require('../middleware/validator-jwt');

const router = Router();

router.get('/',validatorJWT, getAllSauces);

router.get('/:id',validatorJWT, getOneSauce);

router.post('/',validatorJWT, multer, createSauces);

router.put('/:id',validatorJWT, multer, updateSauces);

router.delete('/:id',validatorJWT, deleteSauces);

router.post('/:id/like',validatorJWT, likeSauces);

module.exports = router;