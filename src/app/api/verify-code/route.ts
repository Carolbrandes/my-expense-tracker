import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    const { email, code } = await req.json();

    if (!email || !code) {
        return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
    }

    // Get the user from the database by email
    const user = await prisma.user.findUnique({
        where: { email },
    });
    console.log("🚀 ~ POST ~ verify-code ~ user:", user)

    if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Fetch the verification code from the database
    const verification = await prisma.verificationCode.findFirst({
        where: {
            userId: user.id,
            code: code,
            expired: false, // Ensure the expired field is checked correctly
        },
    });

    console.log("🚀 ~ POST ~ verify-code ~ verification:", verification)

    if (verification) {
        // Mark the code as used or expired
        const responseVerificationCodeUpdate = await prisma.verificationCode.update({
            where: { id: verification.id },
            data: { expired: true },
        });
        console.log("🚀 ~ POST ~ verify-code ~ responseVerificationCodeUpdate:", responseVerificationCodeUpdate)

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid code." }, { status: 401 });
}
