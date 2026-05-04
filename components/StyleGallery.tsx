export default function StyleGallery() {
  const styles = [
    {
      name: 'Modern',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    {
      name: 'Scandinavian',
      gradient: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
    },
    {
      name: 'Bohemian',
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
    },
    {
      name: 'Industrial',
      gradient: 'linear-gradient(135deg, #4b6cb7, #182848)'
    },
    {
      name: 'Minimalist',
      gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)'
    },
    {
      name: 'Japandi',
      gradient: 'linear-gradient(135deg, #d4b896, #a0856c)'
    },
    {
      name: 'Coastal',
      gradient: 'linear-gradient(135deg, #74b9ff, #0984e3)'
    },
    {
      name: 'Luxury',
      gradient: 'linear-gradient(135deg, #f7971e, #ffd200)'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto mt-16">
      <h2 className="text-center text-3xl font-bold text-text-primary mb-4">
        Explore design styles
      </h2>
      <p className="text-center text-text-sub mb-12">
        See what AI can do with your space
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {styles.map((style, index) => (
          <div
            key={style.name}
            className="group cursor-pointer transition-all hover:scale-[1.03] hover:shadow-card"
          >
            <div
              className="rounded-large overflow-hidden"
              style={{
                aspectRatio: '4/3',
                background: style.gradient
              }}
            />
            <div className="mt-3 text-center">
              <h3 className="font-semibold text-text-primary">
                {style.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
