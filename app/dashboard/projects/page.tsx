'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/Modal'
import { formatDate } from '@/lib/utils'
import { cssBackgroundForDesign } from '@/lib/design-preview'

type Project = {
  id: string
  name: string
  description: string | null
  updatedAt: string
  designCount: number
  latestDesign: { resultUrl: string; style: string | null; isMock: boolean } | null
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/projects')
    if (!res.ok) {
      toast.error('Could not load projects')
      return
    }
    const data = await res.json()
    setProjects(data.projects ?? [])
  }, [])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  const createProject = async () => {
    if (!newName.trim()) return
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    if (!res.ok) {
      const e = await res.json().catch(() => ({}))
      toast.error(e.error || 'Failed to create')
      return
    }
    toast.success('Project created')
    setNewName('')
    setOpen(false)
    load()
  }

  const saveRename = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    })
    if (!res.ok) {
      toast.error('Could not update')
      return
    }
    toast.success('Updated')
    setEditingId(null)
    load()
  }

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete project “${name}”? This cannot be undone.`)) return
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Could not delete')
      return
    }
    toast.success('Project deleted')
    load()
  }

  return (
    <>
      <DashboardTopbar title="Projects" />
      <div className="space-y-6 p-4 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Organize room redesigns by space or client. Designs you create in the canvas can be linked here anytime.
          </p>
          <Button className="rounded-xl shadow-glow" onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New project
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : projects.length === 0 ? (
          <Card className="border-dashed border-slate-300 dark:border-dark-border">
            <CardContent className="py-12 text-center text-slate-600 dark:text-slate-400">
              <p className="mb-4">No projects yet.</p>
              <Button onClick={() => setOpen(true)} className="rounded-xl">
                Create project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="overflow-hidden border-slate-200/80 dark:border-dark-border">
                  <Link href="/dashboard/canvas">
                    <div
                      className="aspect-[16/10] w-full"
                      style={{
                        background: p.latestDesign
                          ? cssBackgroundForDesign(p.latestDesign.resultUrl, p.latestDesign.style)
                          : 'linear-gradient(135deg,#0f172a,#6366f1)',
                      }}
                    />
                  </Link>
                  <CardContent className="space-y-3 p-5">
                    {editingId === p.id ? (
                      <div className="flex gap-2">
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9" />
                        <Button size="sm" className="rounded-lg" onClick={() => saveRename(p.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{p.name}</h2>
                          <p className="mt-1 text-xs text-slate-500">
                            {p.designCount} designs · Updated {formatDate(new Date(p.updatedAt))}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-lg"
                            aria-label="Rename"
                            onClick={() => {
                              setEditingId(p.id)
                              setEditName(p.name)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-lg text-red-500 hover:text-red-600"
                            aria-label="Delete"
                            onClick={() => remove(p.id, p.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="w-full rounded-lg dark:border-dark-border" asChild>
                      <Link href="/dashboard/canvas">Open canvas</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent className="border-slate-200 dark:border-dark-border">
          <ModalHeader>
            <ModalTitle>New project</ModalTitle>
            <ModalDescription>Give your space a name you will recognize later.</ModalDescription>
          </ModalHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="pname">Name</Label>
            <Input id="pname" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Living room refresh" />
          </div>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-xl" onClick={createProject}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
