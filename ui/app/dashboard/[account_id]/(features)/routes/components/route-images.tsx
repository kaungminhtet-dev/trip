'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';
import { deleteRouteImage, uploadRouteImage } from '../lib/actions';

interface RouteImagesProps {
  images: string[]
  routeId: string
}

export function RouteImages({ images, routeId }: RouteImagesProps) {
  const [isUploading, setIsUploading] = useState(false)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)
    try {
      await uploadRouteImage(routeId, e.target.files[0])
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  console.log("images", images)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Route Images</h3>
          <div className="relative">
            <input
              type="file"
              id="image-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
            />
            <Button variant="outline" disabled={isUploading}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Add Image"}
            </Button>
          </div>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-md border">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Route image ${index + 1}`}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteRouteImage(routeId, image)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md">
            <p className="text-muted-foreground">No images available for this route.</p>
            <p className="text-sm text-muted-foreground mt-1">Upload images to showcase this route.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
