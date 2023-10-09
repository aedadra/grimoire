const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.newFilename}`,
    });
    book.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => {
            res.status(400).json({ error })
        })
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'utilisateur non authorisé' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(Book => res.status(200).json(Book))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(Books => res.status(200).json(Books))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.newFilename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'utilisateur non autorisé' });
            } else {
                if (req.file) {
                    const imagePath = path.join(__dirname, '..', 'images', path.basename(book.imageUrl));
                    fs.unlink(imagePath, (error) => {
                        if (error) {
                            return ({ error })
                        }
                    });
                }
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.bestRatedBooks = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(Books => res.status(200).json(Books))
        .catch(error => res.status(401).json({ error }));
};

exports.rateBook = (req, res, next) => {
    const user = req.body.userId;
    if (user !== req.auth.userId) {
        res.status(401).json({ message: 'user not allowed' })
    } else {
        Book.findOne({ _id: req.params.id })
            .then(book => {
                if (book.ratings.find(rating => rating.userId === user)) {
                    res.status(401).json({ message: 'you already noted this book' })
                } else {
                    const rate = {
                        userId: user,
                        grade: req.body.rating,
                        _id: req.body._id
                    };
                    const updatedRatings = [
                        ...book.ratings,
                        rate
                    ];
                    function averageRating(ratings) {
                        const sum = ratings.reduce((total, rate) => total + rate.grade, 0);
                        const average = sum / ratings.length;
                        return parseFloat(average.toFixed(2));
                    };
                    const updateAverage = averageRating(updatedRatings);
                    Book.findOneAndUpdate(
                        { _id: req.params.id, 'ratings.userId': { $ne: user } },
                        { $push: { ratings: rate }, averageRating: updateAverage },
                        { new: true }
                    )
                        .then(updatedBook => res.status(201).json(updatedBook))
                        .catch(error => res.status(401).json({ error }));
                };
            })
            .catch(error => res.status(401).json({ error }));
    }
};