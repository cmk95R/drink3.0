import { Router } from "express";
import{createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser } from '../controllers/user.controller.js';
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();

router.post('/',authenticate,createUser);
router.get('/',authenticate,getAllUsers);
router.get('/:id',authenticate,getUserById);
router.put('/:id',authenticate,updateUser);
router.delete('/:id',authenticate,deleteUser);

export default router;