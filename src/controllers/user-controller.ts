import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';

import { User } from '../entity/User';

class UserController{

    static listAll = async (req: Request, res: Response) => {
        //Get users from database
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ['id', 'email', 'role'] //We dont want to send the passwords on response
        });

        //Send the users object
        res.send(users);
    };

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: number = parseInt(req.params.id, 10);

        //Get the user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ['id', 'email', 'role'] //We dont want to send the password on response
            });
            res.json(user);
        } catch (error) {
            res.status(404).send('User not found');
        }
    };

    static newUser = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { email, password, firstName, lastName } = req.body;
        let user = new User();
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = password;
        user.role = 'USER';

        //Validade if the parameters are ok
        const errors: ValidationError[] = await validate(user);
        if (errors.length > 0) {
            const fields = errors.map((item) => ({ field: item.property, constraints: item.constraints }));
            res.status(400).send({ success: false, fields });
            return;
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        //Try to save. If fails, the username is already in use
        const userRepository = getRepository(User);
        let newUser;
        try {
            newUser = await userRepository.save(user);
        } catch (e) {
            res.status(409).send({ success: false, error: 'Email already in use' });
            return;
        }

        //If all ok, send 201 response
        delete newUser.password;
        res.status(201).send({ success: true, user: newUser });
    };

    static editUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        const { email, role } = req.body;

        //Try to find user on database
        const userRepository = getRepository(User);
        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send('User not found');
            return;
        }

    //Validate the new values on model
        user.email = email;
        user.role = role;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to safe, if fails, that means username already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send('email already in use');
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };

    static deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send('User not found');
            return;
        }
        userRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
};

export default UserController;