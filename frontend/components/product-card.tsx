import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ProductCardProps {
  title: string
  price: number
  currency: string
  availability: string
  image: string
  retailerLogo: string
  retailerName: string
  link: string
}

export function ProductCard({
  title,
  price,
  currency,
  availability,
  image,
  retailerLogo,
  retailerName,
  link
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold">
            {currency}{price.toFixed(2)}
          </span>
          <span className="text-sm text-green-600">{availability}</span>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src={retailerLogo}
            alt={retailerName}
            width={60}
            height={30}
            className="object-contain"
          />
          <span className="text-sm text-gray-600">{retailerName}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" asChild>
          <a href={link} target="_blank" rel="noopener noreferrer">
            View Product
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

