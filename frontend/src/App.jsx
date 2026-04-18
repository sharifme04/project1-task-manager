import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then(r => r.json())
      .then(setTasks)
      .catch(console.error)
  }, [])

  const addTask = async () => {
    if (!input.trim()) return
    setLoading(true)
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input.trim() }),
    })
    const task = await res.json()
    setTasks(prev => [...prev, task])
    setInput('')
    setLoading(false)
  }

  const toggleTask = async (id) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'PATCH' })
    const updated = await res.json()
    setTasks(prev => prev.map(t => t.id === id ? updated : t))
  }

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1>Task Manager — Project 1 (EC2)</h1>
      <p style={{ color: '#888', fontSize: 14 }}>API: {API_URL}</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="New task..."
          style={{ flex: 1, padding: '8px 12px', fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button onClick={addTask} disabled={loading}
          style={{ padding: '8px 20px', fontSize: 16, borderRadius: 6, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {loading ? '...' : 'Add'}
        </button>
      </div>
      {tasks.length === 0 && <p style={{ color: '#aaa' }}>No tasks yet. Add one above!</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
            <span style={{ flex: 1, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#aaa' : '#222' }}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}
              style={{ padding: '4px 12px', borderRadius: 4, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
