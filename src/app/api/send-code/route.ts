import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Find the user or create a new one if it doesn't exist
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({ data: { email } });
    }

    console.log("🚀 ~ POST ~ user:", user)


    // Store the verification code in the database
    const responseverificationCodeCreate = await prisma.verificationCode.create({
        data: {
            code,
            user: { connect: { id: user.id } },
        },
    });
    console.log("🚀 ~ POST ~ responseverificationCodeCreate:", responseverificationCodeCreate)

    console.log(`Code sent to ${email}: ${code}`);

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Explicitly specify Gmail's SMTP server
        port: 465, // Use port 465 for secure connections
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        // Send the email with the verification code
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Verification Code",
            text: `Your verification code is ${code}`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }
}
