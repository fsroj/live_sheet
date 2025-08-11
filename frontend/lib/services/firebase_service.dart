import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class FirebaseService {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static final FirebaseAuth _auth = FirebaseAuth.instance;

  // Métodos para lecciones
  static Future<void> createLesson(Map<String, dynamic> lessonData) async {
    final user = _auth.currentUser;
    if (user == null) throw Exception('Usuario no autenticado');
    
    await _firestore.collection('lessons').add({
      ...lessonData,
      'createdBy': user.uid,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  static Stream<QuerySnapshot> getUserLessons() {
    final user = _auth.currentUser;
    if (user == null) throw Exception('Usuario no autenticado');
    
    return _firestore
        .collection('lessons')
        .where('createdBy', isEqualTo: user.uid)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }
}