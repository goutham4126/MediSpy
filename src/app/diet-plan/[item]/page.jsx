"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowLeft, Utensils, Dumbbell, Heart, Leaf, Scale, Clock, Volume2, VolumeX } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function page() {
  const { item } = useParams()
  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState(null)
  const [error, setError] = useState(null)
  const [isExercise, setIsExercise] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechSynthesis = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (!item) return

    const decodedItem = decodeURIComponent(item)
    const fetchDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        const exerciseKeywords = ['yoga', 'walk', 'run', 'exercise', 'training', 'cardio', 'strength']
        const isEx = exerciseKeywords.some(keyword => 
          decodedItem.toLowerCase().includes(keyword)
        )
        setIsExercise(isEx)

        const { GoogleGenerativeAI } = await import("@google/generative-ai")

        const prompt = isEx 
          ? `Provide detailed information about the exercise "${decodedItem}" with these specific details:
            1. Proper technique and form (numbered steps)
            2. Recommended duration and frequency
            3. Targeted muscle groups
            4. Benefits for health conditions
            5. Safety precautions
            6. Equipment needed (if any)
            
            Format as clear paragraphs with headings. Be medically accurate. Do not use asterisks (*) in the response.`
          : `Provide detailed nutritional information about "${decodedItem}" (Indian food) with:
            1. Macronutrient breakdown (carbs, protein, fat)
            2. Key micronutrients and vitamins
            3. Health benefits
            4. Ideal serving size
            5. Best time to consume
            6. Preparation tips
            
            Format as clear paragraphs with headings. The headings should be bolder in text. Include Indian measurements. Do not use asterisks (*) in the response.`

        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
        const response = await model.generateContent(prompt)
        const text = response.response.text().replace(/\*/g, '')

        setDetails(text)
        toast.success("Details loaded successfully!")
      } catch (err) {
        console.error("API Error:", err)
        setError("Failed to fetch details. Please try again.")
        toast.error("Failed to load details")
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [item])

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      if (!details) return
      
      const speech = new SpeechSynthesisUtterance()
      speech.text = details
      speech.rate = 0.9
      speech.onend = () => setIsSpeaking(false)
      speech.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(speech)
      setIsSpeaking(true)
    }
  }

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSpeaking])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <div className="pt-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-5/6 mt-2" />
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )
    }

    if (!details) return null

    return (
      <div className="prose prose-sm max-w-none">
        {details.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-teal-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 text-teal-600">
            <ArrowLeft className="h-4 w-4" />
            Back to recommendations
          </Button>
          {details && (
            <Button 
              variant="outline" 
              onClick={toggleSpeech} 
              className="flex items-center gap-2"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-4 w-4" />
                  Pause Reading
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Read Aloud
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${isExercise ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
            {isExercise ? (
              <Dumbbell className="h-8 w-8" />
            ) : (
              <Utensils className="h-8 w-8" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">{decodeURIComponent(item)}</h1>
            <p className="text-gray-600">
              {isExercise ? 'Exercise details' : 'Nutritional information'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isExercise ? (
                <>
                  <Dumbbell className="h-5 w-5 text-blue-600" />
                  <span>Exercise Details</span>
                </>
              ) : (
                <>
                  <Leaf className="h-5 w-5 text-green-600" />
                  <span>Nutritional Profile</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>

        {!loading && !error && details && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isExercise ? (
              <>
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Duration</p>
                      <p className="text-blue-900">15-30 minutes</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Scale className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Intensity</p>
                      <p className="text-blue-900">Moderate</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Scale className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-green-800 font-medium">Serving Size</p>
                      <p className="text-green-900">1 medium portion</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Heart className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-green-800 font-medium">Health Benefits</p>
                      <p className="text-green-900">Rich in nutrients</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Professional Advice</p>
                <p>
                  This information is AI-generated and should not replace professional medical advice. 
                  {isExercise 
                    ? ' Consult a fitness trainer before starting new exercises.' 
                    : ' Consult a nutritionist for personalized dietary guidance.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}