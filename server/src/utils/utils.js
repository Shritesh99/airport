const fs = require('fs');
const Promise = require('promise');
const dotenv = require('dotenv');
const IPFS = require('ipfs');
import * as nodemailer from 'nodemailer';

import * as Constants from './constants';

dotenv.config();
const {
    MAIL,
    MAILID,
    MAILPASSWORD
} = process.env;

const fileToString = (file, inBytes = null) => {
    const stream = file.createReadStream();
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve((inBytes) ? { buffer: chunks, path: file.filename } : Buffer.concat(chunks).toString('utf8')));
    });
};
const writeFile = (content, path) => {
    const stream = fs.createWriteStream(path);
    stream.write(content);
    return new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', () => {
            stream.end();
            return resolve();
        });
    });
};

const putFileOnIpFs = async (file) => {
    const buffer = await fileToString(file, true);
    const node = await IPFS.create({silent: true});
    const results = await node.add({path: buffer.path, content: buffer.buffer});
    for await (const { cid } of results) {
        return cid.toString();
    }
};

const sendMailfromEnrolment =  async (enrollment, email) => {
    const keyName = `${email}_sk`;
    const certiName = `${email}.pem`;
    await writeFile(enrollment.certificate, `../files/${certiName}`);
    await writeFile(enrollment.key, `../files/${keyName}`);
    const mail = nodemailer.createTransport({
        service: MAIL,
        auth: {
            user: MAILID,
            pass: MAILPASSWORD
        }
    });
    const mailOptions = {
        from: Constants.MailSubject,
        to: email,
        subject: Constants.MailSubject,
        html: `Hello ${email},` + Constants.MailMessage,
        attachments: [
            {
                filename: keyName,
                path: `../files/${keyName}`
            },
            {
                filename: certiName,
                path: `../files/${certiName}`
            },
        ]
    };
    return new Promise((resolve, reject) => {
        mail.sendMail(mailOptions, (err, info) => {
            if(err)reject(err);
            else resolve(info);
        });
    });
};
export { 
    fileToString,
    writeFile,
    sendMailfromEnrolment,
    putFileOnIpFs
};