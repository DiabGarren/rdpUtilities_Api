import express from 'express';
import bishopric from '../controllers/bishopric';

const router = express.Router();

router.get('/', bishopric.getAllDocs);
router.get('/:date', bishopric.getDoc);

router.post('/', bishopric.createDoc);
router.put('/:date', bishopric.updateDoc);

router.delete('/:date', bishopric.deleteDoc);

export = router;