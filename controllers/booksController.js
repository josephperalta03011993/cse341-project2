const connectDB = require('../db/connection');
const { ObjectId } = require('mongodb');
const Joi = require('joi');

// Validation schema
const bookSchema = Joi.object({
  title: Joi.string().trim().required(),
  author: Joi.string().trim().required(), // Should match author name or ID
  isbn: Joi.string().trim().required(),
  publishedYear: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
  genre: Joi.string().optional().allow(''),
  language: Joi.string().optional().allow(''),
  pages: Joi.number().integer().min(1).optional(),
  publisher: Joi.string().optional().allow(''),
  available: Joi.boolean().optional().default(true)
});

// GET all books
const getAllBooks = async (req, res) => {
  try {
    const db = await connectDB();
    const books = await db.collection('books').find().toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET book by ID
const getBookById = async (req, res) => {
  try {
    const db = await connectDB();
    const book = await db.collection('books').findOne({ _id: new ObjectId(req.params.id) });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE book
const createBook = async (req, res) => {
  const { error, value } = bookSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const db = await connectDB();
    const result = await db.collection('books').insertOne(value);
    res.status(201).json({ insertedId: result.insertedId, ...value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE book
const updateBook = async (req, res) => {
  const { error, value } = bookSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const db = await connectDB();
    const result = await db.collection('books').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: value }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: "Book not found" });
    res.status(200).json({ message: "Book updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE book
const deleteBook = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('books').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Book not found" });
    res.status(200).json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
