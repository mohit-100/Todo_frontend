'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  createdAt: string;
  dueDate: string;
}

interface Stats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}

interface TodoData {
  todos: Todo[];
  stats: Stats;
}

// Import with proper typing
import todoData from '@/data/todos.json';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<Stats>({ totalTasks: 0, completedTasks: 0, pendingTasks: 0, completionRate: 0 });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [newTodo, setNewTodo] = useState({ title: '', description: '', category: 'Work', priority: 'Medium' as const });

  useEffect(() => {
    // Type assertion to tell TypeScript the shape of the data
    const typedTodoData = todoData as TodoData;
    setTodos(typedTodoData.todos);
    setStats(typedTodoData.stats);
  }, []);

  const categories = ['Work', 'Personal', 'Learning', 'Health', 'Finance'];
  const priorities = ['High', 'Medium', 'Low'];

  const getPriorityColor = (priority: string) => {
    const colors = {
      High: 'bg-red-100 text-red-700 border-red-200',
      Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Low: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[priority as keyof typeof colors];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Work: 'bg-blue-100 text-blue-700',
      Personal: 'bg-green-100 text-green-700',
      Learning: 'bg-purple-100 text-purple-700',
      Health: 'bg-red-100 text-red-700',
      Finance: 'bg-yellow-100 text-yellow-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const addTodo = () => {
    if (!newTodo.title.trim()) return;
    
    const todo: Todo = {
      id: Date.now(),
      title: newTodo.title,
      description: newTodo.description,
      category: newTodo.category,
      priority: newTodo.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    setTodos([todo, ...todos]);
    setNewTodo({ title: '', description: '', category: 'Work', priority: 'Medium' });
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    updateStats(updatedTodos);
  };

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    updateStats(updatedTodos);
  };

  const updateStats = (updatedTodos: Todo[]) => {
    const totalTasks = updatedTodos.length;
    const completedTasks = updatedTodos.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    setStats({ totalTasks, completedTasks, pendingTasks, completionRate });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  }).filter(todo => {
    if (categoryFilter === 'all') return true;
    return todo.category === categoryFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.totalTasks}</div>
          <div className="text-sm opacity-90">Total Tasks</div>
        </div>
        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.completedTasks}</div>
          <div className="text-sm opacity-90">Completed</div>
        </div>
        <div className="bg-linear-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.pendingTasks}</div>
          <div className="text-sm opacity-90">Pending</div>
        </div>
        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.completionRate}%</div>
          <div className="text-sm opacity-90">Completion Rate</div>
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Task</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Task title"
          
              autoComplete="new-password"

            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
        
          autoComplete="new-password"

            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newTodo.category}
            onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={newTodo.priority}
            onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorities.map(pri => (
              <option key={pri} value={pri}>{pri}</option>
            ))}
          </select>
        </div>
        <button
          onClick={addTodo}
          className="mt-4 px-6 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          + Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-all ${
            filter === 'all' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg transition-all ${
            filter === 'active' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg transition-all ${
            filter === 'completed' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-auto"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`bg-white rounded-xl shadow-md p-5 transition-all hover:shadow-lg ${
              todo.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
              />
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className={`text-lg font-semibold ${
                    todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}>
                    {todo.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(todo.priority)}`}>
                    {todo.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(todo.category)}`}>
                    {todo.category}
                  </span>
                </div>
                
                {todo.description && (
                  <p className="text-gray-600 text-sm mb-2">{todo.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>📅 Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                  <span>🕒 Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        
        {filteredTodos.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
            <p className="text-gray-500">Create a new task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}