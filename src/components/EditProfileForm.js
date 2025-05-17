'use client';

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { updateDoctorProfile } from "@/actions/edit-profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function EditProfileForm({ user }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      doctorAge: user.doctorAge || '',
      doctorPhone: user.doctorPhone || '',
      doctorGender: user.doctorGender || '',
      doctorAddress: user.doctorAddress || '',
      doctorEducation: user.doctorEducation || '',
      doctorExperience: user.doctorExperience || '',
      doctorSpecialization: user.doctorSpecialization || '',
      doctorLicenseNo: user.doctorLicenseNo || '',
      doctorHospital: user.doctorHospital || '',
    }
  });

  const onSubmit = async (data) => {
    try {
      await updateDoctorProfile(data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto md:p-4">
      <Card className="shadow-md">
        <CardHeader className="flex md:flex-row flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.imageUrl || undefined} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              <Input 
                {...register("name", { 
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters"
                  }
                })} 
                className="text-2xl font-bold border-none shadow-none focus-visible:ring-1"
              />
            </CardTitle>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
            <div className="flex gap-3 mt-3 flex-wrap">
              <Badge variant="secondary" className="text-sm">
                <Input 
                  {...register("doctorSpecialization", { 
                    required: "Specialization is required"
                  })} 
                  className="text-sm border-none"
                />
              </Badge>
              <Badge variant="outline" className="text-sm">
                License: 
                <Input 
                  {...register("doctorLicenseNo", { 
                    required: "License number is required",
                    pattern: {
                      value: /^[A-Za-z0-9-]+$/,
                      message: "Invalid license number format"
                    }
                  })} 
                  className="text-sm border-none ml-1"
                />
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <Separator className="mb-2" />

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <Input 
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })} 
                  className="bg-background"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
                <Input 
                  {...register("doctorPhone", { 
                    pattern: {
                      value: /^\d{10,15}$/,
                      message: "Phone should be 10-15 digits"
                    }
                  })} 
                  className="bg-background"
                />
                {errors.doctorPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.doctorPhone.message}</p>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm text-muted-foreground mb-1 block">Age</label>
                <Input 
                  type="number"
                  {...register("doctorAge", { 
                    min: {
                      value: 25,
                      message: "Minimum age is 25"
                    },
                    max: {
                      value: 80,
                      message: "Maximum age is 80"
                    }
                  })} 
                  className="bg-background"
                />
                {errors.doctorAge && (
                  <p className="text-red-500 text-sm mt-1">{errors.doctorAge.message}</p>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm text-muted-foreground mb-1 block">Gender</label>
                <select 
                  {...register("doctorGender")}
                  className="w-full p-2 border rounded bg-background"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm text-muted-foreground mb-1 block">Address</label>
                <Input 
                  {...register("doctorAddress", { 
                    minLength: {
                      value: 5,
                      message: "Address must be at least 5 characters"
                    }
                  })} 
                  className="bg-background"
                />
                {errors.doctorAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.doctorAddress.message}</p>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm text-muted-foreground mb-1 block">Education</label>
                <Input 
                  {...register("doctorEducation", { 
                    required: "Education is required"
                  })} 
                  className="bg-background"
                />
                {errors.doctorEducation && (
                  <p className="text-red-500 text-sm mt-1">{errors.doctorEducation.message}</p>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm text-muted-foreground mb-1 block">Experience (years)</label>
                <Input 
                  type="number"
                  {...register("doctorExperience", { 
                    min: {
                      value: 0,
                      message: "Experience cannot be negative"
                    }
                  })} 
                  className="bg-background"
                />
                {errors.doctorExperience && (
                  <p className="text-red-500 text-sm mt-1">{errors.doctorExperience.message}</p>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="text-sm text-muted-foreground mb-1 block">Hospital</label>
                <Input 
                  {...register("doctorHospital")} 
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button 
              type="submit" 
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-8"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}