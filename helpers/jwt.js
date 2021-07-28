const jwt = require("jsonwebtoken")

const generateJWT = ( uid ) => {

    return new Promise((resolve, reject) => {

        // ? se pueden agregar más campos diferentes al uid, como nombre etc, (no enviar info sensible)
        const payload = {
            uid,
        }
        jwt.sign( payload, process.env.JWT_KEY, {
            expiresIn: '6h'
        }, (err, token) => {
            if (err){
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token); 
            }

        });
    });

}

module.exports = {
    generateJWT: generateJWT,
}