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
import TaskNoteModal from "../components/tasknoteModal";
import TrashRed from './styles/assets/trash-red-svgrepo-com.svg';
import { useLocation } from "react-router-dom";

/*
    FIX TEXT OVERLAP 
    - notesModal
    - dateModal
    - dashboard
*/

function TaskEntry({ 
    key,
    task,
    title, 
    description, 
    dueDate, 
    onDelete, 
    isComplete, 
    onToggleComplete, 
    category, 
    priority, 
    isOverdue, 
    onEdit,
    onNotesClick,
    existingNotes
    }){    
    
    const [isFlashing, setIsFlashing] = useState(false);
    const location = useLocation();
    const [isCooldown, setIsCooldown] = useState(false);

    useEffect(() => {
        if (location.hash === `#${task.id}`) {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 1000);
        }
    }, [location.hash, task.id]);

    const handleToggle = () => {
        if (isCooldown) return; 

        onToggleComplete();
        setIsCooldown(true);

        setTimeout(() => {
            setIsCooldown(false);
        }, 300);
    };


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

    const numberOfNotes = existingNotes.length;

    const [isHovered, setIsHovered] = useState(false);

    return(  
      
        <div id={task.id} className={`${isFlashing ? 'animate-flash' : ''} scroll-mt-50 flex duration-200 ${isComplete ? 'bg-gray-600' : isOverdue ? 'bg-[#FF3538]' : categoryColor[category]}  rounded-xl shadow-xl mb-5`}> 
            <div className={`${isFlashing ? 'animate-flash' : ''} bg-gray-100 w-full ml-3 rounded-xl`}>
                
                <div className={` flex items-start gap-3 mb-1 p-4`}>
                    <div className={` mt-1 items-center bg-gray-700 flex justify-center accent-gray-700 outline-none text-white rounded p-1 text-xs`}>
                        <input 
                            type="checkbox"
                            checked={isComplete}
                            onChange={handleToggle}
                            disabled={isCooldown}
                            className="hover:cursor-pointer"
                        />
                    </div>
                    <div className="w-full overflow-hidden">
                        <h2 className={`break-words overflow-hidden text-xl md:text-2xl font-bold ${isComplete ? 'text-gray-500' : 'text-gray-900 '}`}>{title}</h2>
                        <p className="break-words text-gray-600 text-xl">{description}</p>
                        <div className={`inline-block bg-gray-300 text-gray-600 text-sm p-2 mt-2 rounded-full items-center`}>
                            <p className={`${isOverdue ? 'font-semibold text-red-600' : ''}`}>{isOverdue ? 'Overdue: ' : 'Due: '}{dueDate}</p>
                        </div>

                        {/* Add icons for these */}
                        <div className={`flex justify-start items-center gap-5 text-xl text-gray-600  mt-5`}>
                            <span onClick={onNotesClick} className="hover:cursor-pointer hover:text-gray-400">{numberOfNotes === 0 ? 'Add Note' : `Notes(${numberOfNotes})`}</span>
                            <span onClick={onEdit} className="hover:cursor-pointer hover:text-gray-400">Edit</span>
                            
                            <img 
                                src={isHovered ? TrashRed : Trash}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)} 
                                alt="trash_svg" 
                                onClick={onDelete} 
                                className="h-7 w-7 hover:cursor-pointer"
                            />
                            
                            <img src={priorityFlag[priority]} alt="priorityflag_svg" className="w-7 h-7"/>
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

    const { tasks, deleteTask, toggleTaskComplete, saveTaskNotes, taskNotes, deleteTaskNote } = useTasks();
    {/* Handles the event click for the filter */}
    const handleClick = (buttonId) =>{
        setIsClicked(buttonId);
    }

    const [selectedTaskForNotes, setSelectedTaskForNotes] = useState(null);
    const [showTaskNoteModal, setShowTaskNoteModal] = useState(false);

    const openTaskNotes = (task) => {
        setSelectedTaskForNotes(task);
        setShowTaskNoteModal(true);
    };

    const closeTaskNotes = () => {
        setShowTaskNoteModal(false);
        setSelectedTaskForNotes(null);
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

    const completedTask = tasks.filter(task => task.isComplete).length;
    const activeTasks = tasks.filter(task => !task.isComplete).length;

    {/* Loads the filtered tasks */}
    const filteredTasks = getFilteredTasks();

    
    const handleEdit = (task) => {
        navigate('/createtask', { state: {taskToEdit: task}});
    };



    return(    
        <div className="p-0 m-0 box-border">

           {/* Sidebar Section */}
            <Sidebar isOpen={isOpen} onClose={closeSidebar}/> 

            <Header onOpenSidebar={openSidebar}/> 
            {/* Header Section*/}

            {/* Main container */}
            <div className="h-screen overflow-auto pt-23 px-5 py-5">
                <div className=" flex justify-between items-center ">
                    <h1 className="text-4xl text-gray-800 font-bold">My Tasks</h1>
                    <Link 
                        to={'/createtask'}
                        className="flex justify-center items-center px-3 py-3 bg-gray-900 hover:bg-gray-900/80 text-white rounded-3xl text-xl hover:cursor-pointer">
                            <img src={AddIcon} alt="add_svg" className="h-6 mr-1"/>
                            New task
                    </Link>
                </div>

                <div 
                    className="white-body md:text-2xl text-lg font-bold rounded-xl p-3 bg-gray-100 shadow-md/20 flex justify-around mt-5 mb-5"
                >
                    <button onClick={() => handleClick('All')} className={`duration-100 hover:bg-[#097204] ${isClicked === 'All' ? 'bg-[#097204]' : ''} hover:cursor-pointer px-3 py-2 items-center rounded-xl`}>All ({totalTaskCount})</button>
                    <button onClick={() => handleClick('Active')} className={`duration-100 hover:bg-[#097204] ${isClicked === 'Active' ? 'bg-[#097204]' : ''} hover:cursor-pointer px-3 py-2 items-center rounded-xl`}>Active ({totalActiveTaskCount})</button>
                    <button onClick={() => handleClick('Done')} className={`duration-100 hover:bg-[#097204] ${isClicked === 'Done' ? 'bg-[#097204]' : ''} hover:cursor-pointer px-3 py-2 items-center rounded-xl`}>Done ({totalCompletedTaskCount})</button>
                </div>

                {/* Tasks display Section */}
                <div>

                    {/* Display Task Note Modal */}
                    {showTaskNoteModal && selectedTaskForNotes && (
                        <TaskNoteModal
                            task={selectedTaskForNotes}
                            onClose={closeTaskNotes}
                            onSaveNote={(notes) => saveTaskNotes(selectedTaskForNotes.id, notes)}
                            existingNotes={taskNotes[selectedTaskForNotes.id] || []}
                            onDeleteNote={(index) => deleteTaskNote(selectedTaskForNotes.id, index)}
                        />
                    )}

                    {/* Shows task entries */}

                    
                    {tasks.length === 0 ? (
                        <div className="flex justify-center text-center text-black text-xl h-screen">
                            <h1 className="text-gray-600 text-md font-semibold mt-20">No Tasks Created</h1>
                        </div>
                    ) :  isClicked === 'Active' && activeTasks === 0 ? (
                        <div className="flex justify-center text-center text-black text-xl h-screen">
                            <h1 className="text-gray-600 text-md font-semibold mt-20">No Active Tasks</h1>
                        </div>
                    ) : isClicked === 'Done' && completedTask === 0 ? (
                        <div className="flex justify-center text-center text-black text-xl h-screen">
                            <h1 className="text-gray-600 text-md font-semibold mt-20">No Completed Tasks</h1>
                        </div>
                    ) : (filteredTasks.map(task => (
                            <TaskEntry
                                key={task.id}
                                task={task}
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
                                onNotesClick={() => openTaskNotes(task)}
                                existingNotes={taskNotes[task.id] || []}
                            />
                    )))}

                
                </div>
                
            </div>
        </div>

    )
}


export default TaskList


/*
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
            onNotesClick={() => openTaskNotes(task)}
        />
)))}
*/