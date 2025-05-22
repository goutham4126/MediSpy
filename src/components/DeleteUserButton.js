"use client";

import { useTransition } from "react";
import DeleteUser from "@/actions/deleteUser";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";


export default function DeleteUserButton({ userId }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await DeleteUser(userId);
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
