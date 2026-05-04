'use client'

import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar'
import { DesignCanvas } from '@/components/canvas/DesignCanvas'

export default function CanvasPage() {
  return (
    <>
      <DashboardTopbar title="Design canvas" />
      <div className="p-4 lg:p-8">
        <DesignCanvas />
      </div>
    </>
  )
}
