import db from '../db';
import bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const objectId = require('mongodb').ObjectId; 
import nodemailer from 'nodemailer';


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
        result.toArray()
            .then((list) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(list);
            });
    } catch (err) {
        res.status(500).json({ error: `Error getting users, Err: ${err}` });
    }
};

const getUser = async (req, res) => {
    try {
        if (!objectId.isValid(req.params.id)) {
            res.status(400).json({ error: 'A valid user id is required' });
        }
        const id = new objectId(req.params.id);
        const result = await db.getDb().db().collection('users').find({ _id: id });
        result.toArray()
            .then((list) => {
                if (list.length == 0) {
                    res.status(400).json({ error: `Cannot find user with id: ${id}` });
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(list[0]);
                }
            })
            .catch((err) => {
                res.status(500).json({ error: `Error finding user with id: ${id}, Err: ${err}` });
            });
    } catch (err) {
        res.status(500).json({ error: `Error getting the user, Err: ${err}` });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const result = await db.getDb().db().collection('users').find({ email: req.params.email });
        result.toArray()
            .then((list) => {
                if (list.length == 0) {
                    res.status(400).json({ error: `Cannot find user with email: ${req.body.email}` });
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(list[0]);
                }
            })
            .catch((err) => {
                res.status(500).json({ error: `Error finding user with email: ${req.body.email}, Err: ${err}` });
            });
    } catch (err) {
        res.status(500).json({ error: `Error getting the user, Err: ${err}` });
    }
};

const createUser = async (req, res) => {
    try {
        const firstName = req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.substr(1).toLowerCase();
        const lastName = req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.substr(1).toLowerCase();
        const user = {
            firstName: firstName,
            lastName: lastName,
            username: req.body.username.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: await hashPassword(req.body.password),
            level: req.body.level
        };
        const result = await db.getDb().db().collection('users').find();
        let existing = false;
        const users = await result.toArray();
        users.forEach(exUser => {
            if (exUser.username == user.username && exUser.email == user.email) {
                res.status(400).json({ error: 'This username and email is already in use.' });
                existing = true;
            }
            if (exUser.username == user.username){
                res.status(400).json({ error: 'This username is already in use.' });
                existing = true;
            } else if (exUser.email == user.email) {
                res.status(400).json({ error: 'This email is already in use.' });
                existing = true;
            }
        });

        if (!existing) {
            const response = await db.getDb().db().collection('users').insertOne(user);

            if (response.acknowledged && user.password != null) {
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL,
                        pass: process.env.GMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: process.env.GMAIL,
                    to: user.email,
                    subject: 'Welcome to rdpUtilties',
                    html: `<h2>Dear ${user.firstName} ${user.lastName}</h2><p>Thank you for creating a rdpUtilties account.<br>Contact <a href="mailto:garrendiab@gmail.com">@Garren Diab</a> if you have any queries or concerns.</p>`
                };

                transport.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Email sent: ${info.response}`);
                        const transport = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.GMAIL,
                                pass: process.env.GMAIL_PASS
                            }
                        });
        
                        const mailOptions = {
                            from: process.env.GMAIL,
                            to: process.env.GMAIL,
                            subject: 'New rdpUtilites user',
                            html: `<h2>${user.firstName} ${user.lastName} has just created an account.</h2>`
                        };
        
                        transport.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err);
                                // res.status(500).json({ error: 'Error occured sending email' });
                            } else {
                                console.log(`Email sent: ${info.response}`);
                                // res.status(201).json(info.response);
                            }
                        });
                    }
                });

                res.status(201).json(response);
            } else {
                res.status(500).json({ error: 'Error creating user' });
            }
        }

    } catch (err) {
        res.status(500).json({ error: `Error creating the user, Err: ${err}` });
    }
};

const updateUser = async (req, res) => {
    try {
        if (!objectId.isValid(req.params.id)) {
            res.status(400).json({ error: 'A valid user id is required' });
        }
        const id = new objectId(req.params.id);

        const result = await db.getDb().db().collection('users').find({ _id: id});
        const current = await result.toArray();

        if (current.length > 0) {
            let firstName = req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.substr(1).toLowerCase();
            if (!firstName) {
                firstName = current[0].firstName;
            }
            let lastName = req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.substr(1).toLowerCase();
            if (!lastName) {
                lastName = current[0].lastName;
            }
            let username = req.body.username.toLowerCase();
            if (!username) {
                username = current[0].username;
            }
            let email = req.body.email.toLowerCase();
            if (!email) {
                email = current[0].email;
            }
            let password = req.body.password;
            if (!password) {
                password = current[0].password;
            } else {
                password = await hashPassword(req.body.password);
            }
            let level = req.body.level;
            if (!level) {
                level = current[0].level;
            }

            const user = {
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: password,
                level: level
            };
            const response = await db.getDb().db().collection('users').replaceOne({ _id: id }, user);
            if (response.acknowledged && user.password != null) {
                res.status(204).json(response);
            } else {
                res.status(500).json({ error: 'Error updating user' });
            }
        }

    } catch (err) {
        res.status(500).json({ error: `Error updating user, Err: ${err}` });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (!objectId.isValid(req.params.id)) {
            res.status(400).json({ error: 'A valid user id is required' });
        }
        const id = new objectId(req.params.id);
        const response = await db.getDb().db().collection('users').deleteOne({ _id: id });
        if (response.acknowledged) {
            res.status(204).json(response);
        } else {
            res.status(500).json({ error: 'Error deleting user' });
        }
    } catch (err) {
        res.status(500).json({ error: `Error deleting user, Err: ${err}` });
    }
};

const login = async (req, res) => {
    try {
        if (req.body.username == '' && req.body.email == '') {
            res.status(400).json({ error: 'Please enter a username or email.' });
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
            res.status(400).json({ error: 'Cannot find user with that username or email.' });
            return;
        }

        const samePass = await comparePassword(req.body.password, user[0].password);

        if (samePass) {
            res.status(200).json({ message: `Welcome ${user[0].firstName} ${user[0].lastName}`, id: user[0]._id });
        } else {
            res.status(400).json({ error: 'Password incorrect.' });
        }
    } catch (err) {
        res.status(500).json({ error: `Error logging in, Err: ${err}` });
    }
};

export = {
    getUsers,
    getUserByEmail,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    login,
}