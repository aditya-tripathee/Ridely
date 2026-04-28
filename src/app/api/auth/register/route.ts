import connectDB from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();
    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists!" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User regsiter successfully!", user },
      { status: 201 },
    );
  } catch (error) {
    console.log("User register error", error);
    return NextResponse.json(
      { message: "User resgiter error" },
      { status: 500 },
    );
  }
}
