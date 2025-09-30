import { Router } from 'express';
import { getCourierList, getItemList, goThroughPackage } from '../controllers/logic.js';

const router = Router();

router.get('/', getItemList);
router.get('/courier', getCourierList);
router.post('/processcart', goThroughPackage);

export default router;