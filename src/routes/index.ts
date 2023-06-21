import express from 'express';
import users from './users';

const router = express.Router();

router.use('/', express.static('public/'));
router.use('/login', express.static('public/login.html'));
router.use('/dashboard', express.static('public/dashboard.html'));
router.use('/users', users);

export = router;