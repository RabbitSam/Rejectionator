import { NextResponse, NextRequest } from 'next/server';
import path from "path";
import { cwd } from 'process';
import { promises as fs } from 'fs';
const nodemailer = require("nodemailer");
 

export async function POST(request : NextRequest) {
    const {name, replyEmail, emailAddresses, tone} = await request.json();

    // Error checking
    if (!name.length) {
        return NextResponse.json({success: false, message: "Name should not be empty."}, {status: 400});
    }

    if (!emailAddresses.length) {
        return NextResponse.json({success: false, message: "Email addresses should not be empty."}, {status: 400});
        
    }

    // Get contents
    const jsonDirectory = path.join(cwd(), "/src/app");
    const fileContents = await fs.readFile(`${jsonDirectory}/content.json`, "utf-8");

    // Create Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: "Rejectionator Bot (DO NOT REPLY) <rejectionatorbot@gmail.com>",
        replyTo: replyEmail.length ? replyEmail : "",
        subject: `Your application to ${name}`,
        html: JSON.parse(fileContents)[tone],
        bcc: emailAddresses
    };

    
    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({success: true}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: error}, { status: 500 });
    }
}