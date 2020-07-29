const fs = require("fs");
const Promise = require("promise");
const dotenv = require("dotenv");
const IPFS = require("ipfs-http-client");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
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
  let encoded;
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) =>
      !inBytes ? (encoded = chunk.toString("base64")) : chunks.push(chunk)
    );
    stream.on("error", reject);
    stream.on("end", () => resolve(inBytes ? Buffer.concat(chunks) : encoded));
  });
};

const putFileOnIpFs = async (file) => {
  const buffer = await fileToString(file, true);
  const results = await node.add(buffer);
  return `${Constants.IpfsUrl}${results.path}`;
};
const putFilePathOnIpFs = async (path) => {
  const buffer = await pathToString(path);
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
  const msg = `Hello ${email}\n${Constants.Mail.MailMessage}\nYour password is ${password}\nPlease keep these files safe.`;
  const mailOptions = {
    from: MAILID,
    to: email,
    subject: Constants.Mail.MailSubject,
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
const getDate = (years = null) => {
  const date = new Date();
  if (years) {
    date.setFullYear(date.getFullYear() + years);
  }
  return parseInt(date.getTime() / 1000, 10);
};
const generatePdf = async (data) => {
  const templateHtml = fs.readFileSync(FILESPATH + "license.html", "utf8");
  const template = handlebars.compile(templateHtml);
  const html = template(data);
  const pdfPath = `${FILESPATH}Licence-${data.id}.pdf`;
  const options = {
    width: "1230px",
    headerTemplate: "<p></p>",
    footerTemplate: "<p></p>",
    displayHeaderFooter: false,
    margin: {
      top: "10px",
      bottom: "30px",
    },
    printBackground: true,
    path: pdfPath,
  };

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    waitUntil: "networkidle0",
  });

  await page.pdf(options);
  await browser.close();
  const url = await putFilePathOnIpFs(pdfPath);
  await deleteFile(pdfPath);
  return url;
};
export {
  fileToString,
  pathToString,
  writeFile,
  sendMailfromEnrolment,
  putFileOnIpFs,
  getDate,
  generatePdf,
};
