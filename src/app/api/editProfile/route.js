import { NextResponse } from "next/server";
import { checkUser } from "@/lib/auth";
import db from "@/lib/database";

export async function POST(req) {
  const user = await checkUser();

  if (!user || user.role !== "DOCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    const updatedDoctor = await db.user.update({
      where: { id: user.id },
      data: {
        doctorAge: data.doctorAge,
        doctorPhone: data.doctorPhone,
        doctorGender: data.doctorGender,
        doctorAddress: data.doctorAddress,
        doctorEducation: data.doctorEducation,
        doctorSpecialization: data.doctorSpecialization,
        doctorExperience: data.doctorExperience,
        doctorHospital: data.doctorHospital,
        doctorLicenseNo: data.doctorLicenseNo,
      },
    });

    return NextResponse.json(updatedDoctor);
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
