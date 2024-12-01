'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "../components/chat/message"
import { ProductCard } from "../components/product-card"
import { Send } from 'lucide-react'

// Sample product data
const products = [
  {
    title: "Premium Leather Jacket",
    price: 199.99,
    currency: "$",
    availability: "In Stock",
    image: "/placeholder.svg",
    retailerLogo: "/placeholder.svg",
    retailerName: "Fashion Store",
    link: "#"
  },
  {
    title: "Classic Denim Jeans",
    price: 79.99,
    currency: "$",
    availability: "In Stock",
    image: "/placeholder.svg",
    retailerLogo: "/placeholder.svg",
    retailerName: "Denim Co",
    link: "#"
  },
  {
    title: "Cotton T-Shirt",
    price: 29.99,
    currency: "$",
    availability: "Low Stock",
    image: "/placeholder.svg",
    retailerLogo: "/placeholder.svg",
    retailerName: "Basics",
    link: "#"
  },
]

// Sample initial messages
const initialMessages = [
  {
    content: "Hi! I'm your fashion assistant. I can help you find the perfect clothing items. What kind of style are you looking for?",
    isBot: true,
    timestamp: "12:00 PM"
  }
]

export default function Results() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages(prev => [...prev, {
      content: input,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        content: "I've found some great options based on your preferences. Take a look at the shopping list on the right!",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 1000)

    setInput("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Chatbot Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 h-[calc(100vh-12rem)] flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Fashionistai Chatbot</h2>
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Shopping List Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shopping List</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

