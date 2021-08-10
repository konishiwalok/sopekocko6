const jwt = require("jsonwebtoken")

const generateJWT = ( uid ) => {

    return new Promise((resolve, reject) => {

        // and can add more different fields to the uid, such as name etc, (do not send sensitive info)
        const payload = {
            userId: uid,
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