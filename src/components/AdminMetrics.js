"use client";

import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function AdminMetrics({ doctors, consultations, patients }) {
  const pieData = [
    { name: "Doctors", value: doctors.length },
    { name: "Consultations", value: consultations.length },
  ];

  const barData = [
    {
      name: "Count",
      Doctors: doctors.length,
      Patients: patients.length,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full h-[100vh] gap-6 p-4">
      {/* Pie Chart Card */}
      <Card className="w-full md:w-1/2 h-full min-w-0 flex flex-col">
        <CardHeader>
          <CardTitle>Admin Metrics</CardTitle>
          <CardDescription>
            Overview of doctors and consultations
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="flex gap-4">
            {pieData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div
                  className="w-3 h-3 mr-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* Bar Chart Card */}
      <Card className="w-full md:w-1/2 h-full min-w-0 flex flex-col">
        <CardHeader>
          <CardTitle>Doctor vs Patient Count</CardTitle>
          <CardDescription>
            Compare number of doctors and patients
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Bar dataKey="Doctors" fill={COLORS[0]} />
                <Bar dataKey="Patients" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="flex gap-4">
            <div className="flex items-center">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: COLORS[0] }}
              />
              <span className="text-sm">Doctors: {doctors.length}</span>
            </div>
            <div className="flex items-center">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: COLORS[1] }}
              />
              <span className="text-sm">Patients: {patients.length}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
