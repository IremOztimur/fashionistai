import Link from 'next/link'
import { ShirtIcon } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <ShirtIcon className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-semibold text-gray-800">AI Clothing Assistant</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link></li>
            <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link></li>
            <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

