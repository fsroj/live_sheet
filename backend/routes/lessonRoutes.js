const express = require('express');
const { verifyFirebaseToken } = require('../middleware/firebaseAuth');
const { createLesson } = require('../controllers/lessonController');

const router = express.Router();

router.post('/', verifyFirebaseToken, createLesson);
// ... otras rutas