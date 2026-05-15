
'use client';

import { useEffect, useState } from 'react';

import todoData from '@/data/todos.json';
import navbarData from "@/data/navbar.json"

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

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
  });

  const [filter, setFilter] = useState<
    'all' | 'active' | 'completed'
  >('all');

  const [categoryFilter, setCategoryFilter] =
    useState<string>('all');

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'Medium' as const,
  });

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editTitle, setEditTitle] =
    useState('');

  // JSON DATA
  const categories =
    navbarData.categories;

  const priorities =
    navbarData.priorities;

  // LOAD DATA
  useEffect(() => {
    const storedTodos =
      localStorage.getItem('todos');

    if (storedTodos) {
      const parsedTodos =
        JSON.parse(storedTodos);

      setTodos(parsedTodos);

      updateStats(parsedTodos);
    } else {
      const typedTodoData =
        todoData as TodoData;

      setTodos(typedTodoData.todos);

      setStats(typedTodoData.stats);
    }
  }, []);

  // SAVE DATA
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem(
        'todos',
        JSON.stringify(todos)
      );

      updateStats(todos);
    }
  }, [todos]);

  // UPDATE STATS
  const updateStats = (
    updatedTodos: Todo[]
  ) => {
    const totalTasks =
      updatedTodos.length;

    const completedTasks =
      updatedTodos.filter(
        (todo) => todo.completed
      ).length;

    const pendingTasks =
      totalTasks - completedTasks;

    const completionRate =
      totalTasks > 0
        ? Math.round(
            (completedTasks /
              totalTasks) *
              100
          )
        : 0;

    setStats({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
    });
  };

  // ADD TODO
  const addTodo = () => {
    if (!newTodo.title.trim())
      return;

    const todo: Todo = {
      id: Date.now(),

      title: newTodo.title,

      description:
        newTodo.description,

      category: newTodo.category,

      priority: newTodo.priority,

      completed: false,

      createdAt:
        new Date().toISOString(),

      dueDate: new Date(
        Date.now() +
          7 *
            24 *
            60 *
            60 *
            1000
      ).toISOString(),
    };

    setTodos([todo, ...todos]);

    setNewTodo({
      title: '',
      description: '',
      category: 'Work',
      priority: 'Medium',
    });
  };

  // TOGGLE TODO
  const toggleTodo = (
    id: number
  ) => {
    const updatedTodos = todos.map(
      (todo) =>
        todo.id === id
          ? {
              ...todo,
              completed:
                !todo.completed,
            }
          : todo
    );

    setTodos(updatedTodos);
  };

  // DELETE TODO
  const deleteTodo = (
    id: number
  ) => {
    const updatedTodos =
      todos.filter(
        (todo) => todo.id !== id
      );

    setTodos(updatedTodos);
  };

  // EDIT TODO
  const editTodo = (id: number) => {
    const updatedTodos = todos.map(
      (todo) =>
        todo.id === id
          ? {
              ...todo,
              title: editTitle,
            }
          : todo
    );

    setTodos(updatedTodos);

    setEditingId(null);

    setEditTitle('');
  };

  // COLORS
  const getPriorityColor = (
    priority: string
  ) => {
    const colors = {
      High:
        'bg-red-100 text-red-700 border-red-200',

      Medium:
        'bg-yellow-100 text-yellow-700 border-yellow-200',

      Low:
        'bg-green-100 text-green-700 border-green-200',
    };

    return colors[
      priority as keyof typeof colors
    ];
  };

  const getCategoryColor = (
    category: string
  ) => {
    const colors: Record<
      string,
      string
    > = {
      Work:
        'bg-blue-100 text-blue-700',

      Personal:
        'bg-green-100 text-green-700',

      Learning:
        'bg-purple-100 text-purple-700',

      Health:
        'bg-red-100 text-red-700',

      Finance:
        'bg-yellow-100 text-yellow-700',
    };

    return (
      colors[category] ||
      'bg-gray-100 text-gray-700'
    );
  };

  // FILTER TODOS
  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'active')
        return !todo.completed;

      if (
        filter === 'completed'
      )
        return todo.completed;

      return true;
    })
    .filter((todo) => {
      if (
        categoryFilter === 'all'
      )
        return true;

      return (
        todo.category ===
        categoryFilter
      );
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {navbarData.logo.icon}{' '}
          {navbarData.logo.text}
        </h1>

        <div className="flex gap-4">
          {navbarData.navLinks.map(
            (link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-blue-600 font-medium hover:underline"
              >
                {link.icon}{' '}
                {link.label}
              </a>
            )
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 rounded-2xl p-6 text-white">
          <div className="text-3xl font-bold">
            {stats.totalTasks}
          </div>

          <div>Total Tasks</div>
        </div>

        <div className="bg-green-500 rounded-2xl p-6 text-white">
          <div className="text-3xl font-bold">
            {stats.completedTasks}
          </div>

          <div>Completed</div>
        </div>

        <div className="bg-yellow-500 rounded-2xl p-6 text-white">
          <div className="text-3xl font-bold">
            {stats.pendingTasks}
          </div>

          <div>Pending</div>
        </div>

        <div className="bg-purple-500 rounded-2xl p-6 text-white">
          <div className="text-3xl font-bold">
            {
              stats.completionRate
            }
            %
          </div>

          <div>
            Completion Rate
          </div>
        </div>
      </div>

      {/* ADD TODO */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Add New Task
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Task title"
            value={newTodo.title}
            onChange={(e) =>
              setNewTodo({
                ...newTodo,
                title:
                  e.target.value,
              })
            }
            className="px-4 py-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Description"
            value={
              newTodo.description
            }
            onChange={(e) =>
              setNewTodo({
                ...newTodo,
                description:
                  e.target.value,
              })
            }
            className="px-4 py-2 border rounded-lg"
          />

          <select
            value={newTodo.category}
            onChange={(e) =>
              setNewTodo({
                ...newTodo,
                category:
                  e.target.value,
              })
            }
            className="px-4 py-2 border rounded-lg"
          >
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))}
          </select>

          <select
            value={newTodo.priority}
            onChange={(e) =>
              setNewTodo({
                ...newTodo,
                priority:
                  e.target
                    .value as any,
              })
            }
            className="px-4 py-2 border rounded-lg"
          >
            {priorities.map(
              (priority) => (
                <option
                  key={priority}
                  value={priority}
                >
                  {priority}
                </option>
              )
            )}
          </select>
        </div>

        <button
          onClick={addTodo}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
        >
          + Add Task
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() =>
            setFilter('all')
          }
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          All
        </button>

        <button
          onClick={() =>
            setFilter('active')
          }
          className={`px-4 py-2 rounded-lg ${
            filter === 'active'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Active
        </button>

        <button
          onClick={() =>
            setFilter(
              'completed'
            )
          }
          className={`px-4 py-2 rounded-lg ${
            filter ===
            'completed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Completed
        </button>

        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(
              e.target.value
            )
          }
          className="px-4 py-2 border rounded-lg ml-auto"
        >
          <option value="all">
            All Categories
          </option>

          {categories.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* TODO LIST */}
      <div className="space-y-4">
        {filteredTodos.map(
          (todo) => (
            <div
              key={todo.id}
              className="bg-white rounded-xl shadow-md p-5"
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={
                    todo.completed
                  }
                  onChange={() =>
                    toggleTodo(
                      todo.id
                    )
                  }
                  className="mt-1 w-5 h-5"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {editingId ===
                    todo.id ? (
                      <div className="flex gap-2">
                        <input
                          value={
                            editTitle
                          }
                          onChange={(
                            e
                          ) =>
                            setEditTitle(
                              e.target
                                .value
                            )
                          }
                          className="border px-2 py-1 rounded"
                        />

                        <button
                          onClick={() =>
                            editTodo(
                              todo.id
                            )
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <h3
                        className={`text-lg font-semibold ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}
                      >
                        {
                          todo.title
                        }
                      </h3>
                    )}

                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                        todo.priority
                      )}`}
                    >
                      {
                        todo.priority
                      }
                    </span>

                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                        todo.category
                      )}`}
                    >
                      {
                        todo.category
                      }
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-2">
                    {
                      todo.description
                    }
                  </p>

                  <div className="text-xs text-gray-500">
                    📅 Due:{' '}
                    {new Date(
                      todo.dueDate
                    ).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(
                        todo.id
                      );

                      setEditTitle(
                        todo.title
                      );
                    }}
                    className="text-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteTodo(
                        todo.id
                      )
                    }
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {filteredTodos.length ===
          0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-6xl mb-4">
              🎯
            </div>

            <h3 className="text-xl font-semibold text-gray-700">
              No tasks found
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
