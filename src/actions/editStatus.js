"use server";
import { checkUser } from "@/lib/auth";
import {db} from "@/lib/database"

export async function editStatus({id,data}) {
  const currentUser = await checkUser();

  if (!currentUser || currentUser.role !== "DOCTOR") {
    return null;
  }

  try {
    const status = await db.consultation.update({
      where: { id: id },
      data: {
        status: data.status,
      },
    });

    return status;
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    throw error;
  }
}