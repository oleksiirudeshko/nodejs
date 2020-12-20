const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "toma-f@i.ua",
  from: "toma-f@i.ua",
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};
async function main() {
  try {
    const [response] = await sgMail.send(msg);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
main();
