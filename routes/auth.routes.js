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
        check('email', 'El Correo es obligatorio').isEmail(),
        check('password', 'La Contraseña es obligatoria').not().isEmpty(),
        validator
    ],
    login
)

router.post('/signup',
    [
        check('email', 'El Correo es obligatorio').isEmail(),
        check('password', 'La Contraseña es obligatoria').not().isEmpty(),
        validator
    ],
    signup
)

module.exports = router;