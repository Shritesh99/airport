const fs = require("fs");
const Promise = require("promise");
const dotenv = require("dotenv");
const IPFS = require("ipfs-http-client");
import * as nodemailer from "nodemailer";

import * as Constants from "./constants";

const node = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

dotenv.config();
const { MAIL, MAILID, MAILPASSWORD, FILESPATH } = process.env;

const fileToString = (file, inBase64 = null) => {
  const stream = file.createReadStream();
  const chunks = [];
  let encoded;
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) =>
      inBase64 ? (encoded = chunk.toString("base64")) : chunks.push(chunk)
    );
    stream.on("error", reject);
    stream.on("end", () =>
      resolve(inBase64 ? encoded : Buffer.concat(chunks).toString("utf8"))
    );
  });
};
const pathToString = (file, inBytes = null) => {
  const stream = fs.createReadStream(file);
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () =>
      resolve(
        inBytes ? Buffer.concat(chunks) : Buffer.concat(chunks).toString("utf8")
      )
    );
  });
};

const putFileOnIpFs = async (file) => {
  const buffer = await fileToString(file, true);
  const results = await node.add(buffer);
  return `${Constants.IpfsUrl}${results.path}`;
};

const writeFile = (content, path) =>
  new Promise((resolve, reject) =>
    fs.writeFile(path, content, (err) => (err ? reject(err) : resolve()))
  );

const deleteFile = (path) =>
  new Promise((resolve, reject) =>
    fs.unlink(path, (err) => (err ? reject(err) : resolve()))
  );

const sendMailfromEnrolment = async (enrollment, email, password) => {
  const keyName = `${email}_sk`;
  const certiName = `${email}.pem`;
  await writeFile(enrollment.certificate, FILESPATH + certiName);
  await writeFile(enrollment.key.toBytes(), FILESPATH + keyName);
  const mail = nodemailer.createTransport({
    service: MAIL,
    auth: {
      user: MAILID,
      pass: MAILPASSWORD,
    },
  });
  const msg = `Hello ${email}\n${Constants.MailMessage}\nYour password is ${password}\nPlease keep these files safe.`;
  const mailOptions = {
    from: Constants.MailSubject,
    to: email,
    subject: Constants.MailSubject,
    text: msg,
    attachments: [
      {
        filename: keyName,
        path: FILESPATH + keyName,
      },
      {
        filename: certiName,
        path: FILESPATH + certiName,
      },
    ],
  };
  await mail.sendMail(mailOptions);
  await deleteFile(FILESPATH + certiName);
  await deleteFile(FILESPATH + keyName);
};
export {
  fileToString,
  pathToString,
  writeFile,
  sendMailfromEnrolment,
  putFileOnIpFs,
};
