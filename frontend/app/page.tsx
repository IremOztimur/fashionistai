'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const router = useRouter()

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleGenerateStyle = async () => {
    if (!selectedImage || !description.trim()) {
      alert('Please both upload an image and provide a description')
      return
    }

    try {
      setIsLoading(true)

      // First, upload the image to our backend
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('style_description', description)

      const response = await fetch('http://localhost:8000/api/process-style/', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      console.log(data)
      if (response.ok) {
        // Parse the style_advice string into a JSON object
        console.log("Raw style advice:", data.style_advice);
        
        const styleAdvice = JSON.parse(data.style_advice)
        
        // Create URL-safe parameters
        const params = new URLSearchParams({
          query: description,
          advice: JSON.stringify(styleAdvice),
          products: JSON.stringify(data.product_results)
        })
        
        // Navigate to the results page with the data
        router.push(`/style-result?${params.toString()}`)
      } else {
        console.error('Error:', data.error)
        alert('An error occurred. Please try again.')
      }
    } catch (error) {
      console.error('Error generating style:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Your Style, Tailored by AI</h1>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Upload an Image</h2>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors relative ${
                previewUrl ? 'border-blue-500' : 'border-gray-300'
              }`}
              onClick={() => document.getElementById('imageInput')?.click()}
            >
              <input
                type="file"
                id="imageInput"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
              {previewUrl ? (
                <div className="relative w-full aspect-square max-w-sm mx-auto">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <>
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="mt-4 text-gray-600">Click to upload an image, or drag and drop</p>
                </>
              )}
            </div>
          </div>
          
          <Textarea 
            placeholder="Describe the style changes you want (e.g., 'make it blue and linen material')"
            className="mt-6 min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <Button 
            className="w-full mt-6" 
            size="lg"
            onClick={handleGenerateStyle}
            disabled={isLoading || !description.trim() || !selectedImage}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </div>
            ) : 'Generate Style'}
          </Button>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg font-semibold">Transforming your style...</p>
            <p className="mt-2 text-gray-600">This may take a few moments</p>
          </div>
        </div>
      )}
    </div>
  )
}

