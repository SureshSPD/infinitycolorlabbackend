const OTP = require('../models/otp');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../Utility/emailService'); 

// services/otpService.js

const nodemailer = require('nodemailer');

// function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
// }

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Convert OTP to string
    return otp;
}


const otpStore = {}; // A temporary store to map email with generated OTP

function storeOTP(email, otp) {
    otpStore[email] = otp; // Store OTP for a specific email
}

function retrieveOTP(email) {
    return otpStore[email]; // Retrieve OTP for a specific email
}

async function verifyOTP(email, userOTP) {
    try {
        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            throw new Error('No OTP found for the email!');
        }

        const storedOTP = otpRecord.otp;
        const isOTPMatched = await bcrypt.compare(userOTP.toString(), storedOTP);

        if (isOTPMatched) {
            await OTP.deleteOne({ email });
            return true;
        } else {
            throw new Error('Invalid OTP');
        }
    } catch (error) {
        throw new Error('Error verifying OTP: ' + error.message);
    }
}



const sendOTP = async (email) => {
    try {
        const generatedOTP = generateOTP();
        const hashedOTP = await bcrypt.hash(generatedOTP, 10);
        const duration = 5;
        const currentTime = new Date();
        const expiresAt = new Date(currentTime.getTime() + duration * 60000);

        let otpRecord = await OTP.findOne({ email });

        if (otpRecord) {
            // Update existing OTP record
            otpRecord.otp = hashedOTP;
            otpRecord.createdAt = currentTime;
            otpRecord.expiresAt = expiresAt;

            await otpRecord.save(); // Save the updated OTP record
        } else {
            // Create a new OTP record
            otpRecord = new OTP({
                email,
                otp: hashedOTP,
                createdAt: currentTime,
                expiresAt,
            });

            await otpRecord.save(); // Save the new OTP record
        }

        let transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secureConnection: false,
            secure: false,
            requireTLS: true,
        
            auth: {
              user: "insights@mavenberg.com",
              pass: "T3sser@kt@123$",
            },
          });

        const mailOptions = {
            from: 'insights@mavenberg.com',
            to: email,
            subject: 'Your One-Time Password (OTP)',
            text: `Your OTP is: ${generatedOTP}`,
            html:`
            <head>
        <title>OTP Verification Email</title>
      </head>
      <body style="background-color: #f7f7f7; font-family: Arial, sans-serif; font-size: 16px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center;">
            <img src='https://www.mavenberg.com/wp-content/uploads/2021/03/Mavenberg_logo_text_TRANSPARENT.png' alt='MAvenberg' style="width:150px; "/></div>
          <h1 style="color: #333; font-size: 24px; text-align: center;">User Verification Email</h1>
          <hr style="border: none; border-bottom: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; margin-bottom: 20px;">Dear User,</p>
          <p style="color: #666; margin-bottom: 20px;"> To complete your Sign In and verify your email address, please use the following One-Time Password (OTP):</p>
          <h1 style="color:red; font-size: 24px; text-align: center;">${generatedOTP}</h1>
        <p style="color: #666; margin-bottom: 20px;">Please enter this OTP code on the verification page to confirm your email address and complete the registration process.</p>
          <p style="color: #666; margin-bottom: 20px;">If you did not request this OTP, please ignore this message and your account will not be verified.</p>
          <p style="color: #666; margin-bottom: 20px;">If you have any questions or concerns, please do not hesitate to contact our support team at <a href="mailto:info@mavenberg.com" style="color: blue; text-decoration: underline;">info@mavenberg.com</a> . We're always here to help.</p>
          <p style="color: #666;">Best regards,<br>Mavenberg Innovations India Private Limited</p>
        <hr style="border: none; border-bottom: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; margin-bottom: 20px; font-size:12px; text-align: center;">Address: 7th Floor, Ncc Urban - Windsor, No: 17/1, Bellary Rd, Yashoda Nagar, Yelahanka,<br> Bengaluru, Karnataka 560064</p>
        </div>
      </body>`,
        };

        // const createdOTPRecord = await newOTP.save();
        // Now, send the OTP via email
        await transporter.sendMail(mailOptions);
        // return otp;

        // return createdOTPRecord; // Return the saved OTP record (optional)
    } catch (error) {
        throw new Error('Error sending OTP or storing in DB: ' + error.message);
    }
}

module.exports = { sendOTP, verifyOTP };
