import express from 'express';
import users from  '../controllers/users';

const router = express.Router();

router.get('/', users.getUsers);
router.get('/:id', users.getUser);
router.get('/email/:email', users.getUserByEmail);

router.post('/', users.createUser);
router.post('/login', users.login);

router.put('/:id', users.updateUser);

export = router;