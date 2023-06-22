import express from 'express';
import wardCouncil from '../controllers/wardCouncil';

const router = express.Router();

router.get('/', wardCouncil.getAllDocs);
router.get('/:date', wardCouncil.getDoc);

router.post('/', wardCouncil.createDoc);
router.put('/:date', wardCouncil.updateDoc);

router.delete('/:date', wardCouncil.deleteDoc);

export = router;