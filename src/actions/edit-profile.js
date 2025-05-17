"use server";
import { checkUser } from "@/lib/auth";
import {db} from "@/lib/database"

export async function updateDoctorProfile(data) {
  const currentUser = await checkUser();

  if (!currentUser || currentUser.role !== "DOCTOR") {
    return null;
  }

  try {
    const updatedDoctor = await db.user.update({
      where: { id: currentUser.id },
      data: {
        name: data.name,
        email: data.email,
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

    return updatedDoctor;
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    throw error;
  }
}