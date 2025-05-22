"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/actions/updateUserRole";
import { toast } from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function EditUserRoleButton({ userId, currentRole }) {
  const [role, setRole] = useState(currentRole);
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
        toast.success("Role updated successfully");
      } catch {
        toast.error("Failed to update role");
        setRole(currentRole);
      }
    });
  };

  return (
    <Select value={role} onValueChange={handleRoleChange} disabled={isPending}>
      <SelectTrigger className="w-[120px] h-8 text-sm">
        <SelectValue placeholder="Select Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PATIENT">Patient</SelectItem>
        <SelectItem value="DOCTOR">Doctor</SelectItem>
      </SelectContent>
    </Select>
  );
}
