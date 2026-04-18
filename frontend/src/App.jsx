import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || '/api'

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

  const completedCount = tasks.filter(t => t.done).length

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>📋 Task Manager</h1>
          <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: 14 }}>
            AWS EC2 + Nginx + PM2
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          padding: '20px 30px',
          backgroundColor: '#f8f9fa',
          gap: 15
        }}>
          <div style={{ flex: 1, textAlign: 'center', background: 'white', padding: '12px', borderRadius: 12 }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#667eea' }}>{tasks.length}</div>
            <div style={{ fontSize: 12, color: '#666' }}>Total</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', background: 'white', padding: '12px', borderRadius: 12 }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#28a745' }}>{completedCount}</div>
            <div style={{ fontSize: 12, color: '#666' }}>Completed</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', background: 'white', padding: '12px', borderRadius: 12 }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ffc107' }}>{tasks.length - completedCount}</div>
            <div style={{ fontSize: 12, color: '#666' }}>Pending</div>
          </div>
        </div>

        {/* Add Task */}
        <div style={{ padding: '30px' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="What needs to be done?"
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: 16,
                border: '2px solid #e0e0e0',
                borderRadius: 12,
                outline: 'none'
              }}
            />
            <button
              onClick={addTask}
              disabled={loading}
              style={{
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '...' : 'Add'}
            </button>
          </div>
        </div>

        {/* Task List */}
        <div style={{ padding: '0 30px 30px 30px' }}>
          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
              ✨ No tasks yet. Add one above!
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px',
                  marginBottom: 8,
                  background: task.done ? '#f8f9fa' : 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: 12
                }}
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  style={{ width: 20, height: 20, cursor: 'pointer' }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: task.done ? 'line-through' : 'none',
                    color: task.done ? '#999' : '#333',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    padding: '6px 16px',
                    background: '#fee',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '15px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          fontSize: 11,
          color: '#888',
          borderTop: '1px solid #e0e0e0'
        }}>
          🚀 Deployed on AWS EC2 | CI/CD with GitHub Actions
        </div>
      </div>
    </div>
  )
}