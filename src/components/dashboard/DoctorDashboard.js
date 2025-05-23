import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info } from "lucide-react";
import { AvailabilitySelect } from "@/components/AvailabilitySelect";
import { CiBookmarkCheck } from "react-icons/ci";

export default async function DoctorDashboard({ consultations, user }) {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Consultations</CardTitle>
            <CardDescription>Total no of Consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-blue-600">
              {consultations.length}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>Your current availability</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-green-600">
              {user.doctorAvailability ? "Available" : "Unavailable"}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Edit Availability</CardTitle>
            <CardDescription>Change your availability</CardDescription>
          </CardHeader>
          <CardContent>
            <AvailabilitySelect initialValue={user.doctorAvailability} />
          </CardContent>
        </Card>
      </div>
      
      <div className="my-10">
        <Card className="relative overflow-hidden shadow-xl rounded-3xl">
          <CardHeader className="flex flex-row items-center gap-6 pb-2 z-10 relative">
            <div className="rounded-xl p-4 shadow-lg flex items-center justify-center">
              <Info className="w-8 h-8 drop-shadow-lg" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">
                Doctor's Dashboard Guide
              </CardTitle>
              <CardDescription className="text-base font-medium">
                Essential reminders and best practices for a smooth consultation workflow.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <ul className="list-none pl-0 space-y-5 text-base md:text-lg font-medium">
              <li className="flex items-start gap-3 bg-white/60 rounded-xl px-4 py-3 shadow-sm hover:bg-blue-100/60 transition">
                <span className="text-green-500 text-2xl"><CiBookmarkCheck /></span>
                <span>
                  Update your availability regularly to ensure accurate scheduling.
                </span>
              </li>
              <li className="flex items-start gap-3 bg-white/60 rounded-xl px-4 py-3 shadow-sm hover:bg-blue-100/60 transition">
                <span className="text-blue-500 text-2xl"><CiBookmarkCheck /></span>
                <span>
                  Review pending consultations daily and follow up promptly.
                </span>
              </li>
              <li className="flex items-start gap-3 bg-white/60 rounded-xl px-4 py-3 shadow-sm hover:bg-blue-100/60 transition">
                <span className="text-indigo-500 text-2xl"><CiBookmarkCheck /></span>
                <span>
                  Ensure a stable internet connection for seamless video calls.
                </span>
              </li>
              <li className="flex items-start gap-3 bg-white/60 rounded-xl px-4 py-3 shadow-sm hover:bg-blue-100/60 transition">
                <span className="text-yellow-500 text-2xl"><CiBookmarkCheck /></span>
                <span>
                  Document diagnoses and prescriptions clearly and thoroughly.
                </span>
              </li>
              <li className="flex items-start gap-3 bg-white/60 rounded-xl px-4 py-3 shadow-sm hover:bg-blue-100/60 transition">
                <span className="text-red-500 text-2xl"><CiBookmarkCheck /></span>
                <span>
                  Respect patient privacy and confidentiality at all times.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
