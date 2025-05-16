"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddConsultation from "@/actions/addConsultation";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

export default function ConsultationDialog({ doctor }) {
  const [open, setOpen] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset,
    control,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      diagnosis: "",
      gender: "",
      age: "",
      patientPhoneNo: "",
      stage: "",
      date: new Date().toISOString().split("T")[0],
      status: "PENDING"
    }
  });

  const onSubmit = async (data) => {
    try {
      const submissionData = {
        ...data,
        doctorId: doctor.id,
      };

      const response = await AddConsultation({ data: submissionData });
      if (!response.error) {
        toast.success('Consultation requested successfully!');
        reset();
        setOpen(false);
      }
    } catch (error) {
      toast.error('Failed to submit consultation');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Request Consultation</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Consultation Request</DialogTitle>
          <DialogDescription>
            Fill out the details for the consultation with {doctor.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Diagnosis*</label>
              <Textarea
                placeholder="Enter diagnosis details"
                {...register("diagnosis", { required: "Diagnosis is required" })}
              />
              {errors.diagnosis && (
                <span className="text-red-500 text-sm">{errors.diagnosis.message}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender*</label>
                <Select
                  onValueChange={(value) => setValue("gender", value)}
                  defaultValue={watch("gender")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <span className="text-red-500 text-sm">Gender is required</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Age*</label>
                <Input
                  type="number"
                  placeholder="Patient age"
                  {...register("age", { 
                    required: "Age is required",
                    min: { value: 0, message: "Age must be positive" },
                    max: { value: 120, message: "Age must be less than 120" }
                  })}
                />
                {errors.age && (
                  <span className="text-red-500 text-sm">{errors.age.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stage of Symptom*</label>
                <Select
                  onValueChange={(value) => setValue("stage", value)}
                  defaultValue={watch("stage")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                {errors.stage && (
                  <span className="text-red-500 text-sm">Stage is required</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number*</label>
                <Input
                  placeholder="Patient phone number"
                  {...register("patientPhoneNo", { 
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10,15}$/,
                      message: "Please enter a valid phone number"
                    }
                  })}
                />
                {errors.patientPhoneNo && (
                  <span className="text-red-500 text-sm">{errors.patientPhoneNo.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  {...register("date")}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Consultation"}
            </Button>
          </DialogFooter> 
        </form>
      </DialogContent>
    </Dialog>
  );
}