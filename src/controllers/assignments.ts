import db from '../db';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const objectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await db.getDb().db().collection('assignments').find();
        result.toArray()
            .then((list) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(list);
            });
    } catch (err) {
        res.status(500).json({ error: `Error getting docs, Err: ${err}` });
    }
};

const getById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!objectId.isValid(id)) {
            res.status(400).json({ error: 'A valid user id is required' });
        }
        const result = await db.getDb().db().collection('assignments').find({ userId: id });
        result.toArray()
            .then((list) => {
                if (list.length > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(list);
                } else {
                    res.status(404).json({ error: 'Cannot find any assignments for this user' });
                }
            })
            .catch((err) => {
                res.status(500).json({ error: `Error finding assignments for user ${id}, Err: ${err}` });
            });
    } catch (err) {
        res.status(500).json({ error: `Error finding assignments, Err: ${err}` });
    }
};

const createAssignment = async (req, res) => {
    try {
        const id = req.body.userId;
        if (!objectId.isValid(id)) {
            res.status(400).json({ error: 'A valid user id is required' });
        }
        const assignment = {
            userId: id,
            assignment: req.body.assignment,
            completed: req.body.completed
        };
        const result = await db.getDb().db().collection('assignments').insertOne(assignment);
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json({ error: 'Error creating assignment' });
        }
    } catch (err) {
        res.status(500).json({ error: `Error creating assignment, Err: ${err}` });
    }
};

const updateAssignment = async (req, res) => {
    try {
        const id = req.params.id;
        if (!objectId.isValid(id) || !objectId.isValid(req.body.userId)) {
            res.status(400).json({ error: 'A valid user id is required' });
        }
        const assignment = {
            userId: req.body.userId,
            assignment: req.body.assignment,
            completed: req.body.completed
        };
        const result = await db.getDb().db().collection('assignments').replaceOne({ _id: new objectId(id) }, assignment);
        if (result.acknowledged) {
            res.status(200).json(result);
        } else {
            res.status(400).json({ error: 'Error updating assignment' });
        }
    } catch (err) {
        res.status(500).json({ error: `Error updating assignment, Err: ${err}` });
    }
};

const deleteAssignment =async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        
        if (!objectId.isValid(id)) {
            res.status(400).json({ error: 'A valid user id is required' });
        }
        const result = await db.getDb().db().collection('assignments').deleteOne({ _id: new objectId(id) });
        if (result.acknowledged) {
            res.status(200).json(result);
        } else {
            res.status(400).json({ error: 'Error deleting assignment' });
        }
    } catch (err) {
        res.status(500).json({ error: `Error deleting assignment, Err: ${err}` });
    }
};

export = {
    getAll,
    getById,
    createAssignment,
    updateAssignment,
    deleteAssignment
}