const { db } = require('./firebaseConfig');

async function testConnection() {
  try {
    await db.collection('test').doc('test').set({ test: true });
    console.log('✅ Conexión exitosa a Firestore');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

testConnection();