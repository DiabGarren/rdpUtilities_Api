import db from '../db';
import bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const objectId = require('mongodb').ObjectId;


const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
};

const comparePassword = async (password: string, hash: string) => {
    const result = await bcrypt.compare(password, hash);
    return result;
};

const getUsers = async (req, res) => {
    try {
        const result = await db.getDb().db().collection('users').find();
        result.toArray().then((list) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(list);
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getUser = async (req, res) => {
    try {
        if (!objectId.isValid(req.params.id)) {
            res.status(400).json('A valid user id is required');
        }
        const id = new objectId(req.params.id);
        const result = await db.getDb().db().collection('users').find({ _id: id });
        result.toArray()
            .then((list) => {
                if (list.length == 0) {
                    res.status(400).send({ message: `Cannot find user with id: ${id}` });
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(list[0]);
                }
            })
            .catch((err) => {
                res.status(500).send({ message: `Error finding user with id: ${id}`, error: err });
            });
    } catch (err) {
        res.status(500).json(err);
    }
};

const createUser = async (req, res) => {
    try {
        const firstName = req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.substr(1).toLowerCase();
        const lastName = req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.substr(1).toLowerCase();
        const user = {
            firstName: firstName,
            lastName: lastName,
            username: req.body.username,
            email: req.body.email,
            password: await hashPassword(req.body.password),
            image: req.body.image
        };
        const response = await db.getDb().db().collection('users').insertOne(user);
        if (response.acknowledged && user.password != null) {
            res.status(201).json(response);
        } else {
            res.status(500).json('An error occured while creating the user.');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const login = async (req, res) => {
    try {
        // const user = {
        //     username: req.body.username,
        //     email: req.body.email,
        //     password: req.body.password,
        // };

        if (req.body.username == '' && req.body.email == '') {
            res.status(400).json({ message: 'Please enter a username or email.' });
            return;
        }

        let result;

        if (req.body.username == '') {
            result = await db.getDb().db().collection('users').find({ email: req.body.email });
        } else {
            result = await db.getDb().db().collection('users').find({ username: req.body.username });
        }
        
        const user = await result.toArray();

        if (user.length == 0) {
            res.status(400).json({ message: 'Cannot find user with that username or email.' });
            return;
        }

        const samePass = await comparePassword(req.body.password, user[0].password);

        if (samePass) {
            res.status(200).json({ message: `Welcome ${user[0].firstName} ${user[0].lastName}` });
        } else {
            res.status(400).json({ message: 'Password incorrect.' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export default {
    getUsers,
    getUser,
    createUser,
    login
};