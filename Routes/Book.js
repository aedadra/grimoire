const express = require('express');
const BookController = require('../Controllers/Book');
const auth = require('../Middlewares/auth');
const multer = require('../Middlewares/multer-config')

const router = express.Router();

router.post('/', auth, multer, BookController.createBook);
router.put('/:id', auth, multer, BookController.addBook);
router.delete('/:id', auth, BookController.deleteBook);
router.get('/:id', auth, BookController.getOneBook);
router.get('/', BookController.getAllBooks);

module.exports = router;