const connectDB = require('../db/connection');
const { ObjectId } = require('mongodb');
const Joi = require('joi');

// Validation schema
const authorSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  birthYear: Joi.number().integer().optional(),
  nationality: Joi.string().optional(), 
  books: Joi.array().items(Joi.string()).optional()
});

// GET all authors
const getAllAuthors = async (req, res) => {
  try {
    const db = await connectDB();
    const authors = await db.collection('authors').find().toArray();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET author by ID
const getAuthorById = async (req, res) => {
  try {
    const db = await connectDB();
    const author = await db.collection('authors').findOne({ _id: new ObjectId(req.params.id) });
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE author
const createAuthor = async (req, res) => {
  const { error, value } = authorSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const db = await connectDB();
    const result = await db.collection('authors').insertOne(value);
    res.status(201).json({ insertedId: result.insertedId, ...value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE author
const updateAuthor = async (req, res) => {
  const { error, value } = authorSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const db = await connectDB();
    const result = await db.collection('authors').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: value }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: "Author not found" });
    res.status(200).json({ message: "Author updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE author
const deleteAuthor = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('authors').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Author not found" });
    res.status(200).json({ message: "Author deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
