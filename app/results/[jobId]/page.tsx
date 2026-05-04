'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ImageHotspots from '@/components/ImageHotspots'

interface Product {
  name: string
  price: number
  retailer: string
  image_url: string
  product_url: string
  style_match_score: number
}

interface DetectedObject {
  label: string
  category: string
  bounding_box: { x: number; y: number; w: number; h: number }
  search_query: string
}

interface Job {
  id: string
  status: string
  original_image_url: string
  generated_image_url: string
  theme: string
  color_preferences: string[]
  budget_min: number
  budget_max: number
  detected_objects?: DetectedObject[]
  products: Product[]
  error_message?: string
}

export default function ResultsPage() {
  const params = useParams()
  const jobId = params.jobId as string
  
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOriginal, setShowOriginal] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/jobs/${jobId}`)
        if (response.ok) {
          const jobData = await response.json()
          setJob(jobData)
        }
      } catch (error) {
        console.error('Error fetching job:', error)
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      fetchJob()
      const interval = setInterval(fetchJob, 3000) // Poll every 3 seconds
      return () => clearInterval(interval)
    }
  }, [jobId])

  const getStatusMessage = (status: string) => {
    const statusMessages = {
      pending: 'Job queued...',
      processing: 'Analyzing your room...',
      cv_done: 'Understanding layout and furniture...',
      generating: 'Generating your redesign...',
      matching: 'Finding matching products...',
      complete: 'Your redesign is ready!',
      failed: 'Something went wrong'
    }
    return statusMessages[status as keyof typeof statusMessages] || status
  }

  const getProgressPercent = (status: string) => {
    const progressMap = {
      pending: 0,
      processing: 20,
      cv_done: 40,
      generating: 70,
      matching: 85,
      complete: 100,
      failed: 0
    }
    return progressMap[status as keyof typeof progressMap] || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your design...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Design not found</p>
        </div>
      </div>
    )
  }

  if (job.status === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {job.error_message}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Toggle Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setShowOriginal(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all
                    ${!showOriginal ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Redesigned
                </button>
                <button
                  onClick={() => setShowOriginal(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all
                    ${showOriginal ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Original
                </button>
              </div>

              {/* Image Display */}
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {job.status === 'complete' ? (
                  showOriginal ? (
                    <img
                      src={job.original_image_url}
                      alt="Original room"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageHotspots
                      imageUrl={job.generated_image_url}
                      detectedObjects={job.detected_objects}
                      products={job.products}
                      onProductClick={(product) => {
                        // Scroll to product in the sidebar
                        const productElement = document.getElementById(`product-${job.products.indexOf(product)}`)
                        productElement?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">{getStatusMessage(job.status)}</p>
                    <div className="w-64 mt-4 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercent(job.status)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {job.status === 'complete' && (
                <div className="flex gap-4 mt-6">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Download Image
                  </button>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Redesign Again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Products */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Shop the Look</h2>
              
              {job.status === 'complete' && job.products && job.products.length > 0 ? (
                <div className="space-y-6">
                  {job.products.map((product, index) => (
                    <div 
                      key={index} 
                      id={`product-${index}`}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{product.retailer}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">${product.price}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                {Math.round(product.style_match_score * 100)}% match
                              </span>
                              <a
                                href={product.product_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                View →
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Estimated Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${job.products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <p className="text-gray-600 mt-4">Finding products...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
