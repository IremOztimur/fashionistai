'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const clothingParts = [
  { name: 'Top', position: { top: '10%', left: '25%', width: '50%', height: '30%' } },
  { name: 'Pants', position: { top: '45%', left: '25%', width: '50%', height: '45%' } },
]

export default function GeneratedStyle() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Your Generated Style</h1>
      <div className="relative max-w-md mx-auto">
        <Image
          src="/placeholder.svg?height=600&width=400"
          alt="Generated clothing style"
          width={400}
          height={600}
          className="rounded-lg shadow-lg"
        />
        {clothingParts.map((part) => (
          <div
            key={part.name}
            className={`absolute border-2 rounded-md cursor-pointer transition-all duration-300 ${
              selectedPart === part.name ? 'border-blue-500' : 'border-transparent hover:border-blue-300'
            }`}
            style={part.position}
            onClick={() => setSelectedPart(part.name)}
          >
            {selectedPart === part.name && (
              <Link
                href={`/shopping-results?part=${part.name.toLowerCase()}`}
                className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded"
              >
                Search for Similar
              </Link>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300"
        >
          Back to Landing Page
        </Link>
      </div>
    </div>
  )
}

