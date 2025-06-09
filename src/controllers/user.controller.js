import mongoose from 'mongoose';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';


////////////////////////////////Crear Usuario/////////////////////////////////////////////////////////
//Fijarse si se queda o no.
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createUser = async(req,res)=>{
    try{
        const { name, email, rol, password, edad} = req.body;
        if(!email|| !password){  
            return res.status(400).json({message:'Email y contraseña son obligatorios'});
        }

        const existignUser = await User.findOne({email});
        if(existignUser){
            return res.status(400).json({message:'El correo ya esta registrado'});
        }
        //Hasheo de la contraseña
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({ name, email, rol, password: hashedPassword, edad });
        await newUser.save();
        const { password: _, ...userData } = newUser.toObject();
        res.status(201).json(newUser);
    }catch(error){
       console.log(error);
       res.status(500).json({error:'Hubo un error, prueba mas tarde.'});
    }

};

///////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////Get All////////////////////////////////////////////////////////////

export const getAllUsers = async(req,res)=>{
    try{
        const users = await User.find().select('-password');
        res.status(200).json(users);
    }catch(error){
        console.log(error);
        res.status(500).json({error:'Hubo un error pruebe mas tarde'});
    }

};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////Get Individual//////////////////////////////////////////////////////
export const getUserById = async(req,res)=>{
    try{
        const {id}= req.params;
        if (!validateObjectId(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }


        const user = await User.findById(id).select('-password');
        if(!user) return res.status(404).json({message:'Usuario no encontrado'});

        res.status(200).json(user);

    }catch(error){
        console.log(error)
        res.status(500).json({error:'Hubo un error pruebe mas tarde'})

    }
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////updateUser///////////////////////////////////////////////////////////////////////////////
export const updateUser = async(req,res)=>{
    

    try{
        const{id} =req.params;
        if(!validateObjectId(id)){
            return res.status(400).json({message:'ID invalido'});
        }
        const{name,email,rol,password,edad} = req.body;

        const updateFields = {name,email,rol,edad};
        if(password){
            updateFields.password = await bcrypt.hash(password,10);
        }

        const updateUser = await User.findByIdAndUpdate(
            id,
            updateFields,
            
            {new: true, runValidators:true}
        ).select('-password');

        if(!updateUser){
            return res.status(404).json({message:'Usuario no encontrado'});
        }

        res.status(200).json(updateUser);

    }catch(error){
        console.log(error);
        res.status(500).json({error:'Hubo un error pruebe mas tarde.'})

    }

}
//Delete
export const deleteUser = async(req,res)=>{
    
    try{
        const {id} = req.params;
        if(!validateObjectId(id)){
            return res.status(400).json({message:'ID no es valido'})
        }
        const deletedUser = await User.findByIdAndDelete(id).select('-password');
        if(!deletedUser){
            return res.status(404).json({message:'Usuario no encontrado'});

        }
        res.status(204).send();

    }catch(error){
        console.log(error);
        res.status(500).json({error:'Hubo un  error, pruebe mas tarde'});
    }
}
    