import express from 'express';
import youth from '../controllers/youth';

const router = express.Router();

router.get('/', youth.getActivities);
router.get('/:date', youth.getActivity);

router.post('/', youth.createActivity);

export = router;