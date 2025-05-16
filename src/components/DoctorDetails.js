import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ConsultationDialog from "./ConsultationDialog";

function DoctorDetails({ user }) {
  const details = [
    { label: "Email", value: user.email },
    { label: "Phone", value: user.doctorPhone },
    { label: "Age", value: user.doctorAge },
    { label: "Gender", value: user.doctorGender },
    { label: "Experience", value: user.doctorExperience ? `${user.doctorExperience} years` : null },
    { label: "Education", value: user.doctorEducation },
    { label: "Specialization", value: user.doctorSpecialization },
    { label: "License No", value: user.doctorLicenseNo },
    { label: "Hospital", value: user.doctorHospital },
    { label: "Address", value: user.doctorAddress },
    { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString() },
  ].filter(item => item.value);

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
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <div className="flex gap-3 mt-3 flex-wrap">
              {user.doctorSpecialization && (
                <Badge variant="secondary" className="text-sm">
                  {user.doctorSpecialization}
                </Badge>
              )}
              {user.doctorLicenseNo && (
                <Badge variant="outline" className="text-sm">
                  License: {user.doctorLicenseNo}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <Separator className="mb-2" />

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {details.map((item, index) => (
              <div key={index} className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <ConsultationDialog doctor={user} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DoctorDetails;