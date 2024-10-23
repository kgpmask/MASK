const router = require('express').Router();
const dbh = require('../database/handler');
const mongoose = require('mongoose');

schema = {
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    name: {type: String, required: true, match: /^[a-zA-Z0-9\s'":]+$/},
}
const Anime = mongoose.model('Anime', schema);

//get anime list

router.get('/', async (req, res) => {
    try {
        const animeList = await Anime.find({});
        res.status(200).json(animeList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching anime list', error });
    }
});

//add anime to list

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

//update anime by id

router.put('/:id', async (req, res) => {
    const { name } = req.body;
    try {
        const updatedAnime = await Anime.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!updatedAnime) {
            return res.status(404).json({ message: 'Anime not found' });
        }
        res.status(200).json({ message: 'Anime updated successfully', updatedAnime });
    } catch (error) {
        res.status(400).json({ message: 'Error updating anime', error });
    }
});

module.exports = {
    route: '/skribbl',
    router 
};
