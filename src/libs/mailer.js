// const dateFormat = require('date-format');
const mailClient = require("./mailClient");

const generateTemplate = (htmlExtension) => {
  return `<!DOCTYPE html> <html lang=\"en\"> <head><meta charset=\"UTF-8\" /> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /> <title> Woozee Email Notification </title><style type=\"text/css\">@import url(\"https://fonts.googleapis.com/css2?family=Open+Sans&display=swap\");: root {color-scheme: light dark;supported-color-schemes: light dark;}*{margin: 0;padding: 0;border: 0;}@font-face {font-family: \"Product Sans Regular\";font-style: normal;font-weight: normal;src:local(\"Product Sans Regular\"),url(https: //woozeee-socials-artifacts.s3.eu-central-1.amazonaws.com/fonts/ProductSans-Regular.woff)format(\"woff\");}body {/* font-family: 'Open Sans', sans-serif; */font-family: \"Product Sans Regular\";font-size: 14 px;max-width: 800 px;margin: 0 auto;padding: 2% ;background-color: #ffffff;color: #151027;}#wrapper {background-color: white;}.header {background-color: rgba(4, 62, 124, 0.1);height: 100px;padding: 1%;}.header-links {display: flex;justify-content: center;align-items: center;}.header-links a {font-size: 10 px;margin-right: 1 % ;padding-right: 1 % ;text-decoration: none;color: #043f7c;}.header-links a:not(:last-child) {border-right: 0.5px solid # ff5757;}.logo {margin: 0 auto;max-width: 210px;margin-bottom: 1%;}.download{background: #000000;color: white;border-radius: 5px;height: 38px;width: 112px;padding: 1%;margin-right: 2%;display: flex;justify-content: space-around;align-items: center;}.one-col {padding: 8%;}.footer {padding: 2%;}.footer-subs {display: flex;justify-content: center;}.footer-subs p {margin-right: 1%;padding-right: 1%;color: rgba(0, 0, 0, 0.5);}.footer-subs p:not(:last-child) {border-right: 0.5px solid rgba(0, 0, 0, 0.5);}@media (prefers-color-scheme: dark) {body {background-color: #ffffff;color: #151027;}.wrapper {background-color: #ffffff;}.header {background-color: rgba(4, 62, 124, 0.1);}}[data-ogsc] body {background-color: #ffffff;color: #151027;[data-ogsc] .wrapper {background-color: # ffffff;}[data-ogsc].header,[data-ogsc] {background-color: rgba(4, 62, 124, 0.1);}</style><body><div id=\"wrapper\"> <header class=\"header\"> <div class=\"logo\"> <img src=\"https://woozeee-socials-artifacts.s3.eu-central-1.amazonaws.com/email-assets/woozeee-logo.png\" alt=\"Woozee Logo\" /></div> <div class=\"header-links\"> <a href=\"#\">Have Fun</a> <a href=\"#\">Make Money</a> <a href=\"#\">Give Back</a> </div> </header><div class=\"one-col\" style=\"margin-bottom: 1%\"> ${htmlExtension}<div class=\"one-col\" style=\"background-color: #043f7c; color: white; text-align: center\" ><h2 style=\"font-weight: bold; font-size: 20px; line-height: 30px\">Download the Mobile App for iOS and Android. </h2><p style=\"font-style: italic; font-weight: normal; font-size: 12px; line-heighpx; margin-bottom: 2%;\">Social, Marketplace, and Charity All-In-One App </p> <img style=\"margin-bottom: 2%\"src=\"https://woozeee-socials-artifacts.s3.eu-central-1.amazonaws.com/email-assets/woozeee-logo.png\" alt=\"Woozee app\" /><div style=\"display: flex; justify-content: center\"> <div class=\"download\"> <img src=\"https://woozeee-socials-artifacts.s3.eu-central-1.amazonaws.com/email-assets/apple.svg\"alt=\"apple logo\" /><div ><span style=\"font-size: 8px\">Available on the</span> <p style=\"font-weight: bold\">App Store</p> </div> </div><div class=\"download\"> <img src=\"https://woozeee-socials-artifacts.s3.eu-central-1.amazonaws.com/email-assets/android.svg\" alt=\"android logo\" /><div ><span style=\"font-size: 8px\">GET IT ON</span> <p style=\"font-weight: bold\">Google Play</p> </div> </div> </div> </div><div class=\"footer\"> <p style=\"text-align: center; margin-bottom: 1%\">If you no longer wish to receive emails from woozeee, you can unsubscribe <a style=\"text-decoration: underline; color: #043f7c\">here</a> <p> <div class=\"footer-subs\"> <p> ©woozeee.com </p> <p> Terms & Conditions </p> <p> Privacy Policy </p> </div> </div> </div> </body> </html>`;
};

