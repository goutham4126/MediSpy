'use client'
import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { FaCamera, FaMicrophone, FaStethoscope } from "react-icons/fa"
import { RiSendPlaneFill } from "react-icons/ri"
import { IoMdRefresh } from "react-icons/io"
import { BsRobot } from "react-icons/bs"
import { IoSettingsOutline } from "react-icons/io5"
import { FaUserAlt } from "react-icons/fa"
import { FaRocketchat } from "react-icons/fa";

// shadcn components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from 'next/image'
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
  You are a helpful and empathetic healthcare assistant for a medical website. Your role is to provide clear, concise, and accurate health information while emphasizing that you're not a substitute for professional medical advice.

  Response Guidelines:
  1. Always respond with bullet points or numbered lists for clarity
  2. Keep responses focused and to-the-point
  3. For medical queries, ask relevant follow-up questions about:
    - Duration of symptoms
    - Patient's age and gender
    - Severity of symptoms
  4. Categorize information under clear headings when appropriate
  5. Give proper food prescription to overcome symptoms.
  6. Always include a disclaimer recommending professional consultation for serious symptoms
  7. Give response in just 100-150 words.

  Example Response Format:
  • [Key point 1]
  • [Key point 2] 
  • [Key point 3]

  Remember: This information is not a substitute for professional medical advice. For persistent or severe symptoms, please consult a healthcare provider.
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

    setUploadedImages(prev => [
      ...prev,
      ...validFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        base64: URL.createObjectURL(file),
        size: file.size,
        type: file.type
      }))
    ])
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
      const model = genAI.getGenerativeModel({ model:'gemini-2.0-flash' })
      const prompt = `
        ${systemPrompt}
        User message: ${userInput}
        ${uploadedImages.length > 0 ? "The user has uploaded images. Provide relevant medical context if applicable." : ""}
      `

      let response
      if (uploadedImages.length > 0) {
        const imageParts = await Promise.all(uploadedImages.map(async (image) => {
          const response = await fetch(image.base64)
          const blob = await response.blob()
          return {
            inlineData: {
              data: await new Promise((resolve) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result.split(',')[1])
                reader.readAsDataURL(blob)
              }),
              mimeType: image.type
            }
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
    <Dialog>  
      <DialogTrigger asChild>
          <FaRocketchat className="h-6 w-6" />
      </DialogTrigger>
      <DialogContent className="max-w-[800px] h-[80vh] p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="hidden">Healthcare Assistant</DialogTitle>
          {/* 
            FIX: Set h-[80vh] on the flex container, not h-full 
            and add min-h-0 to ScrollArea for proper scrolling
          */}
          <div className="flex flex-col h-[80vh]">
            {/* Header */}  
            <div className="rounded-none shadow-sm bg-teal-100 pt-8">
              <div className="flex items-center justify-between p-1.5 pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-teal-100">
                      <AvatarFallback className="bg-teal-100">
                        <FaStethoscope className="h-4 w-4 text-teal-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-800">Healthcare Assistant</h1>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-teal-50">
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
              {/* Notice */}
              <div className="bg-slate-100 py-2 px-4">
                <marquee className="text-xs text-center text-teal-800">
                  <span className="font-medium">Note:</span> This assistant provides general health information only. 
                  Always consult with a healthcare professional for medical advice.
                </marquee>
              </div>
            </div>

            {/* Chat area */}
            <ScrollArea className="flex-1 min-h-0 p-4 md:p-6">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
                  <Avatar className="h-20 w-20 bg-teal-100">
                    <AvatarFallback className="bg-teal-100">
                      <BsRobot className="h-8 w-8 text-teal-600" />
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-medium text-gray-700">How can I help you today?</h2>
                </div>
              ) : (
                <div className="space-y-6">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                      {msg.role === 'assistant' && (
                        <Avatar className="h-10 w-10 mt-1 flex-shrink-0 bg-teal-100">
                          <AvatarFallback className="bg-teal-100">
                            <FaStethoscope className="h-5 w-5 text-teal-600" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                        <div className={`${msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-white'} rounded-lg shadow-sm`}>
                          <div className="pb-2 pt-3 px-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {msg.role === 'user' ? 'You' : 'Healthcare Assistant'}
                              </span>
                              <span className={`text-xs ${msg.role === 'user' ? 'text-teal-200 ml-20' : 'text-gray-500'}`}>
                                {msg.timestamp}
                              </span>
                            </div>
                          </div>
                          <div className="px-4 pb-4">
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
                                        <Image
                                          src={img.base64}
                                          alt={img.name}
                                          width={100}
                                          height={100}
                                          className="w-24 h-24 object-cover rounded-lg border border-teal-200"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {msg.role === 'user' && (
                        <Avatar className="h-10 w-10 mt-1 flex-shrink-0 bg-teal-100">
                          <AvatarFallback className="bg-teal-100">
                            <FaUserAlt className="h-5 w-5 text-teal-600" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start gap-3">
                      <Avatar className="h-10 w-10 mt-1 flex-shrink-0 bg-teal-100">
                        <AvatarFallback className="bg-teal-100">
                          <FaStethoscope className="h-5 w-5 text-teal-600" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-[85%]">
                        <div className="bg-white rounded-lg shadow-sm">
                          <div className="pb-2 pt-3 px-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Healthcare Assistant</span>
                              <span className="text-xs text-gray-500 ml-6">typing...</span>
                            </div>
                          </div>
                          <div className="px-4 pb-4">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-[90%]" />
                              <Skeleton className="h-4 w-[80%]" />
                            </div>
                          </div>
                        </div>
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
                        <Image 
                          src={img.base64} 
                          alt={img.name} 
                          height={100}
                          width={100}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <Badge
                          onClick={() => removeImage(img.id)}
                          className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                        >
                          ×
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message..."
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                      }
                    }}
                    className="flex-1"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current.click()}
                        className="hover:bg-teal-50"
                      >
                        <FaCamera className="h-5 w-5 text-gray-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Attach image (max 3)</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isListening ? "secondary" : "ghost"}
                        size="icon"
                        onClick={toggleListening}
                        className="hover:bg-teal-50"
                      >
                        <FaMicrophone className={`h-5 w-5 ${isListening ? "text-teal-600 animate-pulse" : "text-gray-600"}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isListening ? "Listening..." : "Voice input"}
                    </TooltipContent>
                  </Tooltip>
                  <Button
                    variant="teal"
                    size="icon"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    <RiSendPlaneFill className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
