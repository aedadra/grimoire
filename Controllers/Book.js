const Book = require('../models/Book');

exports.createBook= (req, res, next) => {
    delete req.body.id;
    const book = new Book({
      ...req.body
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
      next();
    };
  
    exports.addBook = (req, res, next) => {
      Book.updateOne({ id: req.params.id }, { ...req.body, id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
    };
  
    exports.deleteBook = (req, res, next) => {
      Book.deleteOne({ id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    };
  
    exports.getOneBook = (req, res, next) => {
      Book.findOne({ id: req.params.id })
        .then(Book => res.status(200).json(Book))
        .catch(error => res.status(404).json({ error }));
        next()
    };
  
  exports.getAllBooks = (req, res, next) => {
    Book.find()
      .then(Books => res.status(200).json(Books))
      .catch(error => res.status(400).json({ error }));
      next();
  };