function userRegistered(user) {
  const { email, fName, emailToken } = user;
  const subject = "Welcome to woozeee";
  // const confirmLink = `apis.woozeee.com/api/v1/user/confirm?token=${emailToken}&email=${email}`;
  const textContent = `Hi ${fName},,\r\n Your registration on Woozeee was successful. Use ${emailToken} to verify your account.\r\nCongratulations!!!\"`;
  const body = `
  <h3 style=\"margin-bottom: 2%; font-weight: 1000; color: #000000cc\">Hi ${fName}, </h3><div style=\"color: rgba(0, 0, 0, 0.6); font-size: 10px\"> <p style=\"line-height: 20px\">Your registration on woozeee was successful. Use the code below to verify your account. </p> <p style="text-align:center; padding: 1rem; font-weight: bold; background: #fefefe; color: #000000cc">${emailToken}</p> <br / ><br/><p style="line-height: 20px">Congratulations!!!</p> </div> </div>`;

  const template = generateTemplate(body);

  return mailClient.sendEMail(email, subject, textContent, template);
}

function userResendConfirmation(user) {
  const { email, fName, emailToken } = user;
  const subject = "Confirm your woozeee Account";
  // const confirmLink = `apis.woozeee.com/api/v1/user/confirm?token=${emailToken}&email=${email}`;
  const textContent = `Hi ${fName},,\r\n Use ${emailToken} to verify your account.\r\nCongratulations!!!\"`;
  const body = `
  <h3 style=\"margin-bottom: 2%; font-weight: 1000; color: #000000cc\">Hi ${fName}, </h3><div style=\"color: rgba(0, 0, 0, 0.6); font-size: 10px\"> <p style=\"line-height: 20px\">Use the code below to verify your account. </p> <p style="text-align:center; padding: 1rem; font-weight: bold; background: #fefefe; color: #000000cc">${emailToken}</p> <br / ><br/><p style="line-height: 20px">Congratulations!!!</p> </div> </div>`;

  const template = generateTemplate(body);

  return mailClient.sendEMail(email, subject, textContent, template);
}

function sendPasswordReset(user) {
  const { email, fName, passwordResetToken } = user;
  const subject = "Password Reset - woozeee";
  // const confirmLink = `apis.woozeee.com/api/v1/user/confirm?token=${passwordResetToken}&email=${email}`;
  const textContent = `Hi ${fName},,\r\n You or someone else has requested to change your passowrd. Use ${passwordResetToken} to verify your account.\r\nIgnore if this request is not from you.\"`;
  const body = `
  <h3 style=\"margin-bottom: 2%; font-weight: 1000; color: #000000cc\">Hi ${fName}, </h3><div style=\"color: rgba(0, 0, 0, 0.6); font-size: 10px\"> <p style=\"line-height: 20px\">You or someone else has requested to change your password. </p><p>Use the code below to verify your account. </p> <p style="text-align:center; padding: 1rem; font-weight: bold; background: #fefefe; color: #000000cc">${passwordResetToken}</p> <br / ><br/><p style="line-height: 20px">Ignore if this request is not from you</p> </div> </div>`;

  const template = generateTemplate(body);

  return mailClient.sendEMail(email, subject, textContent, template);
}

function sendPasswordUpdate(user) {
  const { email, fName } = user;
  const subject = "Password Updated - woozeee";
  // const confirmLink = `apis.woozeee.com/api/v1/user/confirm?token=${passwordResetToken}&email=${email}`;
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
