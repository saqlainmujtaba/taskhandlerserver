config();
import { config } from "dotenv";
import nodemailer from "nodemailer";

export const sendMail = async (email, subject, text) => {
  const host = process.env.SMPT_HOST;
  const port = process.env.SMPT_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  console.log(`host ${host}  port ${port} user ${user} pass ${pass} `);

  var transport = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: user,
      pass: pass,
    },
  });
  await transport.sendMail({
    from: user,
    to: email,
    subject,
    text,
  });
};
