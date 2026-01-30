const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post('/upload', auth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: err.message });
    }
    
    handleFileUpload(req, res);
  });
});

function handleFileUpload(req, res) {
  console.log('=== FILE UPLOAD REQUEST RECEIVED ===');
  console.log('Request headers:', req.headers);
  console.log('Request user:', req.user ? req.user._id : 'No user');
  console.log('Request file:', req.file);
  
  try {
    if (!req.file) {
      console.log('No file uploaded in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const responseData = {
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`
      }
    };
    
    console.log('Sending successful response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('File upload error:', error);
    const errorResponse = { message: 'File upload failed', error: error.message };
    console.log('Sending error response:', errorResponse);
    res.status(500).json(errorResponse);
  }
}

module.exports = router;