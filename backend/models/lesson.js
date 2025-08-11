const { db } = require('../firebaseConfig');

class Lesson {
  constructor({ title, proficiencyLevel, segments = [], createdBy }) {
    this.title = title;
    this.proficiencyLevel = proficiencyLevel;
    this.segments = segments;
    this.createdBy = createdBy;
    this.createdAt = new Date();
  }

  static async create(lessonData) {
    const lessonRef = db.collection('lessons').doc();
    await lessonRef.set(lessonData);
    return { id: lessonRef.id, ...lessonData };
  }

  static async findById(id) {
    const doc = await db.collection('lessons').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }
}

module.exports = Lesson;