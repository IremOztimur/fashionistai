'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const predefinedStyles = [
  'Academia',
  'Grunge',
  'Gothic',
  'Minimalist',
  'Bohemian',
  'Streetwear',
]

export default function Home() {
  const [styleDescription, setStyleDescription] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      style_description: styleDescription,
      predefined_style: selectedStyle,
    }
    try {
      // Send data to the Django backend
      const response = await fetch("http://localhost:8000/api/process-style/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        // Handle response from the backend
        const data = await response.json()
        console.log("Backend Response:", data)
    
        // Redirect to the generated style page (optional)
        // router.push('/generated-style')
      } catch (error) {
        console.error("Error submitting data:", error)
      }
    
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Find Your Perfect Style</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label htmlFor="styleDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your desired clothing style
          </label>
          <textarea
            id="styleDescription"
            rows={4}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="E.g., Casual and comfortable with a touch of elegance..."
            value={styleDescription}
            onChange={(e) => setStyleDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="predefinedStyle" className="block text-sm font-medium text-gray-700 mb-2">
            Or choose a predefined style (optional)
          </label>
          <select
            id="predefinedStyle"
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
          >
            <option value="">Select a style</option>
            {predefinedStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Generate Style
        </button>
      </form>
    </div>
  )
}

