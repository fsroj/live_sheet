const mongoose = require('mongoose');

const questionOptionSchema = new mongoose.Schema({
  text: String,
  correct: Boolean,
  feedback: String,
});

const matchingPairSchema = new mongoose.Schema({
  item: String,
  match: String,
});

const segmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['texto', 'selección múltiple', 'mover y desplazar', 'combinación', 'completación'],
    required: true,
  },
  content: {
    // Para tipo 'texto'
    text: { type: String, default: '' },
    // Para tipo 'selección múltiple'
    question: { type: String, default: '' },
    options: [questionOptionSchema],
    // Para tipo 'combinación' (matching)
    pairs: [matchingPairSchema],
    // Para tipo 'completación'
    clozeText: { type: String, default: '' },
    blanks: [{
      answer: String,
      hint: String,
    }],
  },
  comments: [{
    text: String,
    createdAt: { type: Date, default: Date.now },
  }],
  emphasis: { type: Boolean, default: false },
  hasSeparator: { type: Boolean, default: false },
  order: { type: Number, required: true },
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor ingresa un título para la lección'],
  },
  proficiencyLevel: {
    type: String,
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    required: true,
  },
  aim: {
    type: String,
    required: [true, 'Por favor ingresa el objetivo de la lección'],
  },
  activityTypes: {
    type: [String],
    enum: ['lectura', 'escritura', 'audición', 'conversación', 'gramática', 'vocabulario'],
    required: true,
  },
  focus: {
    type: String,
    required: [true, 'Por favor ingresa el enfoque de la lección'],
  },
  estimatedTime: {
    type: Number, // en minutos
    required: [true, 'Por favor ingresa el tiempo estimado de la lección'],
  },
  summary: {
    type: String,
    required: [true, 'Por favor ingresa un resumen de la lección'],
  },
  segments: [segmentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
});

// Actualizar la fecha de modificación antes de guardar
lessonSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema);