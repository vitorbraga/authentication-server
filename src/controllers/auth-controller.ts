import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import * as uuidv4 from 'uuid/v4';
import { User } from '../entity/User';
import config from '../config/config';
import { PasswordReset } from '../entity/PasswordReset';
import { sendEmail, EmailOptions } from '../utils/email-sender';
import { subjectTemplates, bodyTemplates } from '../utils/email-templates';

const PASSWORD_RESET_TOKEN_EXPIRATION_MS = 18000000; // 5 hours

const createPasswordResetUrl = (token: string): string => {
    return `${process.env.SERVER_URL}/change-password?token=${token}`;
}

class AuthController {
    static login = async (req: Request, res: Response) => {
        //Check if username and password are set
        let { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send({ success: false, error: 'LOGIN_MISSING_CREDENTIALS' });
            return;
        }

        //Get user from database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { email: username } });
        } catch (error) {
            res.status(401).send({ success: false, error: 'LOGIN_USER_NOT_FOUND' });
            return;
        }

        //Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send({ success: false, error: 'LOGIN_UNMATCHED_EMAIL_PWD' });
            return;
        }

        //Sing JWT, valid for 2 hours
        const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: '2h' });

        //Send the jwt in the response
        res.send({ success: true, jwt: token });
    };

    static passwordReset = async (req: Request, res: Response) => {
        let { email } = req.body;
        if (!email) {
            res.status(400).send({ success: false, error: 'PASSWORD_RESET_MISSING_EMAIL' });
            return;
        }

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { email } });
        } catch (error) {
            res.status(401).send({ success: false, error: 'PASSWORD_RESET_USER_NOT_FOUND' });
            return;
        }

        const token = uuidv4();

        const passwordReset = new PasswordReset();
        passwordReset.token = token;
        passwordReset.user = user;

        console.log('user.passwordResets', user.passwordResets);
        user.passwordResets = user.passwordResets ? [...user.passwordResets, passwordReset] : [passwordReset];
        const resultUser = await userRepository.save(user);
        console.log('resultUser', resultUser);
        
        // send email
        const emailOptions: EmailOptions = {
            destinationEmail: user.email,
            subject: subjectTemplates.PASSWORD_RESET,
            body: bodyTemplates.PASSWORD_RESET.replace('{name}', user.firstName).replace('{url}', createPasswordResetUrl(token))
        };

        res.status(200).send({ success: true });
        // TODO see to create thread or something
        sendEmail(emailOptions);
    }

    static checkPasswordToken = async (req: Request, res: Response) => {
        let { token } = req.params;
        if (!token) {
            res.status(400).send({ success: false, error: 'PASSWORD_TOKEN_REQUIRED' });
            return;
        }

        const passwordResetRepository = getRepository(PasswordReset);
        let passwordReset: PasswordReset;
        try {
            passwordReset = await passwordResetRepository.findOneOrFail({ where: { token } });
        } catch (error) {
            res.status(401).send({ success: false, error: 'PASSWORD_RESET_USER_NOT_FOUND' });
            return;
        }

        if (passwordReset.createdAt.getTime() + PASSWORD_RESET_TOKEN_EXPIRATION_MS < Date.now()) {
            res.status(401).send({ success: false, error: 'PASSWORD_TOKEN_EXPIRED' });
            return;
        }

        res.status(200).send({ success: true });
    }


    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        //Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
        }

        //Get user from the database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            res.status(401).send();
        }

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send();
            return;
        }

        //Validate de model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        //Hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        res.status(204).send();
    };
}

export default AuthController;