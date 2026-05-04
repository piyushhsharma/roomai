import { generateGradient } from '@/lib/utils'

export const mockStyles = [
  { id: 'modern', name: 'Modern', colors: ['#6366f1', '#8b5cf6', '#06b6d4'] },
  { id: 'scandinavian', name: 'Scandinavian', colors: ['#22c55e', '#34d399', '#6ee7b7'] },
  { id: 'boho', name: 'Bohemian', colors: ['#f59e0b', '#fbbf24', '#fcd34d'] },
  { id: 'industrial', name: 'Industrial', colors: ['#64748b', '#94a3b8', '#cbd5e1'] },
  { id: 'minimalist', name: 'Minimalist', colors: ['#f8fafc', '#e2e8f0', '#94a3b8'] },
  { id: 'japandi', name: 'Japandi', colors: ['#78716c', '#a8a29e', '#d6d3d1'] },
  { id: 'coastal', name: 'Coastal', colors: ['#06b6d4', '#22d3ee', '#67e8f9'] },
  { id: 'luxury', name: 'Luxury', colors: ['#8b5cf6', '#a78bfa', '#c4b5fd'] },
]

export const mockGalleryFilters = ['All', 'Living', 'Bedroom', 'Kitchen', 'Office', 'Dining'] as const

export type GalleryFilter = (typeof mockGalleryFilters)[number]

export const mockGalleryItems = [
  { id: 'g1', label: 'Nordic lounge', tag: 'Living', gradient: 'linear-gradient(135deg,#1e1b4b 0%,#6366f1 45%,#06b6d4 100%)' },
  { id: 'g2', label: 'Soft bedroom', tag: 'Bedroom', gradient: 'linear-gradient(145deg,#312e81 0%,#8b5cf6 50%,#f472b6 100%)' },
  { id: 'g3', label: 'Chef kitchen', tag: 'Kitchen', gradient: 'linear-gradient(135deg,#0f172a 0%,#22c55e 40%,#06b6d4 100%)' },
  { id: 'g4', label: 'Studio office', tag: 'Office', gradient: 'linear-gradient(160deg,#020617 0%,#6366f1 35%,#94a3b8 100%)' },
  { id: 'g5', label: 'Sunlit dining', tag: 'Dining', gradient: 'linear-gradient(135deg,#422006 0%,#f59e0b 45%,#fcd34d 100%)' },
  { id: 'g6', label: 'Spa bath', tag: 'Bedroom', gradient: 'linear-gradient(135deg,#0c4a6e 0%,#06b6d4 50%,#e0f2fe 100%)' },
  { id: 'g7', label: 'Japandi retreat', tag: 'Living', gradient: 'linear-gradient(135deg,#292524 0%,#a8a29e 50%,#e7e5e4 100%)' },
  { id: 'g8', label: 'Industrial loft', tag: 'Living', gradient: 'linear-gradient(135deg,#18181b 0%,#71717a 40%,#fafafa 100%)' },
  { id: 'g9', label: 'Pastel nook', tag: 'Bedroom', gradient: 'linear-gradient(135deg,#4c1d95 0%,#c084fc 50%,#fce7f3 100%)' },
]

export const mockUser = {
  id: 'user-1',
  name: 'Alex Chen',
  email: 'alex@example.com',
  plan: 'pro',
  credits: 48,
  initials: 'AC',
  avatarGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
}

export const mockStats = {
  totalRenders: 142,
  projects: 12,
  creditsLeft: 48,
  thisMonth: 23,
}

export const mockProjects = [
  {
    id: 'proj-1',
    name: 'Living Room Makeover',
    userId: 'user-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    renders: 8,
    thumbnail: generateGradient('proj-1'),
    style: 'modern',
  },
  {
    id: 'proj-2',
    name: 'Bedroom Redesign',
    userId: 'user-1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    renders: 5,
    thumbnail: generateGradient('proj-2'),
    style: 'scandinavian',
  },
  {
    id: 'proj-3',
    name: 'Kitchen Update',
    userId: 'user-1',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    renders: 12,
    thumbnail: generateGradient('proj-3'),
    style: 'minimalist',
  },
  {
    id: 'proj-4',
    name: 'Office Space',
    userId: 'user-1',
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2024-01-08'),
    renders: 6,
    thumbnail: generateGradient('proj-4'),
    style: 'industrial',
  },
  {
    id: 'proj-5',
    name: 'Bathroom Renovation',
    userId: 'user-1',
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-01-02'),
    renders: 4,
    thumbnail: generateGradient('proj-5'),
    style: 'luxury',
  },
  {
    id: 'proj-6',
    name: 'Guest Room',
    userId: 'user-1',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-28'),
    renders: 3,
    thumbnail: generateGradient('proj-6'),
    style: 'coastal',
  },
]

export const mockRenders = mockProjects.flatMap((p, i) => ({
  id: `render-${p.id}`,
  gradient: p.thumbnail,
  prompt: `${p.style} refresh for ${p.name.toLowerCase()}`,
  style: p.style,
  projectId: p.id,
  userId: 'user-1',
  createdAt: p.updatedAt,
  renderTime: `${(2.4 + i * 0.2).toFixed(1)}s`,
}))

export const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Interior designer',
    content:
      'ROOMAI cut my concept phase in half. Clients see photoreal options in minutes, and revisions feel effortless.',
    initials: 'SJ',
    gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    rating: 5,
  },
  {
    id: '2',
    name: 'Marcus Reed',
    role: 'Real estate creative lead',
    content:
      'Staging visuals from empty listings used to take days. Now we ship campaign-ready renders the same afternoon.',
    initials: 'MR',
    gradient: 'linear-gradient(135deg,#06b6d4,#22c55e)',
    rating: 5,
  },
  {
    id: '3',
    name: 'Elena Park',
    role: 'Homeowner',
    content:
      'We experimented with palettes we never would have tried. The before/after slider sold us on the final look instantly.',
    initials: 'EP',
    gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
    rating: 5,
  },
]

export const mockPricingPlans = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    annualPrice: 0,
    features: [
      '8 renders / month',
      'HD exports (1080p)',
      'Core style library',
      'Community support',
    ],
    cta: 'Start free',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    annualPrice: 23,
    features: [
      'Unlimited renders',
      '4K HDR exports',
      'Full style + palette control',
      'Priority AI queue',
      'Canvas versioning',
      'Email support',
    ],
    cta: 'Start Pro trial',
    popular: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 99,
    annualPrice: 79,
    features: [
      'Everything in Pro',
      'Shared workspaces',
      'Custom brand presets',
      'API & batch jobs',
      'Dedicated success manager',
      'SSO & audit logs',
    ],
    cta: 'Talk to sales',
    popular: false,
  },
]

export const mockTrustLogos = ['Northline', 'Atelier 9', 'Forma', 'Haven Co', 'Studio Lumen', 'Arcadia']

export const mockActivity = [
  { id: 'a1', title: 'Render complete — Nordic lounge', time: '2 min ago' },
  { id: 'a2', title: 'Palette updated — Primary bedroom', time: '18 min ago' },
  { id: 'a3', title: 'Project shared with client', time: '1 hr ago' },
  { id: 'a4', title: 'Style transfer — Industrial loft', time: '3 hr ago' },
]
