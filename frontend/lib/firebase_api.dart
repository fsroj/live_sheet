import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FirebaseAPI {
  static Future<void> initialize() async {
    await Firebase.initializeApp(
      options: const FirebaseOptions(
        apiKey: "AIzaSyAFIL0_KWnc9Um4lcOl5Wif4M7wNf3xVZI",
        authDomain: "lify-280503.firebaseapp.com",
        projectId: "lify-280503",
        storageBucket: "lify-280503.firebasestorage.app",
        messagingSenderId: "54623925516",
        appId: "1:54623925516:web:0d8b9f9d1ef98b52fa0529"
      ),
    );
  }

  static FirebaseFirestore get firestore => FirebaseFirestore.instance;
}