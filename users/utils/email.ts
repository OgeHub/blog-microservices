import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const createTransporter = async (): Promise<any> => {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  };

  const transporter = nodemailer.createTransport(config);

  return transporter;
};

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Blog",
    link: "https://mailgen.js/",
    copyright: "Copyright © 2023 Blog. All rights reserved."
  }
});

export const sendEmailVerificationLink = async (mailOptions: any) => {
  console.log(mailOptions);
  const email = {
    body: {
      greeting: `Dear ${mailOptions.username}`,
      intro: "Welcome to Blog! We're very excited to have you on board.",
      action: {
        instructions: "To get started, please click here to verify your email:",
        button: {
          color: "#48cfad",
          text: "Verify your email",
          link: `${mailOptions.link}`
        }
      },
      outro: "Looking forward to seeing your amazing post!",
      signature: "Sincerely"
    }
  };
  const emailBody = mailGenerator.generate(email);

  const message = {
    from: process.env.SENDER_EMAIL,
    to: mailOptions.email,
    subject: "Email Verification",
    html: emailBody
  };
  const emailTransporter = await createTransporter();
  emailTransporter.sendMail(message, (err: any, info: any) => {
    if (err) console.log(err.message);

    console.log(`Email sent: ${info.response}`);
  });
};

export const sendPasswordResetLink = async (mailOptions: any) => {
  const email = {
    body: {
      greeting: `Hello`,
      action: {
        instructions: "Click on the button below to reset your password:",
        button: {
          color: "#48cfad",
          text: "Reset your password",
          link: `${mailOptions.link}`
        }
      },
      signature: "Sincerely"
    }
  };
  const emailBody = mailGenerator.generate(email);

  const message = {
    from: process.env.SENDER_EMAIL,
    to: mailOptions.email,
    subject: "Password Reset Link",
    html: emailBody
  };
  const emailTransporter = await createTransporter();
  emailTransporter.sendMail(message, (err: any, info: any) => {
    if (err) console.log(err.message);

    console.log(`Email sent: ${info.response}`);
  });
};
