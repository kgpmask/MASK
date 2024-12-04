const router = require('express').Router();
const {
	getAnimeSkribbl,
	addAnimeSkribbl,
	updateAnimeSkribbl,
	deleteAnimeSkribbl
} = require('../database/handler');
const mongoose = require('mongoose');
const Skribbl = require('../database/schemas/Skribbl');
const Anime = mongoose.model('Anime', Skribbl);

// get anime list

router.get('/', async (req, res) => {
	try {
		const animeList = await Anime.find({});
		res.status(200).json(animeList);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching anime list', error });
	}
});

// add anime to list

router.post('/', async (req, res) => {
	const { _id, name } = req.body;
	try {
		const newAnime = new Anime({ _id, name });
		await newAnime.save();
		res.status(201).json({ message: 'Anime added successfully', newAnime });
	} catch (error) {
		res.status(400).json({ message: 'Error adding anime', error });
	}
});

router.post('/', async (req, res) => {
	const { name } = req.body;

	try {
		// Generate ID in consistent format with handler
		const _id = new Date().toISOString().slice(0, 10) + '-' + Math.random().toString(36).substr(2, 9);

		const newAnime = await addAnimeSkribbl({ _id, name });
		res.status(201).json({ message: 'Anime added successfully', anime: newAnime });
	} catch (error) {
		console.error('Error adding anime:', error);
		res.status(400).json({ message: 'Error adding anime', error: error.message });
	}
});


// update anime by id
router.put('/:id', async (req, res) => {
	const { name } = req.body;
	const { id } = req.params;
	try {
		const updatedAnime = await updateAnimeSkribbl({ id, name });
		if (!updatedAnime) {
			return res.status(404).json({ message: 'Anime not found' });
		}
		res.status(200).json({ message: 'Anime updated successfully', anime: updatedAnime });
	} catch (error) {
		console.error('Error updating anime:', error);
		res.status(400).json({ message: 'Error updating anime', error: error.message });
	}
});

// delete anime by id
router.delete('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const deletedAnime = await deleteAnimeSkribbl(id);
		if (!deletedAnime) {
			return res.status(404).json({ message: 'Anime not found' });
		}
		res.status(200).json({ message: 'Anime deleted successfully' });
	} catch (error) {
		console.error('Error deleting anime:', error);
		res.status(400).json({ message: 'Error deleting anime', error: error.message });
	}
});

module.exports = {
	route: '/skribbl',
	router
};
