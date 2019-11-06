import { Request, Response } from 'express';
import { EmailOptions, sendEmail } from '../utils/email-sender';

class TestController {

    static sendEmail = async (req: Request, res: Response) => {
        const emailOptions: EmailOptions = {
            template: 'password-reset-success',
            destinationEmail: 'vitor.braga7@gmail.com',
            localValues: {
                name: 'Vitor',
                url: 'https://www.globo.com'
            }
        };
        res.status(200).send({ message: 'Email sent' });
        sendEmail(emailOptions);
    }
}

export default TestController;
