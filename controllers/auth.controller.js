const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { generateJWT } = require("../helpers/jwt");
const User = require("../models/user.model");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDB = await User.findOne({ email });

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "données non valables.",
      });
    }
    // Verify Password
    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "données non valables.",
      });
    }

    // Generate the TOCKEN - JWT
    const userId = userDB.id;
    const token = await generateJWT(userId);

    res.json({
      userId: userId,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Erreur inattendu...",
    });
  }
};

const signup = async (req, res) => {

  //Hashage du mot de passe par Bcrypt, et demande de saler le mot de passe 10fois
  bcrypt.hash(req.body.password, 10)
      .then(
        hash => {
          // Chiffrement de l'email 
          key = "motDePasseInviolable:)";
          cipher = crypto.createCipher('aes192', key)
          cipher.update(req.body.email, 'binary', 'hex')
          encodedString = cipher.final('hex') 
          // Enregistrement des données de l'utilisateur
          const user = new User({
              email: encodedString,
              password: hash
            });
            // Verification des enregistrements cryptés
            console.log("Voici l'email encrypté : ", encodedString);
            console.log("Voici le mot de passe hashé : ", hash); 
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

module.exports = {
  login,
  signup
};