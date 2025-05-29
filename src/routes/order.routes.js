import{Router} from 'express';

import{createOrder,getOrdersById,getAllOrders,updateOrder,cancelOrder, renderOrdersPage } from '../controllers/order.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/',authenticate,renderOrdersPage);

router.post('/',authenticate,createOrder);
//router.get('/',authenticate,getAllOrders);
router.get('/:id',authenticate,getOrdersById);
router.put('/:id',authenticate,updateOrder);
router.delete('/:id',authenticate,cancelOrder );


export default router;