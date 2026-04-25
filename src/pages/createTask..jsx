import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useSidebar } from "../hooks/useSidebar";
import { useState } from "react";
import Back from './styles/assets/back-svgrepo-com.svg';
import { Link, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import Low from './styles/assets/lowflag-svgrepo-com.svg';
import Medium from './styles/assets/mediumflag-svgrepo-com.svg';
import High from './styles/assets/highflag-svgrepo-com.svg';
import Critical from './styles/assets/criticalflag-svgrepo-com.svg';


/* 
TODOS:
    - Hoverable and can select the categories
    - title, description, duedate, category can be saved and used for taskEnty
    - decide whether to stick with the current setPriority or remake it
*/

function CreateTask(){
    const { isOpen, openSidebar, closeSidebar } = useSidebar();
    const [startDate, setStartDate] = useState(new Date());
    const [priority, SetPriority] = useState('low');

    const [tasks, setTasks] = useState([]); // temporary in storing the tasks

    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;
    const day = startDate.getDate();
    //const formattedDateKey = `${year}-${month}-${day}`; // commented to not conflict with the formatDate.
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // inorder to use the navigate function

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year:'numeric',
            month:'numeric',
            day:'numeric'
        });
    }

    /* Sample entry for task 
    const taskEntryDescription = {
        id: Date.now(),
        title: '',
        description: '',
        category: '',
        isComplete: false,
    }
    */
   
    const validateForm = () => {
        const newErrors = {};

        if(!title.trim()){
            newErrors.title = 'Title is required';
        }

        if(!selectedCategory) {
            newErrors.category = 'Please select a category';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    {/* handles the create task */}
    const handleCreateTask = () => {
        if(!validateForm()){
            return;
        }

        const newTask = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim() || '', // optional field
            dueDate: formatDate(startDate),
            priority: priority,
            category: selectedCategory,
            isComplete: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        }

        // TEST {console.log(newTask.title, newTask.description, newTask.dueDate, newTask.createdAt, newTask.category)}

        /* Temporary to see if tasks is stored
        setTasks([...tasks, newTask]);
        console.log(newTask); 
        */

        // Store the task in local storage
        const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        localStorage.setItem('tasks', JSON.stringify([...existingTasks, newTask]));
        
       navigate('/tasklist');
    };

    {/* Categories */}
    const categories = [
        {id: 'work', label: 'Work', color: 'bg-[#4C6DF0]'},
        {id: 'personal', label: 'Personal', color: 'bg-[#5FF652]'},
        {id: 'health', label: 'Health', color: 'bg-[#AC2DCC]'},
        {id: 'study', label: 'Study', color: 'bg-[#FF8710]'},
        {id: 'finance', label: 'Finance', color: 'bg-[#FF02A2]'},
        {id: 'events', label: 'Events', color: 'bg-[#FFE204]'},
    ]



    return(
        <div className="p-0 m-0">
            <Sidebar isOpen={isOpen} onClose={closeSidebar}/> 
            
            <Header onOpenSidebar={openSidebar}/> 

            <div className="main-container h-screen pt-23 px-5">
                <div className="header flex items-center">
                    <div className="back border border-[#097204] rounded-xl shadow-md p-3">
                        <Link to={'/tasklist'}>
                            <img src={Back} alt="back_svg" className="h-10" />
                        </Link>
                    </div>
                    <h1 className="text-3xl ml-5 font-bold">New Task</h1>
                </div>

                <div className="title-enter mt-5">
                    <h1 className={`text-2xl font-bold text-gray-900 mb-3`}>
                        Title
                    </h1>
                    <input 
                        type="text" 
                        placeholder="Enter task Title" 
                        className={`bg-gray-100 text-xl w-full py-5 px-8 outline-none border ${errors.title ? 'border-red-600' : 'border-gray-600'}  rounded-4xl`}
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setErrors(prev => ({...prev, title: undefined})); // Clears the red borders on type
                        }}  
                    />
                        
                </div>

                <div className="description-enter mt-5">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Description</h1>
                    <textarea 
                        id="description-key"
                        placeholder="Enter task description (optional)"
                        rows='3'
                        className="bg-gray-100 text-xl w-full py-5 px-8 outline-none border border-gray-600 rounded-4xl"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    >   
                    </textarea>
                </div>

                <div className="due-date w-full mt-5">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Due Date</h1>
                    <div className="text-2xl px-8 py-5 items-center w-full border border-gray-600 rounded-4xl bg-gray-100">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            className="outline-none"
                        />
                      
                    </div>
                </div>

                <div className="priority mt-5">
                    <h1>SetPriority (Optional)</h1>
                    <select 
                        id="priority" 
                        value={priority} 
                        className="bg-gray-100 text-xl w-full py-5 px-8 border border-gray-600 rounded-4xl appearance-none cursor-pointer"
                        onChange={(e) => SetPriority(e.target.value)}
                    >   
                        <option value="low" className="text-xs p-0">Low</option>
                        <option value="medium" className="text-xs p-0">Medium</option>
                        <option value="high" className="text-xs p-0">High</option>
                        <option value="critical" className="text-xs p-0">Critical</option>
                    </select>
                </div>

               
                <div className={`grid-container grid grid-cols-3 mt-5 gap-3 ${errors.category ? 'border-2 border-red-600 rounded-xl' : ''}`}>

                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`hover:ring-green-700 hover:ring-2 ${selectedCategory === category.id ? 'ring-green-700 ring-2 border-none' : ''} hover:cursor-pointer hover:border-none w-full items-center flex flex-col justify-center border border-gray-600 rounded-xl p-5`}
                            onClick={() => {
                                setSelectedCategory(category.id);
                                setErrors(prev => ({...prev, category: undefined})); // clears error upon clicking
                            }}
                        >
                            <div className={`${category.color} rounded-full w-10 h-10`}></div>
                            <h1 className="text-xl mt-7">{category.label}</h1>
                        </button>
                    ))}
                    
                   
                </div>

                <div className="pb-10 mt-10">
                    <button 
                        className="hover:cursor-pointer border-none bg-gray-900 text-white text-3xl font-bold text-center p-3 w-full rounded-3xl"
                        onClick={handleCreateTask}
                    >
                        Create Task
                    </button>
                </div>
                
                
                
            </div>
        </div>

    )
}

export default CreateTask