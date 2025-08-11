const { db } = require('../firebaseConfig');
const admin = require('firebase-admin');

class LessonController {
  // Crear nueva lección
  async createLesson(req, res) {
    try {
      const lessonData = {
        ...req.body,
        createdBy: req.user.uid, // Usamos uid de Firebase Auth
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        isPublished: false
      };

      // Validación de campos obligatorios
      if (!lessonData.title || !lessonData.proficiencyLevel) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const lessonRef = await db.collection('lessons').add(lessonData);
      const newLesson = { id: lessonRef.id, ...lessonData };

      res.status(201).json(newLesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(500).json({ error: 'Error al crear la lección' });
    }
  }

  // Obtener todas las lecciones del usuario
  async getLessons(req, res) {
    try {
      const snapshot = await db.collection('lessons')
        .where('createdBy', '==', req.user.uid)
        .orderBy('createdAt', 'desc')
        .get();

      const lessons = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json(lessons);
    } catch (error) {
      console.error("Error getting lessons:", error);
      res.status(500).json({ error: 'Error al obtener lecciones' });
    }
  }

  // Obtener lección específica
  async getLesson(req, res) {
    try {
      const lessonId = req.params.id;
      const doc = await db.collection('lessons').doc(lessonId).get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Lección no encontrada' });
      }

      // Verificar propiedad
      if (doc.data().createdBy !== req.user.uid) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error("Error getting lesson:", error);
      res.status(500).json({ error: 'Error al obtener la lección' });
    }
  }

  // Actualizar lección
  async updateLesson(req, res) {
    try {
      const lessonId = req.params.id;
      const lessonRef = db.collection('lessons').doc(lessonId);

      // Primero verificar que la lección existe y pertenece al usuario
      const doc = await lessonRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Lección no encontrada' });
      }
      if (doc.data().createdBy !== req.user.uid) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      const updateData = {
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await lessonRef.update(updateData);
      const updatedLesson = await lessonRef.get();

      res.status(200).json({ id: updatedLesson.id, ...updatedLesson.data() });
    } catch (error) {
      console.error("Error updating lesson:", error);
      res.status(500).json({ error: 'Error al actualizar la lección' });
    }
  }

  // Eliminar lección
  async deleteLesson(req, res) {
    try {
      const lessonId = req.params.id;
      const lessonRef = db.collection('lessons').doc(lessonId);

      // Verificar propiedad antes de eliminar
      const doc = await lessonRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Lección no encontrada' });
      }
      if (doc.data().createdBy !== req.user.uid) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      await lessonRef.delete();
      res.status(200).json({ message: 'Lección eliminada correctamente' });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      res.status(500).json({ error: 'Error al eliminar la lección' });
    }
  }

  // Manejo de segmentos
  async addSegment(req, res) {
    try {
      const lessonId = req.params.id;
      const lessonRef = db.collection('lessons').doc(lessonId);

      // Verificar propiedad
      const doc = await lessonRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Lección no encontrada' });
      }
      if (doc.data().createdBy !== req.user.uid) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      const newSegment = {
        ...req.body,
        order: doc.data().segments?.length || 0
      };

      await lessonRef.update({
        segments: admin.firestore.FieldValue.arrayUnion(newSegment),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const updatedLesson = await lessonRef.get();
      res.status(200).json({ id: updatedLesson.id, ...updatedLesson.data() });
    } catch (error) {
      console.error("Error adding segment:", error);
      res.status(500).json({ error: 'Error al añadir segmento' });
    }
  }

  // Publicar lección
  async publishLesson(req, res) {
    try {
      const lessonId = req.params.id;
      const lessonRef = db.collection('lessons').doc(lessonId);

      // Verificar propiedad
      const doc = await lessonRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Lección no encontrada' });
      }
      if (doc.data().createdBy !== req.user.uid) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      await lessonRef.update({
        isPublished: true,
        publishedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.status(200).json({ message: 'Lección publicada correctamente' });
    } catch (error) {
      console.error("Error publishing lesson:", error);
      res.status(500).json({ error: 'Error al publicar la lección' });
    }
  }
}

module.exports = new LessonController();