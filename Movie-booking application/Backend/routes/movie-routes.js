const express = require('express');
const router = express.Router();
const { addMovie, getAllMovies, getMovieById } = require('../controllers/movie-controller');

router.get("/", getAllMovies);
router.post("/add", addMovie);
router.get("/:id", getMovieById);

module.exports = router;