"use client";

import { useTransition } from "react";
import { editAvailability } from "@/actions/editAvailability";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export function AvailabilitySelect({ initialValue }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (value) => {
    const boolValue = value === "true";

    startTransition(() => {
      editAvailability({ doctorAvailability: boolValue })
        .then(() => toast.success("Availability updated"))
        .catch(() => toast.error("Update failed"));
    });
    router.refresh();
  };

  return (
    <div className="mt-2">
      <Select
        defaultValue={String(initialValue)}
        onValueChange={handleChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select availability" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Available</SelectItem>
          <SelectItem value="false">Unavailable</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
