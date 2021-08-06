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
        msg: "Datos no validos.",
      });
    }
    // Verificar Contraseña
    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Datos no validos.",
      });
    }

    // Generar el TOCKEN - JWT
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
      msg: "Error inesperado...",
    });
  }
};

const signup = async (req, res) => {
  console.log('Entro al signup');
  const { email, password } = req.body;

  try {
    const userDB = await User.findOne({ email });

    if (userDB) {
      return res.status(400).json({
        ok: false,
        msg: "El Correo ya está registrado",
      });
    }

    const user = new User(req.body);

    // Encriptar Password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    res.json({
        message: `usuario ${email} registrado`
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

module.exports = {
  login,
  signup
};