export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}

export function isDueSoon(dueDate: string, hours = 4): boolean {
  const now = new Date()
  const due = new Date(dueDate)
  const diff = due.getTime() - now.getTime()
  const hoursUntilDue = diff / (1000 * 60 * 60)
  return hoursUntilDue <= hours && hoursUntilDue > 0
}