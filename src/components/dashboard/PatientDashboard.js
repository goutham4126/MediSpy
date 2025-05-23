"use client";
import { Component } from "../charts/BarChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PatientDashboard({doctors, consultations}) {

  return (
    <div>
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="w-full md:w-1/3">
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
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle>Health Index</CardTitle>
              <CardDescription>
                Your current health condition
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const risk = Number(consultations[0]?.riskFactor);
                let label = "Normal";
                let color = "bg-green-100 text-green-800";

                if (risk > 70) {
                  label = "High";
                  color = "bg-red-700 text-white";
                } else if (risk > 50) {
                  label = "Severe";
                  color = "bg-yellow-500 text-white";
                } else if (risk < 30) {
                  label = "Low";
                  color = "bg-green-100 text-green-800";
                } else {
                  label = "Normal";
                  color = "bg-blue-100 text-blue-800";
                }

                return (
                  <span className={`inline-block px-5 py-1 rounded-full font-bold text-base ${color}`}>
                    {label}
                  </span>
                );
              })()}
            </CardContent>

          </Card>
          <Card className="w-full md:w-1/3">
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
          <Component consultations={consultations} />
        </div>
    </div>
  );
}
