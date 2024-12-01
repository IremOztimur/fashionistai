import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function GeneratedStyle() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Generated Style</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="relative aspect-square mb-6">
            <Image
              src="/placeholder.svg"
              alt="Generated Style"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Top</h2>
              <Button className="w-full">Search for Similar Tops</Button>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Bottom</h2>
              <Button className="w-full">Search for Similar Bottoms</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

