'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Github } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '/#features' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Canvas', href: '/dashboard/canvas' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'Changelog', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Status', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Contact', href: '#' },
  ],
}

const social = [
  { name: 'Twitter', href: '#', Icon: Twitter },
  { name: 'LinkedIn', href: '#', Icon: Linkedin },
  { name: 'GitHub', href: '#', Icon: Github },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300 dark:border-dark-border">
      <div className="h-1 bg-gradient-to-r from-primary-500 via-accent-violet to-cyan-400" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 font-bold text-white">
                R
              </span>
              <span className="font-display text-xl font-bold text-white">ROOMAI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              The interior design workspace for teams who ship visuals faster than their competition — without sacrificing
              craft.
            </p>
            <div className="mt-6 flex gap-3">
              {social.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition-colors hover:border-primary-500/40 hover:text-white"
                  aria-label={name}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-white">Product</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-white">Resources</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-400 transition-colors hover:text-white">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-slate-400 transition-colors hover:text-white">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} ROOMAI. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
