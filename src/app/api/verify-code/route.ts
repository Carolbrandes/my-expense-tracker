import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
        }

        // Check if the user exists in the database
        let user = await prisma.user.findUnique({
            where: { email },
        });

        // If user doesn't exist, create a new user
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email, // Register the new user with the provided email
                },
            });
        }


        // Fetch the verification code from the database
        const verification = await prisma.verificationCode.findFirst({
            where: {
                userId: user.id,
                code: code,
                expired: false, // Ensure the expired field is checked correctly
                expiresAt: {
                    gte: new Date(), // Ensure the code is not expired
                },
            }
        });


        if (verification) {
            // Mark the code as used or expired
            await prisma.verificationCode.update({
                where: { id: verification.id },
                data: { expired: true },
            });

            // Generate a token
            const token = jwt.sign(
                { userId: user.id, email: user.email }, // Payload
                process.env.JWT_SECRET || "your_secret_key", // Secret key
                { expiresIn: 30 * 24 * 60 * 60 } // Expiration set to 1 month (in seconds)
            );

            return NextResponse.json({ userId: user.id, token });
        }

        return NextResponse.json({ error: "Invalid or expired code." }, { status: 401 });
    } catch (error) {
        console.error("Error in verify-code API:", error);
        return NextResponse.json({ error: "Failed to verify code." }, { status: 500 });
    }
}
