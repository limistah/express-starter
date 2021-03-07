const config = require("config");
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");

let siteURL = config.get("siteURL");
let port = config.get("port");
// Append port if I the app is running on localhost
if (siteURL.includes("localhost")) {
  siteURL = `${siteURL}:${port}`;
}

/**
 * Extract this into an email service in FUTURE.
 */

const sesOptions = {
  // eslint-disable-line
  apiVersion: config.get("awsSESVersion"),
  accessKeyId: config.get("awsAccessKeyId"),
  secretAccessKey: config.get("awsSecretAccessKey"),
  region: config.get("awsSESRegion")
};

// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
  SES: new aws.SES(sesOptions)
});

/**
 * Delivers email for the programmed user. FOr now, only .violetfiber.com accounts are allowed.
 * @param {string} receiver Emil address of the receiver
 * @param {string} subject Email subject
 * @param {string} message The message to be delivered
 * @param {string} html Optional html doc. Use this if message is encoded as html.
 */
const DEFAULT_SUBJECT = `Message from ${config.get("appName")}`;
const sendEMail = async (receiver, subject = DEFAULT_SUBJECT, message, html) => {
  try {
    if (!receiver || !message || !html) {
      throw Error("I can't send out an incomplete message");
    }
    // verify connection configuration
    await transporter.verify();
    const mailResponse = await transporter.sendMail({
      from: `${config.get("appName")} ${config.get("fromEmail")}`,
      to: receiver,
      subject,
      text: message,
      html,
      replyTo: `${config.get("appName")} ${config.get("fromEmail")}`
    });
    console.info(`Message sent ${mailResponse.messageId}`);
    return { status: "Success" };
  } catch (error) {
    console.log(error);
    console.error(`Error sending Email: ${error}`);
    return { status: "error" };
  }
};

module.exports = { sendEMail };
