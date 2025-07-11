"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, Search, AlertCircle, Heart, Utensils, Dumbbell } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"

export default function page() {
  const [disease, setDisease] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const savedData = localStorage.getItem('dietAdvisorData')
    if (savedData) {
      try {
        const { disease: savedDisease, result: savedResult } = JSON.parse(savedData)
        setDisease(savedDisease)
        setResult(savedResult)
      } catch (e) {
        console.error("Failed to parse saved data", e)
      }
    }
  }, [])

  useEffect(() => {
    if (disease || result) {
      const dataToSave = { disease, result }
      localStorage.setItem('dietAdvisorData', JSON.stringify(dataToSave))
    }
  }, [disease, result])

  const clearAll = () => {
    setDisease("")
    setResult(null)
    setError(null)
    localStorage.removeItem('dietAdvisorData')
    toast.success("All fields have been reset.")
  }

  const parseAIResponse = (text) => {
    const sections = {
      foodsToAvoid: [],
      foodsToEat: [],
      breakfast: [],
      lunch: [],
      snacks: [],
      dinner: [],
      exercise: [],
    }

    const lines = text.replace(/\r\n/g, '\n').split('\n').filter(line => line.trim())
    let currentSection = null

    const sectionHeaders = {
      'foods to avoid': 'foodsToAvoid',
      'foods to eat': 'foodsToEat',
      'healthy breakfast': 'breakfast',
      'breakfast': 'breakfast',
      'lunch': 'lunch',
      'dinner': 'dinner',
      'recommended exercise': 'exercise',
      'exercise': 'exercise'
    }

    lines.forEach(line => {
      const trimmedLine = line.trim().toLowerCase()

      for (const [header, section] of Object.entries(sectionHeaders)) {
        if (trimmedLine.startsWith(header)) {
          currentSection = section
          return
        }
      }

      if (currentSection) {
        const itemMatch = line.match(/^(\d+\.|\-|\*)\s*(.+)/)
        if (itemMatch) {
          const item = itemMatch[2].trim()
          if (item && sections[currentSection].length < 5) {
            sections[currentSection].push(item)
          }
        }
      }
    })

    return sections
  }

  const handleGenerate = async () => {
    if (!disease.trim()) {
      toast.error("Please enter a disease name.")
      return
    }

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      toast.error("API key not configured. Please add your Gemini API key to environment variables.")
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai")

      const prompt = `As a professional nutritionist and fitness expert, provide specific recommendations (Indian cuisine) for managing "${disease}" with these requirements:

      1. Include exactly 5 items per category
      2. Use only numbered lists (1., 2., etc.)
      3. Format exactly as shown:

      Foods to Avoid:
      1. [Item 1]
      2. [Item 2]
      3. [Item 3]
      4. [Item 4]
      5. [Item 5]

      Foods to Eat:
      1. [Item 1]
      2. [Item 2]
      3. [Item 3]
      4. [Item 4]
      5. [Item 5]

      Breakfast Options:
      1. [Option 1]
      2. [Option 2]
      3. [Option 3]
      4. [Option 4]
      5. [Option 5]

      Lunch Options:
      1. [Option 1]
      2. [Option 2]
      3. [Option 3]
      4. [Option 4]
      5. [Option 5]

      Dinner Options:
      1. [Option 1]
      2. [Option 2]
      3. [Option 3]
      4. [Option 4]
      5. [Option 5]

      Exercise Recommendations:
      1. [Exercise 1]
      2. [Exercise 2]
      3. [Exercise 3]
      4. [Exercise 4]
      5. [Exercise 5]

      Be medically accurate and specific. Do not include explanations or disclaimers.`

      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
      const response = await model.generateContent(prompt)
      const text = response.response.text()

      const parsedResult = parseAIResponse(text)
      setResult(parsedResult)
      toast.success("Recommendations generated successfully!")
    } catch (err) {
      console.error("API Error:", err)
      setError("Failed to generate recommendations. Please try again.")
      toast.error("Failed to generate recommendations.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleGenerate()
    }
  }

  const renderSection = (title, items, icon, color) => {
    if (!items || items.length === 0) return null

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-lg ${color}`}>
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        {
          (title === "Foods to Avoid" || title === "Recommended Exercises") ?
            <CardContent>
              <ul className="space-y-2">
                {items.slice(0, 5).map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5 h-1.5 w-1.5 rounded-full p-0" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            :
            <CardContent>
              <ul className="space-y-2">
                {items.slice(0, 5).map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5 h-1.5 w-1.5 rounded-full p-0" />
                    <Link href={`/diet-plan/${encodeURIComponent(item)}`} className="text-gray-700 leading-relaxed">{item}</Link>
                  </li>
                ))}
              </ul>
            </CardContent>
        }
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-teal-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Heart className="h-8 w-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">Disease-Based Diet & Fitness Advisor</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get personalized nutrition and exercise recommendations based on your health condition.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter a disease (e.g., diabetes, hypertension, arthritis)"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-base"
                  disabled={loading}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 flex-1"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  {loading ? "Generating..." : "Generate"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearAll} 
                  disabled={loading} 
                  className="px-4 bg-transparent"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {error && (
          <Card className="max-w-2xl mx-auto bg-red-50 border-red-200">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {result && !loading && (
          <div className="space-y-8">
            <Separator />

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Utensils className="h-6 w-6 text-teal-600" />
                Nutrition Guidelines
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderSection(
                  "Foods to Avoid",
                  result.foodsToAvoid,
                  <AlertCircle className="h-5 w-5" />,
                  "text-red-600"
                )}
                {renderSection(
                  "Foods to Eat",
                  result.foodsToEat,
                  <Heart className="h-5 w-5" />,
                  "text-green-600"
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Daily Meal Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderSection(
                  "Breakfast",
                  result.breakfast,
                  <Utensils className="h-5 w-5" />,
                  "text-orange-600"
                )}
                {renderSection(
                  "Lunch",
                  result.lunch,
                  <Utensils className="h-5 w-5" />,
                  "text-blue-600"
                )}
                {renderSection(
                  "Dinner",
                  result.dinner,
                  <Utensils className="h-5 w-5" />,
                  "text-indigo-600"
                )}
              </div>
            </div>

            {result.exercise && result.exercise.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Dumbbell className="h-6 w-6 text-teal-600" />
                  Exercise Recommendations
                </h2>
                <div className="max-w-2xl">
                  {renderSection(
                    "Recommended Exercises",
                    result.exercise,
                    <Dumbbell className="h-5 w-5" />,
                    "text-teal-600"
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <Card className="max-w-4xl mx-auto bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Medical Disclaimer</p>
                <p>
                  This tool provides general dietary and fitness suggestions based on AI analysis. Always consult with
                  healthcare professionals before making significant changes to your diet or exercise routine,
                  especially when managing medical conditions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}