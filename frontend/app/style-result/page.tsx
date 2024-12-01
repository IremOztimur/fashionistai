'use client'

import { Button } from "@/components/ui/button"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface StyleAdvice {
  overall_style: string;
  key_pieces: string[];
  styling_tips: string[];
  color_palette: string[];
}

interface ProductResult {
  title: string;
  link: string;
  image: string;
  price: string;
  source: string;
}

export default function StyleResult() {
  const searchParams = useSearchParams()
  const [styleAdvice, setStyleAdvice] = useState<StyleAdvice | null>(null)
  const [products, setProducts] = useState<ProductResult[]>([])
  const [transformedImageUrl, setTransformedImageUrl] = useState<string>('')
  const originalQuery = searchParams.get('query')

  useEffect(() => {
    try {
      const adviceString = searchParams.get('advice')
      const productsString = searchParams.get('products')
      const transformedImage = searchParams.get('transformed_image')
      
      if (adviceString) {
        // Handle both string and object formats
        let parsedAdvice
        if (typeof adviceString === 'string') {
          try {
            // First try parsing as JSON
            parsedAdvice = JSON.parse(adviceString)
          } catch {
            // If that fails, try parsing as a JSON string within a JSON string
            const decodedString = JSON.parse(adviceString)
            parsedAdvice = typeof decodedString === 'string' ? JSON.parse(decodedString) : decodedString
          }
        } else {
          parsedAdvice = adviceString
        }
        
        // Ensure the parsed advice matches our interface
        if (typeof parsedAdvice === 'object' && parsedAdvice !== null) {
          setStyleAdvice({
            overall_style: String(parsedAdvice.overall_style || ''),
            key_pieces: Array.isArray(parsedAdvice.key_pieces) ? parsedAdvice.key_pieces.map(String) : [],
            styling_tips: Array.isArray(parsedAdvice.styling_tips) ? parsedAdvice.styling_tips.map(String) : [],
            color_palette: Array.isArray(parsedAdvice.color_palette) ? parsedAdvice.color_palette.map(String) : [],
          })
        }
      }
      
      if (productsString) {
        const parsedProducts = JSON.parse(productsString)
        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts.map(product => ({
            title: String(product.title || ''),
            link: String(product.link || ''),
            image: String(product.image || ''),
            price: String(product.price || ''),
            source: String(product.source || ''),
          })))
        }
      }
      
      if (transformedImage) {
        setTransformedImageUrl(transformedImage)
      }
    } catch (error) {
      console.error('Error parsing data:', error)
    }
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Your Style, Tailored by AI</h1>
      <div className="flex gap-6 max-w-[1400px] mx-auto">
        {/* Left Column - Style Advice */}
        <div className="w-1/2">
          <div className="bg-white shadow-sm rounded-lg p-6 h-full flex flex-col">
            {/* Transformed Image */}
            {transformedImageUrl && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Transformed Style</h3>
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={transformedImageUrl}
                    alt="Transformed style"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* User Query */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Your request:</p>
              <p className="text-gray-900 font-medium mt-2">{originalQuery}</p>
            </div>

            {/* AI Response */}
            {styleAdvice && (
              <div className="space-y-6 flex-grow">
                {/* Overall Style */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Overall Style</h3>
                  <p className="text-blue-800">{styleAdvice.overall_style}</p>
                </div>

                {/* Key Pieces */}
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Key Pieces</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {styleAdvice.key_pieces.map((piece, index) => (
                      <li key={index} className="text-purple-800">{piece}</li>
                    ))}
                  </ul>
                </div>

                {/* Styling Tips */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Styling Tips</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {styleAdvice.styling_tips.map((tip, index) => (
                      <li key={index} className="text-green-800">{tip}</li>
                    ))}
                  </ul>
                </div>

                {/* Color Palette */}
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Color Palette</h3>
                  <div className="flex flex-wrap gap-2">
                    {styleAdvice.color_palette.map((color, index) => (
                      <span key={index} className="px-3 py-1 bg-white rounded-full text-yellow-800 text-sm">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-8 pt-6 border-t">
              <Link href="/">
                <Button variant="outline" className="w-full py-8 text-lg">
                  Generate Another Style
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Product Grid */}
        <div className="w-1/2">
          <div className="bg-white shadow-sm rounded-lg p-6 h-full">
            <h2 className="text-2xl font-semibold mb-6">Suggested Items</h2>
            <div className="grid grid-cols-3 gap-4 max-h-[800px] overflow-y-auto">
              {products.length > 0 ? (
                products.slice(0, 15).map((product, index) => (
                  <a 
                    key={index}
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="group"
                  >
                    <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-sm truncate">{product.title}</p>
                        <p className="text-sm font-bold">{product.price}</p>
                        <p className="text-xs text-gray-300">{product.source}</p>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                // Placeholder squares while loading - 5x3 grid
                [...Array(15)].map((_, index) => (
                  <div 
                    key={index} 
                    className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-400">Loading...</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 