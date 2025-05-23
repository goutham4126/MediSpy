"use server";
import { checkUser } from "@/lib/auth";
import {db} from "@/lib/database"

export async function editAvailability(data) {
  const currentUser = await checkUser();

  if (!currentUser || currentUser.role !== "DOCTOR") {
    return null;
  }

  try {
    const availability = await db.user.update({
      where: { id: currentUser.id },
      data: {
        doctorAvailability: data.doctorAvailability,
      },
    });

    return availability;
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    throw error;
  }
}