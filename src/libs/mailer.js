// const dateFormat = require('date-format');
const mailClient = require("./mailClient");
const config = require("config");

const generateTemplate = (htmlExtension) => {
  return `<!DOCTYPE html> <html lang=\"en\"> <head><meta charset=\"UTF-8\" /> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /> <title>  Email Template </title><style type=\"text/css\">@import url(\"https://fonts.googleapis.com/css2?family=Open+Sans&display=swap\");</style><body>${htmlExtension}</body> </html>`;
};

function userRegistered(user) {
  const { email, fName, emailToken } = user;
  const subject = `Welcome to ${config.get("appName")}`;
  const textContent = `Hi ${fName},,\r\n Your registration on ${config.get(
    "appName"
  )} was successful. Use ${emailToken} to verify your account.\r\nCongratulations!!!\"`;
  const body = `
  <h3 style=\"margin-bottom: 2%; font-weight: 1000; color: #000000cc\">Hi ${fName}, </h3><div style=\"color: rgba(0, 0, 0, 0.6); font-size: 10px\"> <p style=\"line-height: 20px\">Your registration on ${config.get(
    "appName"
  )} was successful. Use the code below to verify your account. </p> <p style="text-align:center; padding: 1rem; font-weight: bold; background: #fefefe; color: #000000cc">${emailToken}</p> <br / ><br/><p style="line-height: 20px">Congratulations!!!</p> </div> </div>`;

  const template = generateTemplate(body);

  return mailClient.sendEMail(email, subject, textContent, template);
}

function userResendConfirmation(user) {
  const { email, fName, emailToken } = user;
  const subject = `Confirm your ${config.get("appName")} Account`;
  const textContent = `Hi ${fName},,\r\n Use ${emailToken} to verify your account.\r\nCongratulations!!!\"`;
  const body = `
  <h3 style=\"margin-bottom: 2%; font-weight: 1000; color: #000000cc\">Hi ${fName}, </h3><div style=\"color: rgba(0, 0, 0, 0.6); font-size: 10px\"> <p style=\"line-height: 20px\">Use the code below to verify your account. </p> <p style="text-align:center; padding: 1rem; font-weight: bold; background: #fefefe; color: #000000cc">${emailToken}</p> <br / ><br/><p style="line-height: 20px">Congratulations!!!</p> </div> </div>`;

  const template = generateTemplate(body);

  return mailClient.sendEMail(email, subject, textContent, template);
}

function sendPasswordReset(user) {
  const { email, fName, passwordResetToken } = user;
  const subject = `Password Reset - ${config.get("appName")}`;
  const textContent = `Hi ${fName},,\r\n You or someone else has requested to change your passowrd. Use ${passwordResetToken} to verify your account.\r\nIgnore if this request is not from you.\"`;
  const body = `
  <h3 style=\"margin-bottom: 2%; font-weight: 1000; color: #000000cc\">Hi ${fName}, </h3><div style=\"color: rgba(0, 0, 0, 0.6); font-size: 10px\"> <p style=\"line-height: 20px\">You or someone else has requested to change your password. </p><p>Use the code below to verify your account. </p> <p style="text-align:center; padding: 1rem; font-weight: bold; background: #fefefe; color: #000000cc">${passwordResetToken}</p> <br / ><br/><p style="line-height: 20px">Ignore if this request is not from you</p> </div> </div>`;

  const template = generateTemplate(body);

  return mailClient.sendEMail(email, subject, textContent, template);
}

function sendPasswordUpdate(user) {
  const { email, fName } = user;
  const subject = `Password Updated - ${config.get("appName")}`;
  const textContent = `Hi ${fName},,\r\n Your password has been successfully update. \r\n.\"If this request was not from you, contact our support`;
  const body = `
  <h3 style=\"margin-bottom: 2%; font-weight: 1000; color: #000000cc\">Hi ${fName}, </h3><div style=\"color: rgba(0, 0, 0, 0.6); font-size: 10px\"> <p style=\"line-height: 20px\">Your password update was successful.</p><br / ><br/><p style="line-height: 20px">If this request was not from you, contact our support</p> </div> </div>`;

  const template = generateTemplate(body);

  return mailClient.sendEMail(email, subject, textContent, template);
}

module.exports = {
  userRegistered,
  userResendConfirmation,
  sendPasswordReset,
  sendPasswordUpdate
};
