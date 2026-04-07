'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type Role = 'member' | 'core' | 'admin'

type UserRow = {
  id: string
  full_name: string | null
  role: Role
}

type UserRoleTableProps = {
  users: UserRow[]
  currentUserId: string
}

const ROLE_OPTIONS: Role[] = ['member', 'core', 'admin']

type RowFeedback = {
  type: 'success' | 'error'
  message: string
}

export default function UserRoleTable({ users, currentUserId }: UserRoleTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all')
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [rowFeedbackByUserId, setRowFeedbackByUserId] = useState<Record<string, RowFeedback>>({})
  const originalRoleByUserId = useMemo(
    () => Object.fromEntries(users.map((member) => [member.id, member.role])) as Record<string, Role>,
    [users]
  )
  const [roleByUserId, setRoleByUserId] = useState<Record<string, Role>>(
    originalRoleByUserId
  )

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return users.filter((member) => {
      const name = (member.full_name || '').toLowerCase()
      const id = member.id.toLowerCase()
      const selectedRole = roleByUserId[member.id] || member.role
      const matchesTerm = !term || name.includes(term) || id.includes(term)
      const matchesRole = roleFilter === 'all' || selectedRole === roleFilter

      return matchesTerm && matchesRole
    })
  }, [users, searchTerm, roleFilter, roleByUserId])

  const updateRole = async (userId: string) => {
    const nextRole = roleByUserId[userId]
    const currentRole = originalRoleByUserId[userId]

    if (!nextRole || nextRole === currentRole) {
      return
    }

    setPendingUserId(userId)
    setRowFeedbackByUserId((prev) => {
      const next = { ...prev }
      delete next[userId]
      return next
    })

    try {
      const response = await fetch('/api/admin/users/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: nextRole }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        setRowFeedbackByUserId((prev) => ({
          ...prev,
          [userId]: {
            type: 'error',
            message: payload.error || 'Unable to update role',
          },
        }))
        return
      }

      setRowFeedbackByUserId((prev) => ({
        ...prev,
        [userId]: {
          type: 'success',
          message: 'Role updated successfully',
        },
      }))
      router.refresh()
    } catch {
      setRowFeedbackByUserId((prev) => ({
        ...prev,
        [userId]: {
          type: 'error',
          message: 'Network error while updating role',
        },
      }))
    } finally {
      setPendingUserId(null)
    }
  }

  return (
    <>
      <div className="border-b border-cyan-400/15 px-6 py-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or user id"
            className="h-10 rounded-xl border border-cyan-400/20 bg-blue-950/70 px-3 text-sm text-cyan-100 outline-none placeholder:text-blue-100/45 focus:border-cyan-300"
          />

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as 'all' | Role)}
            className="h-10 rounded-xl border border-cyan-400/20 bg-blue-950/70 px-3 text-sm capitalize text-cyan-100 outline-none focus:border-cyan-300"
          >
            <option value="all">all roles</option>
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <p className="text-sm text-blue-100/70">
            Showing {filteredUsers.length} of {users.length}
          </p>
        </div>
      </div>

      <div className="divide-y divide-cyan-400/10">
        {filteredUsers.map((member) => {
          const isCurrentUser = member.id === currentUserId
          const selectedRole = roleByUserId[member.id]
          const originalRole = originalRoleByUserId[member.id]
          const hasChanged = selectedRole !== originalRole
          const isPending = pendingUserId === member.id
          const feedback = rowFeedbackByUserId[member.id]

          return (
            <div key={member.id} className="grid gap-3 px-6 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <div>
                <p className="font-semibold text-white">{member.full_name || 'Unnamed Member'}</p>
                <p className="text-xs text-blue-100/60">{member.id}</p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 capitalize text-cyan-200">
                    current: {originalRole}
                  </span>
                  {hasChanged ? (
                    <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-0.5 text-amber-200">
                      unsaved change
                    </span>
                  ) : null}
                  {feedback ? (
                    <span className={`rounded-full px-2 py-0.5 ${feedback.type === 'success' ? 'border border-emerald-400/25 bg-emerald-500/10 text-emerald-200' : 'border border-red-400/25 bg-red-500/10 text-red-200'}`}>
                      {feedback.message}
                    </span>
                  ) : null}
                </div>
              </div>

              <select
                value={selectedRole}
                onChange={(event) => {
                  const nextRole = event.target.value as Role
                  setRoleByUserId((prev) => ({ ...prev, [member.id]: nextRole }))
                  setRowFeedbackByUserId((prev) => {
                    const next = { ...prev }
                    delete next[member.id]
                    return next
                  })
                }}
                className="h-10 rounded-xl border border-cyan-400/20 bg-blue-950/70 px-3 text-sm capitalize text-cyan-100 outline-none focus:border-cyan-300"
                disabled={isPending}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option
                    key={role}
                    value={role}
                    disabled={isCurrentUser && role !== 'admin'}
                  >
                    {role}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => updateRole(member.id)}
                disabled={isPending || !hasChanged}
                className="h-10 rounded-xl bg-linear-to-r from-cyan-400 to-sky-300 px-4 text-sm font-semibold text-[#08192F] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          )
        })}

        {!filteredUsers.length && (
          <div className="px-6 py-8 text-sm text-blue-100/75">No users found in profiles.</div>
        )}
      </div>
    </>
  )
}
