import React, { useEffect, useState } from 'react';
import axios from "axios";

const TodoList = () => {
    const [tab, setTab] = useState(1);
    const [input, setInput] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleTab = (tab) => {
        setTab(tab);
    }
    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8800/get-todos");
            setTodoList(res.data);
        } catch(err) {
            console.error(err);
        }
    }

    const handleAddOrUpdateTodo = async (e) => {
        e.preventDefault();
        if(!input.trim()) return; // Prevent empty submits
        try {
            if(!isEdit) {
                await axios.post("http://localhost:8800/add-todo", {todo: input});
            } else {
                await axios.put(`http://localhost:8800/update-todo/${editId}`, {todo: input});
            }
            setIsEdit(false);
            fetchData();
            setInput("");
            setEditId(null);
        } catch(err) {
            console.error("Error adding todo:", err);
        }
    }

    useEffect(() => {
       fetchData(); 
    }, []);

    const handleEdit = (id, task) => {
        setInput(task);
        setIsEdit(true);
        setEditId(id);
    }

    const handleCancel = () => {
        setEditId(null);
        setInput("");
        setIsEdit(false);
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8800/delete-todo/${id}`);
            fetchData();
        } catch(err) {
            console.error(err);
        }
    }

    const handleComplete = async (id) => {
        try {
            await axios.put(`http://localhost:8800/complete-todo/${id}`);
            fetchData();
        } catch(err) {
            console.error(err);
        }
    }

    const filteredTodoList = todoList.filter((i) => {
        if(tab === 1) return true; // all task
        if(tab === 2) return i.status && i.status.toLowerCase() === 'active'; // active task
        if(tab === 3) return i.status && (i.status.toLowerCase() === 'completed' || i.status.toLowerCase() === 'compleated'); // Completed tab
        return true;
    })

    return (
        <div className='bg-gray-100 w-screen h-screen flex justify-center items-center'>
            <div className='bg-white rounded-xl p-6 shadow-md flex flex-col gap-5 w-[420px]'>
                <h2 className='font-bold text-center text-2xl'>Todo List</h2>
                <form onSubmit={handleAddOrUpdateTodo} className='flex gap-2 w-full'>
                    <input 
                        type='text'
                        className='flex-1 outline-none border border-blue-300 p-2 text-sm rounded-md' 
                        placeholder='Enter todo'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium cursor-pointer'
                    >
                        {!isEdit ? "Add Todo" : "Update Todo"}
                    </button>
                    {
                        isEdit && (
                            <button 
                                type='button' 
                                onClick={handleCancel} 
                                className='bg-gray-400 text-white px-3 py-2 rounded-md hover:bg-gray-500 transition text-sm font-medium cursor-pointer'
                            >
                                Cancel
                            </button>
                        )

                    }
                </form>

                <div className='flex justify-between bg-gray-100 p-1 rounded-lg text-sm font-medium text-gray-600'>
                    <button 
                        type="button"
                        className={`flex-1 py-1.5 rounded-md transition text-center cursor-pointer ${tab === 1 ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'hover:text-blue-600'}`} 
                        onClick={() => handleTab(1)}
                    >
                        All
                    </button>
                    <button 
                        type="button"
                        className={`flex-1 py-1.5 rounded-md transition text-center cursor-pointer ${tab === 2 ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'hover:text-blue-600'}`} 
                        onClick={() => handleTab(2)}
                    >
                        Active
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-1.5 rounded-md transition text-center cursor-pointer ${tab === 3 ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
                        onClick={() => handleTab(3)}
                    >
                        Completed
                    </button>
                </div>
                <div className='flex flex-col gap-3 max-h-60 overflow-y-auto'>
                    {
                        filteredTodoList.length === 0 ? (
                        <p className='text-center text-gray-400 py-4 text-sm'>No tasks found in this view.</p>
                    ) : (
                        filteredTodoList.map((i) => (
                            <div key={i.id} className='flex justify-between items-center bg-gray-50 border border-gray-200 p-3 rounded-lg w-full'>
                                <div>
                                    <p className='text-lg text-gray-700 font-semibold'>{i.task}</p>
                                    <p className='text-xs text-gray-400'>{new Date(i.created).toLocaleDateString()}</p>
                                    <p className='text-sm text-blue-600 font-medium'>Status: {i.status}</p>
                                </div>
                                <div className='flex flex-col text-sm gap-1 items-end'>
                                    <button className='text-blue-500 hover:underline cursor-pointer' onClick={() => handleEdit(i.id, i.task)}>Edit</button>
                                    <button className='text-red-500 hover:underline cursor-pointer' onClick={() => handleDelete(i.id)}>Delete</button>
                                    <button className='text-green-500 hover:underline cursor-pointer' onClick={() => handleComplete(i.id)}>Complete</button>
                                </div>
                            </div>
                        ))
                    )
                    }
                </div>

            </div>
        </div>
    )
}

export default TodoList