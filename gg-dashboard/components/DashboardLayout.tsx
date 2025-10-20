'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '../supabase/client'
import Image1 from '../public/photo.jpeg'
import Image2 from '../public/notif.jpeg'
import profile from '../public/profile.jpg'
import down from '../public/down.png'
import Vetor from '../public/Vector.png'
import pen from '../public/pen.png'
import del from '../public/del.jpg'
import box from '../public/box.png'
import userdata from '../public/user.png'
import list from '../public/list.png'
import close from '../public/close.png'
import searchIcon from '../public/searchIcon.jpeg' // Add search icon import
import Notifications from './Notifications'
import ProfileForm from './ProfileForm'
import TodoForm from './TodoForm'
import { project } from '../src/app/lib/project/project'

// Define proper TypeScript interfaces
interface User {
  id: string
  email: string
  user_metadata?: {
    name?: string
  }
}

interface Todo {
  id: number
  title: string
  description: string
  date: string
  status: 'Upcoming' | 'Completed'
}

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [todos, setTodos] = useState<Todo[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  const [addTodoOpen, setAddTodoOpen] = useState(false)
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newStatus, setNewStatus] = useState<'Upcoming' | 'Completed'>('Upcoming')

  const [filterMode, setFilterMode] = useState<'all' | 'upcoming-first' | 'completed-first'>('all')
  const [searchQuery, setSearchQuery] = useState('') // Add search query state

  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const profilesRef = useRef<HTMLDivElement | null>(null)
  const originalTodosRef = useRef<Todo[]>([])

  // Sample Todos - moved inside component to avoid dependency issue
  const [sampleTodos, setSampleTodos] = useState<Todo[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  console.log(loadingProjects);
  console.log(fetchError);
  useEffect(() =>{
    const fetchData = async () => {
      setLoadingProjects(true);
      const { data, error } = await project()
      .from('projects')
      .select('*');
      
      if(error){
        setFetchError("Could not fetch data from the server.");
        setSampleTodos([]);
        console.log("Error fetching projects:", error);
      }

      if(data){
        setSampleTodos(data);
        setFetchError(null);
        console.log("Fetched projects:", data);
      }
      setLoadingProjects(false);
    }
    fetchData();
  }, [])

  const closeMenu = () => setMenuOpen(false)  

  // Check user authentication
  const checkUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.replace('/login')
      else setUser(session.user as User)
    } catch {
      router.replace('/login')
    } finally {
      setLoading(false)
    }
  }, [supabase.auth, router])

  // Lifecycle
  useEffect(() => {
    checkUser()
    setTodos(sampleTodos)
    originalTodosRef.current = sampleTodos
  }, [checkUser, sampleTodos])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false)
      if (profilesRef.current && !profilesRef.current.contains(event.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.replace('/login')
    } catch (error: unknown) {
      console.error('Sign out error:', error)
    }
  }

  // Sidebar toggle
  const toggleSidebar = () => setIsOpen(!isOpen)
  const toggleMenu = () => { setMenuOpen(!menuOpen); setNotifOpen(false) }
  const toggleNotif = () => { setNotifOpen(!notifOpen); setMenuOpen(false) }

  // Search function
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      // If search is empty, show all todos
      handleFilter() // Apply current filter
      return
    }

    const filtered = originalTodosRef.current.filter(todo =>
      todo.title.toLowerCase().includes(query.toLowerCase()) ||
      todo.description.toLowerCase().includes(query.toLowerCase())
    )
    
    // Apply current filter mode to search results
    if (filterMode !== 'all') {
      const orderUpcomingFirst: Record<string, number> = { Upcoming: 1, Completed: 2 }
      const orderCompletedFirst: Record<string, number> = { Completed: 1, Upcoming: 2 }
      const orderMap = filterMode === 'upcoming-first' ? orderUpcomingFirst : orderCompletedFirst

      const sorted = filtered.sort((a, b) => {
        const aOrder = orderMap[a.status] ?? 99
        const bOrder = orderMap[b.status] ?? 99
        if (aOrder === bOrder) {
          const ai = originalTodosRef.current.indexOf(a)
          const bi = originalTodosRef.current.indexOf(b)
          return ai - bi
        }
        return aOrder - bOrder
      })
      setTodos(sorted)
    } else {
      setTodos(filtered)
    }
  }

  // Filter Todos
  const handleFilter = () => {
    const nextMode =
      filterMode === 'all' ? 'upcoming-first' :
      filterMode === 'upcoming-first' ? 'completed-first' : 'all'
    setFilterMode(nextMode)

    let todosToFilter = originalTodosRef.current
    
    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      todosToFilter = originalTodosRef.current.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (nextMode === 'all') { 
      setTodos([...todosToFilter]); 
      return 
    }

    const orderUpcomingFirst: Record<string, number> = { Upcoming: 1, Completed: 2 }
    const orderCompletedFirst: Record<string, number> = { Completed: 1, Upcoming: 2 }
    const orderMap = nextMode === 'upcoming-first' ? orderUpcomingFirst : orderCompletedFirst

    const sorted = [...todosToFilter].sort((a, b) => {
      const aOrder = orderMap[a.status] ?? 99
      const bOrder = orderMap[b.status] ?? 99
      if (aOrder === bOrder) {
        const ai = originalTodosRef.current.indexOf(a)
        const bi = originalTodosRef.current.indexOf(b)
        return ai - bi
      }
      return aOrder - bOrder
    })
    setTodos(sorted)
  }

  // Add or Update Todo
  const handleAddUpdateTodo = (todoData: {
    title: string
    description: string
    date: string
    time: string
    status: 'Upcoming' | 'Completed'
  }) => {
    const dateTime = `${todoData.date} ${todoData.time}`
    if (editingTodoId) {
      const updatedTodos = todos.map(t => t.id === editingTodoId ? { 
        ...t, 
        title: todoData.title, 
        description: todoData.description, 
        date: dateTime,
        status: todoData.status
      } : t)
      setTodos(updatedTodos)
      originalTodosRef.current = originalTodosRef.current.map(t => t.id === editingTodoId ? { 
        ...t, 
        title: todoData.title, 
        description: todoData.description, 
        date: dateTime,
        status: todoData.status
      } : t)
    } else {
      const newTodo: Todo = { 
        id: Date.now(), 
        title: todoData.title, 
        description: todoData.description, 
        date: dateTime, 
        status: todoData.status
      }
      const updatedTodos = [...todos, newTodo]
      const updatedOriginalTodos = [...originalTodosRef.current, newTodo]
      setTodos(updatedTodos)
      originalTodosRef.current = updatedOriginalTodos
    }
    setAddTodoOpen(false)
    setEditingTodoId(null)
    setNewTitle(''); setNewDescription(''); setNewDate(''); setNewTime(''); setNewStatus('Upcoming')
  }

  // Edit Todo
  const handleEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id)
    setNewTitle(todo.title)
    setNewDescription(todo.description)
    setNewStatus(todo.status)
    const [datePart, timePart] = todo.date.split(' ')
    setNewDate(datePart)
    setNewTime(timePart)
    setAddTodoOpen(true)
  }

  // Delete Todo
  const handleDeleteTodo = (id: number) => {
    const updatedTodos = todos.filter(t => t.id !== id)
    const updatedOriginalTodos = originalTodosRef.current.filter(t => t.id !== id)
    setTodos(updatedTodos)
    originalTodosRef.current = updatedOriginalTodos
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      Loading...
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans scroll-m-4">
      {/* Left Sidebar */}
      {isOpen && (
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-lg font-extrabold text-gray-800">GREEDYGAME</h1>
            <button onClick={toggleSidebar} className="cursor-pointer">
              <Image src={close} alt="close" width={25} height={25} />
            </button>
          </div>
          <nav className="space-y-4">
            <a href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-green-100 rounded-lg font-medium">
              <Image src={box} alt="Dashboard" width={20} height={20} />
              Dashboard
            </a>
            <button onClick={toggleNotif} className="w-full text-left">
              <a href="#" className="flex items-center gap-2 p-2 hover:bg-green-100 rounded-lg text-gray-700">
                <Image src={userdata} alt="Notifications" width={20} height={20} />
                Notifications
              </a>
            </button>
            <button 
              onClick={() => { setAddTodoOpen(true); setEditingTodoId(null) }} 
              className="w-full text-left"
            >
              <a href="#" className="flex items-center gap-2 p-2 hover:bg-green-100 rounded-lg text-gray-700">
                <Image src={list} alt="To do list" width={25} height={25} />
                To do list
              </a>
            </button>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow p-4 flex justify-between items-center mb-6">
          <div className="flex items-center space-x-10">
            {!isOpen && (
              <button onClick={toggleSidebar}>
                <h1 className="text-lg font-extrabold text-gray-800">GREEDYGAME</h1>
              </button>
            )}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search todos..." 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
              />
              <Image 
                src={searchIcon} 
                alt="Search" 
                width={16} 
                height={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={toggleNotif} className="cursor-pointer">
              <Image 
                src={Image2} 
                alt="notif" 
                width={40} 
                height={40} 
                className="rounded-full border border-gray-300"
              />
            </button>
            <Image 
              src={Image1} 
              alt="user" 
              width={40} 
              height={40} 
              className="rounded-full border-4 border-gray-300"
            />
            <div className="relative" ref={profileRef}>
              <button onClick={toggleMenu} className="focus:outline-none">
                <Image src={down} alt="menu" width={20} height={20} />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div
                    onClick={() => {
                      closeMenu()
                      setProfileOpen(true)
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer border-b"
                  >
                    <Image src={profile} alt="profile" width={20} height={20} />
                    <span>Profile</span>
                  </div>

                  <div
                    onClick={() => {
                      closeMenu()
                      handleSignOut()
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <Image src={Vetor} alt="logout" width={20} height={20} />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
            {/* Render ProfileForm separately */}
            {profileOpen && <ProfileForm isOpen={profileOpen} onClose={() => setProfileOpen(false)} user={user} />}
          </div>
        </header>

        {/* Welcome */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Hello, {user?.user_metadata?.name || 'User'}</h2>
          <p className="text-sm text-gray-500">
            Last Login: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-gray-500 text-sm">All Todos</h3>
            <p className="text-3xl font-bold mt-2">{todos.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-gray-500 text-sm">Upcoming</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-500">
              {todos.filter(t => t.status === 'Upcoming').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h3 className="text-gray-500 text-sm">Completed</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {todos.filter(t => t.status === 'Completed').length}
            </p>
          </div>
        </div>

        {/* Todo Table */}
        <section className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">All Todos</h3>
              <p className="text-sm text-gray-500">
                Last Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {new Date().toLocaleDateString()}
              </p>
              {searchQuery && todos.length > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  Showing {todos.length} result{todos.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={handleFilter} 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg"
              >
                Filter {filterMode !== 'all' && `(${filterMode})`}
              </button>
              <button 
                onClick={() => { setAddTodoOpen(true); setEditingTodoId(null) }} 
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                + Add Todo
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="py-3 px-4 font-medium">Todo</th>
                  <th className="py-3 px-4 font-medium">Due Date</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      {searchQuery ? 'No todos found matching your search.' : 'No todos available.'}
                    </td>
                  </tr>
                ) : (
                  todos.map(todo => (
                    <tr key={todo.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold">{todo.title}</div>
                        <p className="text-xs text-gray-500">{todo.description}</p>
                      </td>
                      <td className="py-3 px-4">{todo.date}</td>
                      <td className="py-3 px-4">
                        <span className={`${todo.status==='Completed'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'} text-xs px-2 py-1 rounded-full`}>
                          {todo.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex space-x-3">
                        <button 
                          className="text-purple-500 hover:text-purple-700" 
                          onClick={() => handleEditTodo(todo)}
                        >
                          <Image src={pen} alt="edit" width={16} height={16} />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          <Image src={del} alt="delete" width={16} height={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add/Edit Todo Sidebar */}
        {addTodoOpen && (
          <TodoForm 
            isOpen={addTodoOpen} 
            onClose={() => setAddTodoOpen(false)} 
            onSave={handleAddUpdateTodo} 
            editingTodoId={editingTodoId} 
            initialData={
              editingTodoId ? {
                title: newTitle,
                description: newDescription,
                date: newDate,
                time: newTime,
                status: newStatus
              } : undefined
            }
          />
        )}
      </main>
      {notifOpen && <Notifications/>}
    </div>
  )
}