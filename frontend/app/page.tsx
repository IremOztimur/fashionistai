import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from 'lucide-react'
import ImageUploadModal from '../components/image-upload-modal'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Your Style, Tailored by AI</h1>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Upload an Image</h2>
            <ImageUploadModal />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">Drag and drop an image here, or click to select a file</p>
          </div>
          <Textarea 
            placeholder="Describe desired changes to the uploaded image..."
            className="mt-6 min-h-[120px]"
          />
          <Button className="w-full mt-6" size="lg">
            Generate Style
          </Button>
        </div>
      </div>
    </div>
  )
}

