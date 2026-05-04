'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile?: File
}

export default function UploadZone({ onFileSelect, selectedFile }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${selectedFile ? 'border-green-500 bg-green-50' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="text-gray-600">
        {selectedFile ? (
          <div>
            <div className="text-green-600 font-semibold mb-2">✓ {selectedFile.name}</div>
            <div className="text-sm">Click or drag to replace</div>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-4">📸</div>
            <div className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop your room photo here' : 'Upload your room photo'}
            </div>
            <div className="text-sm text-gray-500">
              Drag & drop or click to browse
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Supports: JPEG, PNG, WebP, HEIC (max 10MB)
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
