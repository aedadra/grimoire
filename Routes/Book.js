const express = require('express');
const BookController = require('../Controllers/Book');
const auth = require('../Middlewares/auth');
const multer = require('../Middlewares/multer-config')
const sharp = require('../Middlewares/sharp');
const router = express.Router();


router.get('/', BookController.getAllBooks);
router.get('/bestrating', BookController.bestRatedBooks);
router.get('/:id', BookController.getOneBook);
router.post('/', auth, multer, sharp, BookController.createBook);
router.post('/:id/rating', auth, BookController.rateBook);
router.put('/:id', auth, multer, sharp, BookController.modifyBook);
router.delete('/:id', auth, BookController.deleteBook);



module.exports = router;