"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CopyText from "@/components/CopyText";
import { Button } from "@/components/ui/button";
import AddVideoUrl from "@/actions/addVideoUrl";
import {
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation";

export function VideoUrl({initialValue,consultationId,role}) {
  const router = useRouter();

  function handleSubmit(formData) {
    const videoUrl = formData.get("videoUrl");
    if (!videoUrl) {
      return;
    }
    async function Video()
    {
      await AddVideoUrl({ videoUrl }, consultationId);
    }
    Video();
    router.refresh();
  }

  return (
    <form action={handleSubmit}>
      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            {
              role === "PATIENT" ? (
                <Input
                  name="videoUrl"
                  defaultValue={initialValue}
                  readOnly
                />
              ) : (
                <Input
                  name="videoUrl"
                  defaultValue={initialValue}
                />
              )
            }
        </div>
          <CopyText text={initialValue} />
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


              