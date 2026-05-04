export default function FeatureCards() {
  const features = [
    {
      icon: '🏢',
      title: 'Room Types',
      description: 'Living room, bedroom, kitchen, bathroom & more'
    },
    {
      icon: '🟪',
      title: 'Design Styles',
      description: 'Modern, Scandinavian, Bohemian, Industrial & more'
    },
    {
      icon: '✨',
      title: 'Instant Results',
      description: 'Get photorealistic renders in under 30 seconds'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-card-bg border border-border rounded-card p-6 text-center hover:shadow-card hover:-translate-y-1 transition-all"
        >
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
          <p className="text-text-sub">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
