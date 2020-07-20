const fs = require("fs");
const Promise = require("promise");
const dotenv = require("dotenv");
const IPFS = require("ipfs");
import * as nodemailer from "nodemailer";

import * as Constants from "./constants";

dotenv.config();
const { MAIL, MAILID, MAILPASSWORD, FILESPATH } = process.env;

const fileToString = (file, inBytes = null) => {
  const stream = file.createReadStream();
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
  const node = await IPFS.create({ silent: true });
  const results = await node.add(buffer);
  let c = "";
  for await (const { cid } of results) {
    c = cid.toString();
  }
  await node.stop();
  return c;
};

const writeFile = (content, path) =>
  new Promise((resolve, reject) =>
    fs.writeFile(path, content, (err) => (err ? reject(err) : resolve()))
  );

const deleteFile = (path) =>
  new Promise((resolve, reject) =>
    fs.unlink(path, (err) => (err ? reject(err) : resolve()))
  );

const sendMailfromEnrolment = async (enrollment, password, email) => {
  const keyName = `${email}_sk`;
  const certiName = `${email}.pem`;
  await writeFile(enrollment.certificate, FILESPATH + certiName);
  await writeFile(enrollment.key, FILESPATH + keyName);
  const mail = nodemailer.createTransport({
    service: MAIL,
    auth: {
      user: MAILID,
      pass: MAILPASSWORD,
    },
  });
  const mailOptions = {
    from: Constants.MailSubject,
    to: email,
    subject: Constants.MailSubject,
    text: `Hello ${email}\n${Constants.MailMessage}\nYour password is ${password}\nPlease keep these files safe.`,
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
  await deleteFile(FILESPATH+ keyName);
};
export {
  fileToString,
  pathToString,
  writeFile,
  sendMailfromEnrolment,
  putFileOnIpFs,
};
