import { useState } from "react";
import Header from "../components/header"
import Sidebar from "../components/sidebar"
import { useSidebar } from '../hooks/useSidebar'
import Book from './styles/assets/book-svgrepo-com.svg'
import Add from './styles/assets/add-svgrepo-com.svg'
import { useNavigate } from "react-router-dom";
import {useTasks} from '../context/TaskContext';
import Trash from './styles/assets/trash-red-svgrepo-com.svg'

function DiaryEntry({entryId, entryTitle, entryContent, entryDate, ondeleteDiaryEntry}){
    const [isExpanded, setIsExpanded] = useState(false);

    const formattedDate = new Date(entryDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return(
        <div key={entryId} className="mb-8">
            <h1 className="mb-2">{formattedDate}</h1>
            <div 
                className={`entry hover:cursor-pointer bg-gray-200 shadow-[#097204] shadow-[3px_3px] duration-200 p-4 rounded-xl`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h1 className="text-xl font-bold">{entryTitle}</h1>

                <p className={`overflow-ellipsis break-words ${!isExpanded ? 'line-clamp-2' : ''}`}>{entryContent}</p>

                {isExpanded && (
                    <div className="flex justify-end ">
                        <img 
                            src={Trash} 
                            alt="trash_svg" 
                            className="hover:cursor-pointer h-8 w-8"
                            onClick={ondeleteDiaryEntry}
                        />
                    </div>
                )}
                    
            </div>
            
        </div>    
    )
}



function Diary(){

    const navigate = useNavigate();

    const { isOpen, openSidebar, closeSidebar } = useSidebar();
    const {diaryEntries, deleteDiaryEntry} = useTasks();

    return(
        <div className="m-0 p-0">
            {/* Sidebar Section */}
            <Sidebar isOpen={isOpen} onClose={closeSidebar}/> 

            {/* Header Section*/}
            <Header onOpenSidebar={openSidebar}/>     

            <div className="main-container w-full h-screen px-5 pt-26">

                <div className="header-bar flex items-center border-b-3 pb-2 border-gray-400 shadow-xl">
                    <img src={Book} alt="book_svg" className="h-15"/>
                    <h1 className="text-3xl font-bold ml-2 text-gray-800">My Diary</h1>
                    <button 
                        className="hover:cursor-pointer flex bg-gray-800 hover:bg-gray-800/80 ml-auto px-4 py-3 text-xl font-semibold text-white items-center rounded-2xl"
                        onClick={() => navigate('/create-diary-entry')}
                    >
                        <img src={Add} alt="add_svg" className="h-5 w-5"/>
                        Add Entry
                    </button>
                </div>

                <div className="content-body mt-5 pb-10"> 

                    {diaryEntries.length === 0 ? (
                        <div className="flex justify-center text-center mt-20">
                            <h1 className='text-gray-600 text-2xl font-semibold'>No Entries Yet</h1>
                        </div>
                    ) : (
                        diaryEntries.map(entry => (
                            <DiaryEntry
                                entryId={entry.id}
                                entryTitle={entry.title}
                                entryContent={entry.content}  
                                entryDate={entry.date}
                                ondeleteDiaryEntry={() => deleteDiaryEntry(entry.id)}
                            />
                        ))
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default Diary