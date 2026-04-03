import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, Trash, AlertCircle, Plus } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', location: '' });
  const { user } = useContext(AuthContext);

  const { title, description, location } = formData;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const res = await axios.post('/tasks', formData);
      setTasks([res.data, ...tasks]);
      setFormData({ title: '', description: '', location: '' });
    } catch (err) {
      console.error('Error adding task', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task', err);
    }
  };

  const toggleStatus = async (task) => {
    let newStatus = 'pending';
    if (task.status === 'pending') newStatus = 'in-progress';
    else if (task.status === 'in-progress') newStatus = 'completed';
    else newStatus = 'pending';

    try {
      const res = await axios.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === task._id ? res.data : t));
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle size={16} />;
    if (status === 'in-progress') return <Clock size={16} />;
    return <AlertCircle size={16} />;
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Waste Collection Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage and track your reporting assignments.</p>
      </div>

      <div className="form-container" style={{ margin: '0 0 2rem 0', maxWidth: 'none', background: 'var(--bg-card)' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} color="var(--accent-primary)"/> Report New Waste Job
        </h3>
        <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 2fr) minmax(150px, 1fr) auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>Title</label>
            <input type="text" name="title" value={title} onChange={onChange} className="form-control" placeholder="e.g. Broken bin at Elm St" required />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>Description (optional)</label>
            <input type="text" name="description" value={description} onChange={onChange} className="form-control" placeholder="Details..." />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>Location</label>
            <input type="text" name="location" value={location} onChange={onChange} className="form-control" placeholder="Address/Zone" />
          </div>
          <button type="submit" className="btn" style={{ height: '42px' }}>Submit</button>
        </form>
      </div>

      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 'var(--border-radius)' }}>
          <CheckCircle size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3>No tasks reported yet</h3>
          <p>Great job! The city is clean. Use the form above if you spot any waste.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task._id} className={`task-card task-${task.status.replace('-', '')}`}>
              <div className="task-title">{task.title}</div>
              <div className="task-desc">{task.description || 'No description provided.'}</div>
              
              <div className="task-meta">
                <span>📍 {task.location ? task.location : 'Unspecified'}</span>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>

              <div style={{ paddingLeft: '0.5rem', marginBottom: '1.5rem' }}>
                <span className={`task-status status-${task.status.replace('-', '')}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content' }}>
                  {getStatusIcon(task.status)}
                  {task.status.replace('-', ' ')}
                </span>
              </div>

              <div className="task-actions">
                <button onClick={() => toggleStatus(task)} className="btn" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                  Update Status
                </button>
                <button onClick={() => deleteTask(task._id)} className="btn btn-danger" style={{ maxWidth: '40px', padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
