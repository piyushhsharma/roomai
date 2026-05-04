export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      icon: '📤',
      title: 'Upload your photo',
      description: 'Take a photo of your room or upload an existing one'
    },
    {
      number: '2',
      icon: '🎨',
      title: 'Choose your style',
      description: 'Pick from 20+ design styles or describe your dream room'
    },
    {
      number: '3',
      icon: '⚡',
      title: 'Get your redesign',
      description: 'AI generates photorealistic redesigns in seconds'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto mt-16">
      <h2 className="text-center text-4xl font-bold text-text-primary mb-12">
        How it works
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            {/* Number Circle */}
            <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
              {step.number}
            </div>
            
            {/* Icon */}
            <div className="text-4xl mb-4">{step.icon}</div>
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {step.title}
            </h3>
            
            {/* Description */}
            <p className="text-text-sub">
              {step.description}
            </p>
            
            {/* Arrow (hidden on mobile) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block text-center mt-8 text-2xl text-text-muted">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
