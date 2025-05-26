import { Router } from "express";
/*import{createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser } from '../controllers/user.controller.js';
*/
    import { authenticate } from "../middlewares/auth.middleware.js";
import { mConfirmacion } from "../controllers/mConfirmacion.js"
const router = Router();
/*
router.post('/',authenticate,mConfirmacion ,createUser);
router.get('/',authenticate,getAllUsers);
router.get('/:id',authenticate,getUserById);
router.put('/:id',authenticate,updateUser);
router.delete('/:id',authenticate,deleteUser);*/

export default router;