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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doctor) => (
        <Link key={doctor.id} href={`/doctor/${doctor.id}`}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex items-center gap-4">
              <img
                src={doctor?.imageUrl}
                alt={doctor?.name}
                className="h-14 w-14 rounded-full object-cover border"
              />
              <div className="space-y-1">
                <CardTitle>{doctor.name}</CardTitle>
                <CardDescription>{doctor.doctorSpecialization}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {doctor.doctorExperience} years of experience
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default page
