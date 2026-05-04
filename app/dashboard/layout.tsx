import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { MobileDock } from '@/components/dashboard/MobileDock'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-roomai-light pb-20 dark:bg-dark-bg lg:pb-0">
      <DashboardSidebar />
      <div className="lg:pl-64">{children}</div>
      <MobileDock />
    </div>
  )
}

