"use client"

import Loading from "@/app/loading"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function Location() {
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })
          setLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLoading(false)
        },
      )
    } else {
      console.error("Geolocation is not supported by your browser.")
      setLoading(false)
    }
  }, [])

  const getMapSrc = () => {
    const baseUrl = "https://www.google.com/maps/embed/v1/search"
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY
    return `${baseUrl}?key=${key}&center=${userLocation.latitude},${userLocation.longitude}&q=hospitals or clinics&zoom=13`
  }

  return (
    <div className="my-3 space-y-4">
      {loading ? (
        <div>
            ...
        </div>
      ) : userLocation ? (
        <AlertDialog>
            <AlertDialogTrigger className="border-2 border-gray-300 rounded-lg">
                <Image src="/map.jpg" alt="open map" width={30} height={30} className="rounded-lg"/>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Nearest hospitals and clinics</AlertDialogTitle>
                <AlertDialogDescription>
                    <iframe 
                        width="100%"
                        height="100%"
                        className="h-[80vh]"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={getMapSrc()}
                    ></iframe>
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      ) : (
        <div className="flex justify-center h-[80vh] items-center">
          <p>Unable to fetch location. Please check your location settings and try again.</p>
        </div>
      )}
    </div>
  )
}
