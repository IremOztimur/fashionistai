'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  title: string
  image: string
  price: number
  currency: string
  inStock: boolean
  retailer: string
}

const sampleProducts: Product[] = [
  {
    id: 1,
    title: 'Classic White T-Shirt',
    image: '/placeholder.svg?height=300&width=200',
    price: 19.99,
    currency: 'USD',
    inStock: true,
    retailer: 'FashionCo',
  },
  {
    id: 2,
    title: 'Slim Fit Jeans',
    image: '/placeholder.svg?height=300&width=200',
    price: 49.99,
    currency: 'USD',
    inStock: true,
    retailer: 'DenimWorld',
  },
  {
    id: 3,
    title: 'Leather Jacket',
    image: '/placeholder.svg?height=300&width=200',
    price: 199.99,
    currency: 'USD',
    inStock: false,
    retailer: 'UrbanStyle',
  },
  // Add more sample products as needed
]

export default function ShoppingResults() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // In a real application, you would fetch products based on the search query
    // For this example, we'll use the sample products
    setProducts(sampleProducts)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="sticky top-0 bg-white z-10 py-4 mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shopping Results</h1>
        <Link
          href="/generated-style"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Back to Style
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              width={200}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">
                <a href="#" className="text-blue-600 hover:underline">
                  {product.title}
                </a>
              </h2>
              <p className="text-gray-600 mb-2">
                {product.price.toFixed(2)} {product.currency}
              </p>
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm font-semibold ${
                    product.inStock ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-sm text-gray-500">{product.retailer}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

