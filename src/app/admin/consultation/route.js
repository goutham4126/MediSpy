"use server";
import { db } from "@/lib/database";
import { NextResponse } from "next/server";
import { checkUser } from "@/lib/auth";

export async function POST(req) {
  const user = await checkUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const newConsultation = await db.consultation.create({
      data: {
        doctorId: body.doctorId,
        patientId: user.id,
        diagnosis: body.diagnosis,
        gender: body.gender,
        age: body.age,
        patientPhoneNo: body.patientPhoneNo,
        prescription: body.prescription || "",
        date: new Date(body.date),
        stage: body.stage,
        status: body.status,
      },
    });

    return NextResponse.json(newConsultation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Failed to create consultation" }, 
      { status: 500 }
    );
  }
}