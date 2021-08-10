/*
    Path: /api/auth
*/
const { Router } = require('express'); 
const { check } = require('express-validator');

const { login, signup } = require('../controllers/auth.controller');
const { validator } = require('../middleware/validator');

const router = Router();

router.post('/login',
    [
        check('email', 'Le courrier est obligatoire').isEmail(),
        check('password', 'Le mot de passe est obligatoire').not().isEmpty(),
        validator
    ],
    login
)

router.post('/signup',
    [
        check('email', 'Le courrier est obligatoire').isEmail(),
        check('password', 'Le mot de passe est obligatoire').not().isEmpty(),
        validator
    ],
    signup
)

module.exports = router;