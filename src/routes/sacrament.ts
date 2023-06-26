import express from 'express';
import sacrament from '../controllers/sacrament';

const router = express.Router();

router.get('/', sacrament.getAllDocs);
router.get('/:date', sacrament.getDoc);

router.post('/', sacrament.createDoc);
router.put('/:date', sacrament.updateDoc);

router.delete('/:date', sacrament.deleteDoc);

export = router;