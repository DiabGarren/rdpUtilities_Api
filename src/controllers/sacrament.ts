import db from '../db';

const getAllDocs = async (req, res) => {
    try {
        const result = await db.getDb().db().collection('sacrament').find();
        result.toArray()
            .then((list) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(list);
            });
    } catch (err) {
        res.status(500).json({ error: `Error getting docs, Err: ${err}` });
    }
};

const getDoc = async (req, res) => {
    try {
        const date = req.params.date;
        const result = await db.getDb().db().collection('sacrament').find({ date: date });
        result.toArray()
            .then((list) => {
                if (list.length > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(list);
                } else {
                    res.status(400).json({ error: `Cannot find doc with date: ${date}` });
                }
            });
    } catch (err) {
        res.status(500).json({ error: `Error getting docs, Err: ${err}` });
    }
};

const createDoc = async (req, res) => {
    try {
        const doc = {
            date: req.body.date,
            conducting: req.body.conducting,
            announcements: req.body.announcements,
            openingPrayer: req.body.openingPrayer,
            hymns: {
                openingHymn: req.body.openingHymn,
                sacramentHymn: req.body.sacramentHymn,
                closingHymn: req.body.closingHymn
            },
            wardBusiness: {
                releases: req.body.releases,
                sustainings: req.body.sustainings,
                other: req.body.other
            },
            program: req.body.program,
            closingPrayer: req.body.closingPrayer
        };
        const response = await db.getDb().db().collection('sacrament').insertOne(doc);
        if (response.acknowledged) {
            res.status(200).json(response);
        } else {
            res.status(500).json({ error: 'An error occured while creating the doc.' });
        }
    } catch (err) {
        res.status(500).json({ error: `Error creating the doc, Err: ${err}` });
    }
};

const updateDoc = async (req, res) => {
    try {
        const date = req.params.date;
        const result = await db.getDb().db().collection('sacrament').find({ date: date });
        const existingDoc = await result.toArray();

        if (existingDoc.length > 0) {
            let
                conducting = req.body.conducting,
                announcements = req.body.announcements,
                openingPrayer = req.body.openingPrayer,
                openingHymn = req.body.openingHymn,
                sacramentHymn = req.body.sacramentHymn,
                closingHymn = req.body.closingHymn,
                releases = req.body.releases,
                sustainings = req.body.sustainings,
                other = req.body.other,
                program = req.body.program,
                closingPrayer = req.body.closingPrayer;

            if (!conducting) {
                conducting = existingDoc[0].conducting;
            }

            if (!announcements) {
                announcements = existingDoc[0].announcements;
            }

            if (!openingPrayer) {
                openingPrayer = existingDoc[0].openingPrayer;
            }

            if (!openingHymn) {
                openingHymn = existingDoc[0].openingHymn;
            }

            if (!sacramentHymn) {
                sacramentHymn = existingDoc[0].sacramentHymn;
            }

            if (!closingHymn) {
                closingHymn = existingDoc[0].closingHymn;
            }

            if (!releases) {
                releases = existingDoc[0].releases;
            }

            if (!sustainings) {
                sustainings = existingDoc[0].sustainings;
            }

            if (!other) {
                other = existingDoc[0].other;
            }

            if (!program) {
                program = existingDoc[0].program;
            }
            
            if (!closingPrayer) {
                closingPrayer = existingDoc[0].closingPrayer;
            }

            const doc = {
                date: date,
                conducting: conducting,
                announcements: announcements,
                openingPrayer: openingPrayer,
                hymns: {
                    openingHymn: openingHymn,
                    sacramentHymn: sacramentHymn,
                    closingHymn: closingHymn
                },
                wardBusiness: {
                    releases: releases,
                    sustainings: sustainings,
                    other: other
                },
                program: program,
                closingPrayer: closingPrayer
            };
            const response = await db.getDb().db().collection('sacrament').replaceOne({ date: date }, doc);
            if (response.acknowledged) {
                res.status(200).json(response);
            } else {
                res.status(500).json({ error: 'An error occured while updating the doc.' });
            }
        } else {
            res.status(400).json({ error: `Cannot find doc with date: ${date}` });
        }
    } catch (err) {
        res.status(500).json({ error: `Error updating the doc, Err: ${err}` });
    }
};

const deleteDoc = async (req, res) => {
    try {
        const date = req.params.date;
        const response = await db.getDb().db().collection('sacrament').deleteOne({ date: date });
        if (response.acknowledged) {
            res.status(204).json(response);
        } else {
            res.status(500).json({ error: 'An error occured while deleting the doc.' });
        }
    } catch (err) {
        res.status(500).json({ error: `Error deleting doc, Err: ${err}` });
    }
};

export = {
    getAllDocs,
    getDoc,
    createDoc,
    updateDoc,
    deleteDoc
}