import { Router } from "express";
import{createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
    renderProductMainPage
} from '../controllers/product.controller.js';


import { authenticate}  from "../middlewares/auth.middleware.js";
const router = Router();

router.post('/',authenticate,createProduct);
router.get('/',authenticate,getAllProducts);
router.get('/:id',authenticate,getProductById,);
router.put('/:id',authenticate,updateProduct,);
router.delete('/:id',authenticate,deleteProduct,);
router.get('/', renderProductMainPage);

export default router;