const sgMail = require("@sendgrid/mail");
const Mailgen = require("mailgen");
const dotenv = require("dotenv");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;

  createTemplate(verifyToken, name) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: "default",
      product: {
        name: "System Contacts",
        link: "http://localhost:3000/",
      },
    });
    const template = {
      body: {
        name,
        intro:
          "Welcome to System Contacts! We're very excited to have you on board.",
        action: {
          instructions:
            "To get started with System Contacts, please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `http://localhost:3000/auth/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    const emailBody = mailGenerator.generate(template);
    return emailBody;
  }

  async sendEmail(verifyToken, email, name) {
    const emailBody = this.createTemplate(verifyToken, name);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: "toma-f@i.ua",
      subject: "Sending with SendGrid for hiomework-06",
      html: emailBody,
    };

    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
