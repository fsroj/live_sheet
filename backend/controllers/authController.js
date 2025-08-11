const { admin } = require('../firebaseConfig');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Opcional: Guardar datos adicionales en Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      role: 'professor',
      createdAt: new Date()
    });

    res.status(201).json({ uid: user.uid, email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};