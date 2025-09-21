const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authorsController');

// CREATE
router.post('/', authorsController.createAuthor);

// READ all
router.get('/', authorsController.getAllAuthors);

// READ one
router.get('/:id', authorsController.getAuthorById);

// UPDATE
router.put('/:id', authorsController.updateAuthor);

// DELETE
router.delete('/:id', authorsController.deleteAuthor);

module.exports = router;