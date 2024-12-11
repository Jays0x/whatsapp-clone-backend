import User from "@/model/User";
import { connectDB } from "@/util/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const verificationCode = Number(body.verificationCode); 
        const today = new Date();


        const getVerification = await User.findOne({ verificationCode });

        if (!getVerification) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
        }

        const isExpired = getVerification.verificationExpiryDate < today;

        if (isExpired) {
            return NextResponse.json({ error: "Verification code has expired" }, { status: 400 });
        }

        if (verificationCode === getVerification.verificationCode) {
            const user = await User.findByIdAndUpdate(
                getVerification._id,
                {
                    $set: { isActive: true },
                    $unset: { verificationCode: "", verificationExpiryDate: "" }
                },
                { new: true }
            );
            return NextResponse.json({ message: "Account verified successfully", user });
        }

        return NextResponse.json({ error: "Verification code does not match" }, { status: 400 });
    } catch (error) {
        console.error("Internal server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
