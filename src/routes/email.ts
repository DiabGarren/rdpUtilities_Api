import express from 'express';
import email from '../controllers/email';

const router = express.Router();

router.post('/:id', email);

export = router;