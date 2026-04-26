import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useSidebar } from "../hooks/useSidebar";
import { useState } from "react";
import AddIcon from './styles/assets/add-svgrepo-com.svg';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { isOverdue } from '../hooks/checkOverdue';
import { useTasks } from "../context/TaskContext";
import LowPriority from './styles/assets/lowflag-svgrepo-com.svg';
import MediumPriority from './styles/assets/mediumflag-svgrepo-com.svg';
import HighPriority from './styles/assets/highflag-svgrepo-com.svg';
import CriticalPriority from './styles/assets/criticalflag-svgrepo-com.svg';
import Trash from './styles/assets/trash-blank-alt-svgrepo-com.svg';
import { useNavigate } from "react-router-dom";

// use navigate

function TaskEntry({ 
    title, 
    description, 
    dueDate, 
    onDelete, 
    isComplete, 
    onToggleComplete, 
    category, 
    priority, 
    isOverdue, 
    onEdit}){    
    
   

    const categoryColor = {
        work: 'bg-[#4C6DF0]',
        personal: 'bg-[#5FF652]',
        health: 'bg-[#AC2DCC]',
        study: 'bg-[#FF8710]',
        finance: 'bg-[#FF02A2]',
        events: 'bg-[#FFE204]' 
    }

    const priorityFlag = {
        low: LowPriority,
        medium:  MediumPriority,
        high: HighPriority,
        critical: CriticalPriority
    };

    return(
        <div className={`flex min-h-50 duration-200 ${isComplete ? 'bg-gray-600' : isOverdue ? 'bg-[#FF3538]' : categoryColor[category]}  rounded-xl shadow-xl mb-5`}> 
            <div className={`bg-gray-100 w-full ml-3 rounded-xl`}>
                
                <div className="flex items-start gap-3 mb-1 p-6">
                    <div className="mt-1 items-center bg-gray-700 flex justify-center accent-gray-700 outline-none text-white rounded p-1 text-xs">
                        <input 
                            type="checkbox"
                            checked={isComplete}
                            onChange={onToggleComplete}
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 ">{title}</h2>
                        <p className="text-gray-600 text-xl">{description}</p>
                        <div className={`inline-block bg-gray-300 text-gray-600 text-sm p-2 mt-2 rounded-full items-center`}>
                            <p className={`${isOverdue ? 'font-semibold text-red-600' : ''}`}>{isOverdue ? 'Overdue: ' : 'Due: '}{dueDate}</p>
                        </div>

                        {/* Add icons for these */}
                        <div className={`flex justify-center items-center gap-5 text-xl text-gray-400  mt-5`}>
                            <span>Notes</span>
                            <span onClick={onEdit} className="hover:cursor-pointer" >Edit</span>
                            <img src={Trash} alt="tash_svg" onClick={onDelete} className="h-8 w-8 hover:cursor-pointer"/>
                            <img src={priorityFlag[priority]} alt="priorityflag_svg" className="w-8 h-8"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}





function TaskList(){
    
    // use to navigate
    const navigate = useNavigate();

    const { isOpen, openSidebar, closeSidebar } = useSidebar();
    const [ isClicked, setIsClicked ] = useState('All');

    const { tasks, deleteTask, toggleTaskComplete } = useTasks();
    {/* Handles the event click for the filter */}
    const handleClick = (buttonId) =>{
        setIsClicked(buttonId);
    }

    /* Test Dummy task creator 
    const addTask = () => {
        const newTask = {
            id: Date.now(),
            title: `New Task ${tasks.length + 1}`,
            description: "Task Description",
            dueDate: "Feb 27, 2026",
            isComplete: false
        }
        setTasks([...tasks, newTask]);
    };
    */

    {/* Gets the total tasks, Active Tasks, and Completed Tasks respectively*/}
    const totalTaskCount = tasks.length;
    const totalActiveTaskCount = tasks.filter(task => !task.isComplete).length;
    const totalCompletedTaskCount = tasks.filter(task => task.isComplete).length;


    {/* Filters the tasks */}

    const getFilteredTasks = () => {
        if(isClicked == 'Active'){
            return tasks.filter(task => !task.isComplete);
        }
        if(isClicked == 'Done'){
            return tasks.filter(task => task.isComplete)
        }
        return tasks;
    }

    {/* Loads the filtered tasks */}
    const filteredTasks = getFilteredTasks();

    
    const handleEdit = (task) => {
        navigate('/createtask', { state: {taskToEdit: task}});
    };



    return(    
        <div className=" h-screen p-0 m-0 box-border">

           {/* Sidebar Section */}
            <Sidebar isOpen={isOpen} onClose={closeSidebar}/> 

            {/* Header Section*/}
            <Header onOpenSidebar={openSidebar}/> 

            {/* Main container */}
            <div className="pt-23 px-5">
                <div className=" flex justify-between items-center">
                    <h1 className="text-4xl text-gray-800 font-bold">My Tasks</h1>
                    <Link 
                        to={'/createtask'}
                        className="flex justify-center items-center p-4 bg-gray-900 hover:bg-gray-900/80 text-white rounded-3xl text-xl hover:cursor-pointer">
                            <img src={AddIcon} alt="add_svg" className="h-6 mr-1"/>
                            New task
                    </Link>
                </div>

                <div 
                    className="white-body text-2xl font-bold rounded-xl p-3 bg-gray-100 shadow-md/20 flex justify-around mt-5 mb-5">
                    <button onClick={() => handleClick('All')} className={`duration-100 hover:bg-[#097204] ${isClicked === 'All' ? 'bg-[#097204]' : ''} hover:cursor-pointer px-3 py-2 items-center rounded-xl`}>All ({totalTaskCount})</button>
                    <button onClick={() => handleClick('Active')} className={`duration-100 hover:bg-[#097204] ${isClicked === 'Active' ? 'bg-[#097204]' : ''} hover:cursor-pointer px-3 py-2 items-center rounded-xl`}>Active ({totalActiveTaskCount})</button>
                    <button onClick={() => handleClick('Done')} className={`duration-100 hover:bg-[#097204] ${isClicked === 'Done' ? 'bg-[#097204]' : ''} hover:cursor-pointer px-3 py-2 items-center rounded-xl`}>Done ({totalCompletedTaskCount})</button>
                </div>

                {/* Tasks display Section */}
                <div>
                    {tasks.length === 0 ? (
                        <div className="flex justify-center text-center text-black text-xl h-screen">
                            <h1 className="text-gray-600 text-2xl font-semibold mt-20">No Tasks Created</h1>
                        </div>
                    ) : (filteredTasks.map(task => (
                            <TaskEntry
                                key={task.id}
                                title={task.title}
                                description={task.description}
                                isComplete={task.isComplete}
                                onToggleComplete = {() => toggleTaskComplete(task.id)}
                                dueDate={task.dueDate}
                                onDelete={() => deleteTask(task.id)}
                                category={task.category}
                                priority={task.priority}
                                isOverdue={isOverdue(task.dueDate)}
                                onEdit={() => handleEdit(task)}
                            />
                    )))}
                </div>
                
            </div>
        </div>

    )
}


export default TaskList