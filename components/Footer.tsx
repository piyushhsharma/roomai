export default function Footer() {
  return (
    <footer className="bg-page-bg border-t border-border">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black text-text-primary">📷</span>
            <span className="text-xl font-bold text-text-primary">RoomAI</span>
          </div>
          <div className="text-text-sub text-sm">
            © 2024 RoomAI. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-text-sub text-sm">
            <a href="#" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#" className="hover:text-text-primary transition-colors">
              Terms
            </a>
            <span>·</span>
            <a href="#" className="hover:text-text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
