"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import EditConsultation from "@/actions/addPrescription";
import {
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation";

export function EditPrescription({initialValue,consultationId,role}) {
  const router = useRouter();
  function handleSubmit(formData) {
    const prescription = formData.get("prescription");
    if (!prescription) {
      return;
    }
    async function Edit()
    {
      await EditConsultation({ prescription }, consultationId);
    }
    Edit();
    router.refresh();
  }

  return (
    <form action={handleSubmit}>
      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2">
          {role === "PATIENT" ? (
            <Textarea
              name="prescription"
              defaultValue={initialValue}
              readOnly
            />
          ) : (
            <Textarea
              name="prescription"
              defaultValue={initialValue}
            />
          )}
        </div>
      </div>
      <DialogFooter className="sm:justify-start mt-3">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button type="submit">
          Save changes
        </Button>
      </DialogFooter>
    </form>
  );
}