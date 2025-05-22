"use server";

import { db } from "@/lib/database";

export async function updateUserRole(userId, newRole) {
  if (!userId || !newRole) throw new Error("Missing parameters");

  try {
    await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  } catch (error) {
    console.error("Error updating role:", error);
    throw new Error("Failed to update user role");
  }
}
