import{Router} from 'express';

import{createOrder,getOrdersById,updateOrder,cancelOrder } from '../controllers/order.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();


router.post('/',authenticate,createOrder);
router.get('/:id',authenticate,getOrdersById);
router.put('/:id',authenticate,updateOrder);
router.delete('/:id',authenticate,cancelOrder );


export default router;