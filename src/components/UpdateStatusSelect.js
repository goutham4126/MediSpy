"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransition } from "react";
import { editStatus } from "@/actions/editStatus";
import { toast } from "react-hot-toast";

export function UpdateStatusSelect({
  consultationId,
  initialStatus,
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status) => {
    startTransition(async () => {
      try {
        await editStatus({
          id: consultationId,
          data: { status },
        });
        toast.success("Status updated");
      } catch (err) {
        toast.error("Failed to update status");
      }
    });
  };

  return (
    <Select onValueChange={handleStatusChange} defaultValue={initialStatus}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">PENDING</SelectItem>
        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
        <SelectItem value="COMPLETED">COMPLETED</SelectItem>
        <SelectItem value="CANCELLED">CANCELLED</SelectItem>
      </SelectContent>
    </Select>
  );
}
