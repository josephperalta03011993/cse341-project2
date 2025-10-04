const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const auth = require('../middleware/authMiddleware');

router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getBookById);
router.post('/', auth, booksController.createBook);
router.put('/:id', auth, booksController.updateBook);
router.delete('/:id', auth, booksController.deleteBook);

module.exports = router;