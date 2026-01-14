import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "anishr6353@gmail.com",
    pass: "mxnmfmqsupedlxow",
  },
});
export default transporter;
