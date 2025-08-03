export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  color: 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'indigo' | 'gray'
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  name: string
  description: string
  checklist: ChecklistItem[]
  created_at: string
  updated_at: string
}

export const defaultSessions: Session[] = [
  {
    id: 'session-1',
    name: 'Module Preparation Checklist',
    description: 'Essential preparation tasks for module delivery',
    checklist: [
      {
        id: 'prep-1',
        text: 'Review module content and objectives',
        completed: false,
        color: 'blue',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'prep-2',
        text: 'Prepare presentation materials',
        completed: false,
        color: 'yellow',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'prep-3',
        text: 'Set up room and equipment',
        completed: false,
        color: 'green',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'prep-4',
        text: 'Review candidate profiles',
        completed: false,
        color: 'purple',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'session-2',
    name: 'Post-Session Follow-up',
    description: 'Tasks to complete after each session',
    checklist: [
      {
        id: 'follow-1',
        text: 'Collect feedback forms',
        completed: false,
        color: 'red',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'follow-2',
        text: 'Update candidate progress records',
        completed: false,
        color: 'blue',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'follow-3',
        text: 'Send follow-up materials to candidates',
        completed: false,
        color: 'green',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]