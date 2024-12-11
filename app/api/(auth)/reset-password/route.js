import { connectDB } from "@/util/db";
import { NextResponse } from "next/server";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export async function PATCH(req,res){

    try{

        await connectDB();

        const { newPassword, confirmPassword, email } = await req.json();   

        if(newPassword!==confirmPassword){
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
        }

        const findUser = await User.findOne({ email });

        if(!findUser){
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate( findUser, { password: hashedPassword }, { new: true });

        if(!user){
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Password reset successfully', password: user.password }, { status: 200});
    }
    catch(error){
        return NextResponse.json({ error: 'Server error' + error }, { status: 500 });
    }
}