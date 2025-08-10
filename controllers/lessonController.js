const Lesson = require('../models/lesson');

// @desc    Crear una nueva lección
// @route   POST /api/lessons
// @access  Privado (profesor/admin)
exports.createLesson = async (req, res, next) => {
  try {
    // Añadir el usuario que crea la lección
    req.body.createdBy = req.user.id;
    
    const lesson = await Lesson.create(req.body);
    
    res.status(201).json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Obtener todas las lecciones
// @route   GET /api/lessons
// @access  Privado
exports.getLessons = async (req, res, next) => {
  try {
    // Si es profesor, solo mostrar sus lecciones
    let query;
    if (req.user.role === 'professor') {
      query = Lesson.find({ createdBy: req.user.id });
    } else {
      query = Lesson.find();
    }
    
    const lessons = await query.sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Obtener una lección por ID
// @route   GET /api/lessons/:id
// @access  Privado
exports.getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lección no encontrada',
      });
    }
    
    // Verificar que el usuario es el creador o admin
    if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'No autorizado para acceder a esta lección',
      });
    }
    
    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Actualizar una lección
// @route   PUT /api/lessons/:id
// @access  Privado
exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lección no encontrada',
      });
    }
    
    // Verificar que el usuario es el creador o admin
    if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'No autorizado para actualizar esta lección',
      });
    }
    
    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Eliminar una lección
// @route   DELETE /api/lessons/:id
// @access  Privado (admin o creador)
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lección no encontrada',
      });
    }
    
    // Verificar que el usuario es el creador o admin
    if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'No autorizado para eliminar esta lección',
      });
    }
    
    await lesson.remove();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Añadir un segmento a una lección
// @route   POST /api/lessons/:id/segments
// @access  Privado
exports.addSegment = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lección no encontrada',
      });
    }
    
    // Verificar permisos
    if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'No autorizado para modificar esta lección',
      });
    }
    
    // Asignar orden al segmento
    req.body.order = lesson.segments.length;
    
    lesson.segments.push(req.body);
    await lesson.save();
    
    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Actualizar un segmento de una lección
// @route   PUT /api/lessons/:id/segments/:segmentId
// @access  Privado
exports.updateSegment = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lección no encontrada',
      });
    }
    
    // Verificar permisos
    if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'No autorizado para modificar esta lección',
      });
    }
    
    // Encontrar el segmento
    const segmentIndex = lesson.segments.findIndex(
      seg => seg._id.toString() === req.params.segmentId
    );
    
    if (segmentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Segmento no encontrado',
      });
    }
    
    // Actualizar el segmento
    lesson.segments[segmentIndex] = {
      ...lesson.segments[segmentIndex].toObject(),
      ...req.body,
    };
    
    await lesson.save();
    
    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Eliminar un segmento de una lección
// @route   DELETE /api/lessons/:id/segments/:segmentId
// @access  Privado
exports.deleteSegment = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lección no encontrada',
      });
    }
    
    // Verificar permisos
    if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'No autorizado para modificar esta lección',
      });
    }
    
    // Encontrar el segmento
    const segmentIndex = lesson.segments.findIndex(
      seg => seg._id.toString() === req.params.segmentId
    );
    
    if (segmentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Segmento no encontrado',
      });
    }
    
    // Eliminar el segmento
    lesson.segments.splice(segmentIndex, 1);
    
    // Reordenar los segmentos restantes
    lesson.segments.forEach((segment, index) => {
      segment.order = index;
    });
    
    await lesson.save();
    
    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};