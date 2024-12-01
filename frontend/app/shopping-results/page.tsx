import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const products = [
  { id: 1, title: 'Classic White T-Shirt', price: 19.99, currency: 'USD', availability: 'In Stock', image: '/placeholder.svg', retailer: '/placeholder.svg' },
  { id: 2, title: 'Slim Fit Jeans', price: 49.99, currency: 'USD', availability: 'Low Stock', image: '/placeholder.svg', retailer: '/placeholder.svg' },
  { id: 3, title: 'Leather Jacket', price: 199.99, currency: 'USD', availability: 'In Stock', image: '/placeholder.svg', retailer: '/placeholder.svg' },
  // Add more sample products as needed
]

export default function ShoppingResults() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Shopping Results</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold">{product.price} {product.currency}</span>
                <span className="text-sm text-green-600">{product.availability}</span>
              </div>
              <div className="flex justify-between items-center">
                <Image
                  src={product.retailer}
                  alt="Retailer Logo"
                  width={60}
                  height={30}
                  objectFit="contain"
                />
                <Button>View Product</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-4 right-4">
        <Link href="/generated-style">
          <Button>Back to Style</Button>
        </Link>
      </div>
    </div>
  )
}

