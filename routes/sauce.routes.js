/*
    Path: /api/sauces
*/
const { Router } = require('express'); 

const router = Router();

router.get('/', getAllSauces)


module.exports = router;