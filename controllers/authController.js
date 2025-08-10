const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario (profesor/admin)
exports.register = async (req, res, next) => {
  try {
    console.log("Datos recibidos:", req.body);
    const { name, email, password, role } = req.body;
    
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// Iniciar sesión
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar email y contraseña
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Por favor ingresa email y contraseña' });
    }

    // Buscar usuario
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Obtener token JWT, crear cookie y enviar respuesta
const sendTokenResponse = (user, statusCode, res) => {
  // Crear token
  const token = user.getJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // AQUÍ AÑADÍ LAS SIGUIENTES DOS LÍNEAS PARA QUE FUNCIONE POSTMAN
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict', // Asegura que la cookie solo se envíe
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Enviar respuesta
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

// Obtener usuario actual
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};