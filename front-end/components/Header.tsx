import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-gray-800">Gemma Clothing Assistant</span>
        </Link>
        <p className="text-sm text-gray-600 hidden sm:block">Your Style, Tailored by AI</p>
      </div>
    </header>
  )
}
