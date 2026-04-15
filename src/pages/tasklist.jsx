import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useSidebar } from "../hooks/useSidebar";
import { useState } from "react";

/*
function ShowAllTasks(){
    return(
        <div>
            
        </div>
    )
}
*/

function TaskEntry({ title, description, dueDate, onDelete }){    
    return(

        <div className={`flex min-h-50 bg-pink-500 rounded-xl shadow-xl mb-5`}> 
            <div className={`bg-gray-100 w-full ml-3 rounded-xl`}>
                
                <div class="flex items-start gap-3 mb-1 p-6">
                    <div class="mt-1 bg-gray-700 text-white rounded px-1 text-xs">✓</div>
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900 ">{title}</h2>
                        <p class="text-gray-600 text-xl">{description}</p>
                        <div className={`inline-block bg-gray-300 text-gray-600 text-sm p-2 mt-2 rounded-full items-center`}>
                            <p>Due: {dueDate}</p>
                        </div>
                        <div className={`flex justify-center items-center gap-5 text-xl text-gray-400  mt-5`}>
                            <span>Notes</span>
                            <span>Edit</span>
                            <span>Bell</span>
                            <span onClick={onDelete}>Trash</span>
                            <span>Flag</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



function TaskList(){
    
    const { isOpen, openSidebar, closeSidebar } = useSidebar();
    const [ isClicked, setIsClicked ] = useState(null);
    const [ tasks , setTasks ] = useState([]);

    const handleClick = (buttonId) =>{
        setIsClicked(buttonId);
    }

   const addTask = () => {
        const newTask = {
            id: Date.now(),
            title: `New Task ${tasks.length + 1}`,
            description: "Task Description",
            dueDate: "Feb 27, 2026",
        }
        setTasks([...tasks, newTask]);
   };

   const totalTaskCount = tasks.length;

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    } 

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
                    <button 
                        onClick={addTask}
                        className="p-4 bg-gray-900 hover:bg-gray-900/80 text-white rounded-3xl text-xl hover:cursor-pointer">New task</button>
                </div>

                <div 
                    className="white-body text-2xl font-bold rounded-xl p-3 hover:bg-gray-100 shadow-md/20 flex justify-around mt-5 mb-5">
                    <button onClick={() => handleClick('All')} className={`duration-100 hover:bg-[#097204] ${isClicked === 'All' ? 'bg-[#097204]' : ''} hover:cursor-pointer px-3 py-2 items-center rounded-xl`}>All ({totalTaskCount})</button>
                    <button onClick={() => handleClick('Active')} className={`duration-100 hover:bg-[#097204] ${isClicked === 'Active' ? 'bg-[#097204]' : ''} hover:cursor-pointer px-3 py-2 items-center rounded-xl`}>Active ({totalTaskCount})</button>
                    <button onClick={() => handleClick('Done')} className={`duration-100 hover:bg-[#097204] ${isClicked === 'Done' ? 'bg-[#097204]' : ''} hover:cursor-pointer px-3 py-2 items-center rounded-xl`}>Done (0)</button>
                </div>

                {/* Tasks display Section */}
                <div>
                    {tasks.length === 0 ? (
                        <div className="flex justify-center text-center text-black text-xl">
                            No Tasks to display
                        </div>
                    ) : (tasks.map(task => (
                            <TaskEntry
                                key={task.id}
                                title={task.title}
                                description={task.description}
                                dueDate={task.dueDate}
                                onDelete={() => deleteTask(task.id)}
                            />
                    )))}
                </div>
                
            </div>
        </div>

    )
}

export default TaskList