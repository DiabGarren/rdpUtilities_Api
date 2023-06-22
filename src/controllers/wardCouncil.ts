import db from '../db';

const getAllDocs = async (req, res) => {
    try {
        const result = await db.getDb().db().collection('wardCouncil').find();
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
        const result = await db.getDb().db().collection('wardCouncil').find({ date: date });
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
        res.status(500).json({ error: `Error getting doc, Err: ${err}` });
    }
};

const createDoc = async (req, res) => {
    try {
        const wc = {
            date: req.body.date,
            agenda: req.body.agenda,
            notes: req.body.notes
        };
        const response = await db.getDb().db().collection('wardCouncil').insertOne(wc);
        if (response.acknowledged) {
            res.status(200).json(response);
        } else {
            res.status(500).send({ error: 'An error occured while creating the doc.' });
        }
    } catch (err) {
        res.status(500).json({ error: `Error creating the doc, Err: ${err}` });
    }
};

const updateDoc = async (req, res) => {
    try {
        const date = req.params.date;
        const result = await db.getDb().db().collection('wardCouncil').find({ date: date });
        const existingDoc = await result.toArray();
        
        if (existingDoc.length > 0) {
            let agenda = req.body.agenda, notes = req.body.notes;

            if (!agenda) {
                agenda = existingDoc[0].agenda;
            }
            if (!notes) {
                notes = existingDoc[0].notes;
            }

            const doc = {
                date: date,
                agenda: agenda,
                notes: notes
            };
            const response = await db.getDb().db().collection('wardCouncil').replaceOne({ date: date }, doc);
            if (response.acknowledged) {
                res.status(200).json(response);
            } else {
                res.status(500).send({ error: 'An error occured while updating the doc.' });
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
        const response = await db.getDb().db().collection('wardCouncil').deleteOne({ date: date });
        if (response.acknowledged) {
            res.status(204).json(response);
        } else {
            res.status(500).send({ error: 'An error occured while deleting the doc.' });
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