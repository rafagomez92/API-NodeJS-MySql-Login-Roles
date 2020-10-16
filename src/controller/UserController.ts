import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import { validate } from 'class-validator';

export class UserController {
    static getAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        try {
            const users = await userRepository.find();
            res.send(users)
        } catch (error) {
            res.status(404).json({ message: 'Not result'});
        }        
    }

    static getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);        
        try{
            const user = await userRepository.findOneOrFail(id);
            res.send(user);
        } catch(error) {
            res.status(400).json({ message: 'Not result'})
        }
    }

    static newUser = async(req: Request, res: Response) => {
        const { username, password, role } = req.body;
        let user = new User();

        user.username = username;
        user.password = password;
        user.role = role;

        const validationOpt = { validationError: { target: false, value: false }};
        const errors = await validate(user, validationOpt);
        if(errors.length > 0) {
            res.status(400).json(errors);
        }

        const userRepository = getRepository(User);

        try {
            user.hashPassword();
            await userRepository.save(user);
        } catch(error) {
            res.status(400).json({ message: 'username already exist'})
        }

        //Pos solo se muestra el mensaje de lo que se hizo
        res.send('User created');  
    }
    
    static editUser = async (req: Request, res: Response) => {
        let user;
        // Obtener el id para luego utilizarlo en el userRepository.findd
        const { id } = req.params;
        // Password no puede ser modificada desde este método
        const { username, role } = req.body;
        const userRepository = getRepository(User);

        try {
            user = await userRepository.findOneOrFail(id);
            user.username = username;
            user.role = role;
        } catch(error) {
            res.status(400).json({ message: 'User not found'});        
        }
        
        const validationOpt = { validationError: { target: false, value: false }};
        const errors = await validate(user, validationOpt);
        if(errors.length > 0) {
            res.status(400).json(errors);
        }

        try {
            await userRepository.save(user);
        } catch(error) {
            return res.status(409).json({ message: 'Username already in use'});
        }

        res.status(201).json({ message: 'User updated'});        
    }

    static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);
        // instancia de User, variable user sera de tipo User
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            return res.status(404).json({ message: 'User not found'})
        }

        // Eliminar de la base de datos 
        userRepository.delete(id);
        res.status(201).json({ message: 'User deleted' });
        
    }
    
}

export default UserController;


































// static getAll = async (req: Request, res: Response) => {
//     const userRepository = getRepository(User);
//     const users = await userRepository.find();
//     if(users.length > 0) {
//         res.send(users);
//     } else {
//         res.status(404).json({ message: 'Not result'});
//     }
    
// }

// static getById = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const userRepository = getRepository(User);
//     try {
//         const user = await userRepository.findOneOrFail(id);
//         res.send(user);
//     } catch(error) {
//         res.status(404).json({ message: 'No result'})
//     }
// }

// static newUser = async (req: Request, res: Response) => {
//     const { username, password, role } = req.params;
//     const user = new User();

//     user.username = username;
//     user.password = password;
//     user.role = role;

//     // Validate
//     const errors = await validate(user);
//     if(errors.length > 0) {
//         return res.status(400).json(errors);
//     }

//     // tdo: HASH PASSWORD
//     const userRepository = getRepository(User);
//     try {
//         await userRepository.save(user);
//     } catch(error) {
//         return res.status(409).json({ message: 'Username already exist '});
//     }
    
//     res.send('User created');
// }