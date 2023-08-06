import express from 'express';
import assignments from '../controllers/assignments';

const router = express.Router();

router.get('/', assignments.getAll);
router.get('/:id', assignments.getById);

router.post('/', assignments.createAssignment);
router.put('/:id', assignments.updateAssignment);

router.delete('/:id', assignments.deleteAssignment);

export = router;