"use client";

import { Areachart } from "@/components/charts/Areachart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DoctorDashboard({doctors, consultations}) {

  return (
    <div>
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="w-full md:w-1/2">
            <CardHeader>
              <CardTitle>Consultations</CardTitle>
              <CardDescription>
                Total no of Consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-green-600">{consultations.length}</p>
            </CardContent>
          </Card>
          <Card className="w-full md:w-1/2">
            <CardHeader>
              <CardTitle>Doctors</CardTitle>
              <CardDescription>
                Total no of Doctors available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-blue-600">{doctors.length}</p>
            </CardContent>
          </Card>
        </div>
        <div className="my-4">
          <Areachart/>
        </div>
    </div>
  );
}
