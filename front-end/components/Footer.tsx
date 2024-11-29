import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-6 flex justify-center space-x-6">
        <Link href="/about" className="text-sm text-gray-600 hover:text-gray-800">About</Link>
        <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-800">Contact</Link>
        <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-800">Privacy Policy</Link>
      </div>
    </footer>
  )
}

