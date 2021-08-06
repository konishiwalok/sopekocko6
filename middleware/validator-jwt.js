const jwt = require("jsonwebtoken")

const validatorJWT =(req, res, next) => {

    // Leer el token
    const token = req.headers.authorization.split(' ')[1]


    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });    
    }

    try {
        const { uid } = jwt.verify( token, process.env.JWT_KEY );

        req.userId = uid;

        next()
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });  
    }
}

module.exports = {
    validatorJWT
}