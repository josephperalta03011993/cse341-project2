const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authorsController');
const auth = require('../middleware/authMiddleware');

// CREATE
router.post('/', auth, authorsController.createAuthor);

// READ all
router.get('/', authorsController.getAllAuthors);

// READ one
router.get('/:id', authorsController.getAuthorById);

// UPDATE
router.put('/:id', auth, authorsController.updateAuthor);

// DELETE
router.delete('/:id', auth, authorsController.deleteAuthor);

module.exports = router;