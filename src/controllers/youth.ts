import db from '../db';

const getActivities = async (req, res) => {
    try {
        const result = await db.getDb().db().collection('youth').find();
        result.toArray()
            .then((list) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(list);
            });
    } catch (err) {
        res.status(500).json({ error: `Error getting activities, Err: ${err}` });
    }
};

const getActivity = async (req, res) => {
    try {
        const date = req.params.date;
        const result = await db.getDb().db().collection('youth').find({ date: date });
        result.toArray()
            .then((list) => {
                if (list.length == 0) {
                    res.status(404).json({ error: `Cannot find activity with id: ${date}` });
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(list[0]);
                }
            })
            .catch((err) => {
                res.status(500).json({ error: `Error finding activity with id: ${date}, Err: ${err}` });
            });
    } catch (err) {
        res.status(500).json({ error: `Error getting the activity, Err: ${err}` });
    }
};

const createActivity = async (req, res) => {
    try {
        const activity = {
            date: req.body.date,
            combined: req.body.combined,
            activity: req.body.activity
        };
        const result = await db.getDb().db().collection('youth').insertOne(activity);
        if (result.acknowledged) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: 'Error creating activity' });
        }
    } catch (err) {
        res.status(500).json({ error: `Error creating activity, Err: ${err}` });
    }
};

export = {
    getActivities,
    getActivity,
    createActivity
}