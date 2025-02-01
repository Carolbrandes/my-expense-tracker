import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";


export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }

        // Generate a 6-digit verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Find the user or create a new one if it doesn't exist
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: { email },
        });


        const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        const data: Prisma.VerificationCodeCreateInput = {
            code,
            expiresAt: expirationTime,
            user: { connect: { id: user.id } },
        };

        await prisma.verificationCode.create({ data });


        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Gmail SMTP server
            port: 465, // Secure connection port
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send the email with the verification code
        await transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Verification Code",
            text: `Your verification code is ${code}. It will expire in 10 minutes.`,
        });

        return NextResponse.json({ success: true, message: "Verification code sent." });
    } catch (error) {
        console.error("Error in send-code API:", error);

        // Check if the error is a Prisma error and if it contains the 'code' property
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json(
                    { error: "Verification code generation failed due to a database conflict." },
                    { status: 500 }
                );
            }
        }

        // Handle other errors
        return NextResponse.json({ error: "Failed to send verification code." }, { status: 500 });
    }
}
