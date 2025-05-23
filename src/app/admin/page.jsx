import getAllDoctors from "@/actions/getAllDoctors"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import Link from "next/link"


async function page() {
  const doctors = await getAllDoctors()

  return (
    <div className="space-y-8 p-2">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Doctors Directory</h1>
        <p className="text-sm text-muted-foreground">
          All registered specialist doctors
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doctor) => (
          <Link key={doctor.id} href={`/doctor/${doctor.id}`}>
            <Card className="hover:shadow-md transition-shadow duration-300 border border-gray-200 rounded-lg overflow-hidden">
              <CardHeader className="flex items-center gap-4 pb-2">
                <img
                  src={doctor?.imageUrl}
                  alt={doctor?.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="space-y-1">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {doctor.doctorSpecialization}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {doctor.doctorExperience} years experience
                  </span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    {doctor.doctorAvailability ? "Available" : "Unavailable"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default page;