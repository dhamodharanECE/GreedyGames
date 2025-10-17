'use client'
import React from 'react'
import { useState } from 'react'
interface TodoFormProps {
  isOpen: boolean
  onClose: () => void
  editingTodoId: number | null
  onSave: (todo: {
    title: string
    description: string
    date: string
    time: string
    status: 'Upcoming' | 'Completed'
  }) => void
  initialData?: {
    title: string
    description: string
    date: string
    time: string
    status: 'Upcoming' | 'Completed'
  }
}

export default function TodoForm({ 
  isOpen, 
  onClose, 
  editingTodoId, 
  onSave,
  initialData 
}: TodoFormProps) {
    const [newTitle, setNewTitle] = useState(initialData?.title || '')
    const [newDescription, setNewDescription] = useState(initialData?.description || '')
    const [newDate, setNewDate] = useState(initialData?.date || '')
    const [newTime, setNewTime] = useState(initialData?.time || '')
    const [status, setStatus] = useState<'Upcoming' | 'Completed'>(initialData?.status || 'Upcoming')
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    // const [error, setError] = useState<string | null>(null)

    // const id = useParams()

    // useEffect(()=>{
    //       const fetechdata = async () =>{
    //         const {data, error} = await project.from('projects').select('title, description, date, time, status').eq('id', id.id).single();
    //       if(error){
    //         console.log("Something went wrong");
    //         setError("Failed to fetch todo data");
    //       }
    //       if(data){
    //         console.log(data);
    //         setNewTitle(errors.title);
    //         setNewDescription(errors.description);
    //         setNewDate(errors.date);
    //         setNewTime(errors.time);
    //         setStatus(errors.status);
    //       }
    //       fetechdata();
    //     }
        
    // }, []);

    const handleSave = () => {
        const newErrors: { [key: string]: string } = {}

        // Validate fields
        if (!newTitle.trim()) {
            newErrors.title = 'Title is required'
        }
        if (!newDescription.trim()) {
            newErrors.description = 'Description is required'
        }
        if (!newDate) {
            newErrors.date = 'Due date is required'
        }
        if (!newTime) {
            newErrors.time = 'Due time is required'
        }

        // If there are errors, set them and return
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // Clear errors and save
        setErrors({})
        onSave({
            title: newTitle,
            description: newDescription,
            date: newDate,
            time: newTime,
            status: status
        })
    }

    // Clear error when user starts typing
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setter(e.target.value)
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    if (!isOpen) return null
    
  return (
    <>
      <div className="w-96 bg-white border-l border-gray-200 p-6 fixed right-0 top-0 h-full shadow-lg z-50 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingTodoId ? 'Edit Todo' : 'Add Todo'}
              </h2>
              <button 
                className="text-gray-400 hover:text-gray-600 text-2xl" 
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title<span className='text-red-700 text-xl'>*</span></label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={handleInputChange(setNewTitle, 'title')} 
                  className={`w-full border rounded-lg p-2 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter todo title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description<span className='text-red-700 text-xl'>*</span></label>
                <textarea 
                  value={newDescription} 
                  onChange={handleInputChange(setNewDescription, 'description')} 
                  className={`w-full border rounded-lg p-2 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter todo description"
                  rows={4}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date <span className='text-red-700 text-xl'>*</span></label>
                <input 
                  type="date" 
                  value={newDate} 
                  onChange={handleInputChange(setNewDate, 'date')} 
                  className={`w-full border rounded-lg p-2 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Due Time<span className='text-red-700 text-xl'>*</span></label>
                <input 
                  type="time" 
                  value={newTime} 
                  onChange={handleInputChange(setNewTime, 'time')} 
                  className={`w-full border rounded-lg p-2 ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status<span className='text-red-700 text-xl'>*</span></label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as 'Upcoming' | 'Completed')}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleSave} 
              className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              {editingTodoId ? 'Update Todo' : '+ Add Todo'}
            </button>
          </div>
    </>
  )
}