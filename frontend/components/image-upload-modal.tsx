'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info } from 'lucide-react'

export default function ImageUploadModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <Info className="mr-2 h-4 w-4" />
          Upload Tips
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Image Upload Guidelines</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Follow these tips for the best results:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use high-resolution images for better quality results.</li>
            <li>Ensure the clothing item is clearly visible and centered in the image.</li>
            <li>Avoid images with multiple items or cluttered backgrounds.</li>
            <li>Use natural lighting for accurate color representation.</li>
          </ul>
          <p>When describing changes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Be specific about colors, materials, and styles.</li>
            <li>Mention any particular features you want to add or remove.</li>
            <li>Provide context for the intended use of the clothing item.</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

