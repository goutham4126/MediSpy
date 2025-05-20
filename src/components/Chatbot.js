'use client'
import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { FaCamera, FaMicrophone, FaStethoscope } from "react-icons/fa"
import { RiSendPlaneFill } from "react-icons/ri"
import { IoMdArrowRoundBack, IoMdRefresh } from "react-icons/io"
import { BsRobot } from "react-icons/bs"
import { IoSettingsOutline } from "react-icons/io5"

// shadcn components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable")
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

export default function Chatbot() {
  const [chatHistory, setChatHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthcareChatHistory')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const router = useRouter()
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const chatEndRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const fileInputRef = useRef(null)
  const inputRef = useRef(null)

  const systemPrompt = `
  You are a helpful healthcare assistant for a medical website. Provide clear, 
  concise, and accurate health information while emphasizing that you're not 
  a substitute for professional medical advice. Be empathetic and supportive 
  in your responses. For complex medical questions, always recommend consulting 
  with a healthcare professional.
  `

  useEffect(() => {
    localStorage.setItem('healthcareChatHistory', JSON.stringify(chatHistory))
  }, [chatHistory])

  const clearHistory = () => {
    setChatHistory([])
    setUploadedImages([])
    localStorage.removeItem('healthcareChatHistory')
    toast.success('Chat history cleared')
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = 'en-US'

        recognitionInstance.onresult = (event) => {
          const transcript = Array.from(event.results).map(result => result[0].transcript).join('')
          setUserInput(prev => prev + (prev ? ' ' : '') + transcript)
        }

        recognitionInstance.onerror = (event) => {
          setIsListening(false)
          toast.error('Speech recognition error: ' + event.error)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      } else {
        toast.error('Speech recognition not supported in your browser')
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Speech recognition not available')
      return
    }
    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
      toast('Listening... Speak now', {
        icon: '🎤',
        duration: 3000,
      })
    }
    setIsListening(!isListening)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 3) {
      toast.error('Maximum 3 images allowed')
      return
    }
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`)
        return false
      }
      return true
    })

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, { 
          id: Date.now(), 
          name: file.name, 
          base64: reader.result,
          size: file.size,
          type: file.type
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id))
  }

  const handleSubmit = async () => {
    if (!userInput.trim() && uploadedImages.length === 0) {
      return toast.error('Please enter a message or upload an image')
    }

    const userMessage = {
      role: 'user',
      content: userInput,
      images: uploadedImages,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setChatHistory(prev => [...prev, userMessage])
    setUserInput('')
    setUploadedImages([])
    setIsLoading(true)

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

      const prompt = `
        ${systemPrompt}
        User message: ${userInput}
        ${uploadedImages.length > 0 ? "The user has uploaded images. Provide relevant medical context if applicable." : ""}
      `

      let response
      if (uploadedImages.length > 0) {
        const imageParts = uploadedImages.map(image => ({
          inlineData: {
            data: image.base64.split(',')[1],
            mimeType: image.base64.split(';')[0].split(':')[1]
          }
        }))
        response = await model.generateContent([prompt, ...imageParts])
      } else {
        response = await model.generateContent(prompt)
      }

      const result = await response.response
      const text = result.text()

      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } catch (error) {
      console.error(error)
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      toast.error('Error processing your request')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isLoading])

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0 shadow-sm bg-white">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="hover:bg-blue-50"
                  >
                    <IoMdArrowRoundBack className="h-5 w-5 text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Go back</TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 bg-blue-100">
                  <AvatarFallback className="bg-blue-100">
                    <FaStethoscope className="h-4 w-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">Healthcare Assistant</h1>
                  <p className="text-xs text-gray-500">Powered by Gemini AI</p>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                  <IoSettingsOutline className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={clearHistory} className="cursor-pointer">
                  <IoMdRefresh className="mr-2 h-4 w-4" />
                  <span>Clear conversation</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      {/* Notice */}
      <div className="bg-blue-100/50 py-2 px-4 border-b border-blue-200">
        <p className="text-xs text-center text-blue-800">
          <span className="font-medium">Note:</span> This assistant provides general health information only. 
          Always consult with a healthcare professional for medical advice.
        </p>
      </div>

      {/* Chat area */}
      <ScrollArea className="flex-1 p-4 md:p-6">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
            <Avatar className="h-20 w-20 bg-blue-100">
              <AvatarFallback className="bg-blue-100">
                <BsRobot className="h-8 w-8 text-blue-600" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-medium text-gray-700">How can I help you today?</h2>
            <p className="text-sm max-w-md">
              Ask me about symptoms, medications, or general health advice. 
              You can also upload images for analysis.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-4 w-full max-w-md">
              <Card className="p-3 text-left hover:bg-blue-50 cursor-pointer" onClick={() => {
                setUserInput("What are the common symptoms of flu?")
                inputRef.current?.focus()
              }}>
                <CardTitle className="text-sm font-medium">Flu symptoms</CardTitle>
                <CardDescription className="text-xs">Learn about common flu indicators</CardDescription>
              </Card>
              <Card className="p-3 text-left hover:bg-blue-50 cursor-pointer" onClick={() => {
                setUserInput("How to manage stress and anxiety?")
                inputRef.current?.focus()
              }}>
                <CardTitle className="text-sm font-medium">Stress management</CardTitle>
                <CardDescription className="text-xs">Techniques to reduce anxiety</CardDescription>
              </Card>
              <Card className="p-3 text-left hover:bg-blue-50 cursor-pointer" onClick={() => {
                setUserInput("What foods help with digestion?")
                inputRef.current?.focus()
              }}>
                <CardTitle className="text-sm font-medium">Digestive health</CardTitle>
                <CardDescription className="text-xs">Foods that aid digestion</CardDescription>
              </Card>
              <Card className="p-3 text-left hover:bg-blue-50 cursor-pointer" onClick={() => {
                setUserInput("When should I see a doctor for a headache?")
                inputRef.current?.focus()
              }}>
                <CardTitle className="text-sm font-medium">Headache advice</CardTitle>
                <CardDescription className="text-xs">Warning signs to watch for</CardDescription>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                {msg.role === 'assistant' && (
                  <Avatar className="h-10 w-10 mt-1 flex-shrink-0 bg-blue-100">
                    <AvatarFallback className="bg-blue-100">
                      <FaStethoscope className="h-5 w-5 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                  <Card className={`${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white'} shadow-sm`}>
                    <CardHeader className="pb-2 pt-3 px-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {msg.role === 'user' ? 'You' : 'Healthcare Assistant'}
                        </span>
                        <span className={`text-xs ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none text-gray-700">
                          {msg.content.split('\n').map((paragraph, i) => (
                            <p key={i} className="mb-3 last:mb-0">{paragraph}</p>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <p>{msg.content}</p>
                          {msg.images?.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                              {msg.images.map((img) => (
                                <div key={img.id} className="relative group">
                                  <img
                                    src={img.base64}
                                    alt={img.name}
                                    className="w-24 h-24 object-cover rounded-lg border border-blue-200"
                                  />
                                  <Badge
                                    onClick={() => removeImage(img.id)}
                                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                {msg.role === 'user' && (
                  <Avatar className="h-10 w-10 mt-1 flex-shrink-0 bg-blue-100">
                    <AvatarFallback className="bg-blue-100 text-blue-600">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-3">
                <Avatar className="h-10 w-10 mt-1 flex-shrink-0 bg-blue-100">
                  <AvatarFallback className="bg-blue-100">
                    <FaStethoscope className="h-5 w-5 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[85%]">
                  <Card className="bg-white shadow-sm">
                    <CardHeader className="pb-2 pt-3 px-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Healthcare Assistant</span>
                        <span className="text-xs text-gray-500">typing...</span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[80%]" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          {uploadedImages.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {uploadedImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img 
                    src={img.base64} 
                    alt={img.name} 
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200" 
                  />
                  <Badge
                    onClick={() => removeImage(img.id)}
                    className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white cursor-pointer opacity-100 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                    {img.name}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-start">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                placeholder="Ask about symptoms, medications, or general health..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="pr-12 min-h-[48px]"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 w-8 hover:bg-blue-50"
                    >
                      <FaCamera className="h-4 w-4 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upload image</TooltipContent>
                </Tooltip>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleImageUpload}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleListening}
                      className={`h-8 w-8 hover:bg-blue-50 ${isListening ? 'bg-red-100' : ''}`}
                    >
                      <FaMicrophone className={`h-4 w-4 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isListening ? 'Stop listening' : 'Voice input'}</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || (!userInput.trim() && uploadedImages.length === 0)}
              className="h-[48px] min-w-[48px] bg-blue-600 hover:bg-blue-700"
            >
              <RiSendPlaneFill className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}