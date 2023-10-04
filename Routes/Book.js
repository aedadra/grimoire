const express = require('express');
const BookController = require('../Controllers/Book');
const auth = require('../Middlewares/auth');
const multer = require('../Middlewares/multer-config')

const router = express.Router();

router.get('/:id', BookController.getOneBook);
router.get('/', BookController.getAllBooks);
router.post('/', auth, multer, BookController.createBook);
router.put('/:id', auth, multer, BookController.addBook);
router.delete('/:id', auth, BookController.deleteBook);
router.get('/bestrating', BookController.bestRatedBooks);
router.post('/:id/rating', auth, BookController.rateBook);

module.exports = router;