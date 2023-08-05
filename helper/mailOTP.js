const nodemailer = require('nodemailer')

module.exports = async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anemosenergies89@gmail.com",
      pass: "cvfifnpskvzypwbi",
    },
  });

    try {
      await transporter.sendMail({
        from: "anemosenergies89@gmail.com",
        to: email,
        subject: "OTP verification From ABC bank",
        text: "OTP: "+otp + " valid for 5 minutes", // plain text body
      html: `<p>You requested for reset password, kindly use this OTP: <b>${otp}</b> to verify</p> <p>OTP is valid for 5 minutes only</p>`, // html body
        // text: `Your OTP is ${otp}. This OTP is valid for 5 minutes.`,
      });

      console.log(`OTP sent successfully to ${email}.`);
      return "SUCCESS"
    } catch (error) {
      console.error(`Error sending OTP to ${email}: ${error}`);
      return "FAILURE"
    }
    
}