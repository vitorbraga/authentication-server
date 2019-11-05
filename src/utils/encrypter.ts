import * as crypto from 'crypto';

export const encrypt = (textToEncrypt: string): string => {
    const cipher = crypto.createCipher('aes-128-cbc', process.env.ENCRYPT_SECRET);
    let encryptedText = cipher.update(textToEncrypt, 'utf8', 'hex');
    encryptedText += cipher.final('hex');

    return encryptedText;
};

export const decrypt = (encryptedText: string): string => {
    const decipher = crypto.createDecipher('aes-128-cbc', process.env.ENCRYPT_SECRET);
    let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedText += decipher.final('utf8');

    return decryptedText;
};
