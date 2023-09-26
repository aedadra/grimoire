const express = require('express');

const router = express.Router();

const BookController = require('../Controllers/Book');

router.post('/', BookController.createBook);
router.put('/:id', BookController.addBook);
router.delete('/:id', BookController.deleteBook);
router.get('/:id', BookController.getOneBook);
router.get('/', BookController.getAllBooks);

module.exports = router;