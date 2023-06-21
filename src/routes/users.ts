import express from 'express';
import users from  '../controllers/users';

const router = express.Router();

router.get('/users', users.getUsers);
router.get('/users/:id', users.getUser);

router.post('/users/', users.createUser);
router.post('/users/login', users.login);

export = router;