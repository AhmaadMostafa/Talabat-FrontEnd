import { useState } from 'react'
import { FaBox } from 'react-icons/fa'

interface SafeImageProps {
  src?: string
  alt: string
  className?: string
  fallbackIcon?: React.ReactNode
}

export default function SafeImage({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // If no src provided, show fallback immediately
  if (!src) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        {fallbackIcon || <FaBox className="w-6 h-6 text-gray-400" />}
      </div>
    )
  }

  // Check if it's an external URL that might cause proxy issues
  const isExternalUrl = src.startsWith('http') || src.startsWith('//')
  const isPlaceholderUrl = src.includes('placeholder') || 
                          src.includes('picsum') || 
                          src.includes('via.placeholder') ||
                          src.includes('loremflickr')

  // If it's a problematic external URL, use fallback immediately
  if (isExternalUrl && isPlaceholderUrl) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        {fallbackIcon || <FaBox className="w-6 h-6 text-gray-400" />}
      </div>
    )
  }
  
  return (
    <div className={`${className} relative bg-gray-100 rounded-lg overflow-hidden`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => {
          setIsLoading(false)
          setHasError(false)
        }}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        style={{ display: hasError ? 'none' : 'block' }}
      />
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          {fallbackIcon || <FaBox className="w-6 h-6 text-gray-400" />}
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 w-full h-full"></div>
        </div>
      )}
    </div>
  )
}
