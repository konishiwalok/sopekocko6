const bcrypt = require("bcryptjs");
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
  console.log('acces to signup');
  const { email, password } = req.body;

  try {
    const userDB = await User.findOne({ email });

    if (userDB) {
      return res.status(400).json({
        ok: false,
        msg: "Le Courrier est déjà enregistré",
      });
    }

    const user = new User(req.body);

    // encrypt Password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    res.json({
        message: `utilisateur ${email} enregistré`
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Erreur inattendu...",
    });
  }
};

module.exports = {
  login,
  signup
};