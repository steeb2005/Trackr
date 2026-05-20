import { use, useEffect, useState } from "react";
import Header from "../components/header"
import Sidebar from "../components/sidebar"
import { useSidebar } from '../hooks/useSidebar'
import Book from './styles/assets/book-svgrepo-com.svg'
import Add from './styles/assets/add-svgrepo-com.svg'
import { useNavigate } from "react-router-dom";
import {useTasks} from '../context/TaskContext';
import TrashRed from './styles/assets/trash-red-svgrepo-com.svg'
import Trash from './styles/assets/trash-blank-alt-svgrepo-com.svg';
import Check from './styles/assets/circle-check-filled-svgrepo-com.svg';
import { useLocation } from "react-router-dom";




function DiaryEntry({entryId, entryTitle, entryContent, entryDate, ondeleteDiaryEntry}){
    const [isExpanded, setIsExpanded] = useState(false);

    const formattedDate = new Date(entryDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const [isHovered, setIsHovered] = useState(false);

    return(
        <div key={entryId} className="mb-8">
            <h1 className="mb-2 text-gray-600 font-semibold">{formattedDate}</h1>
            <div 
                className={`entry hover:cursor-pointer bg-gray-200 hover:shadow-[#097204] hover:shadow-[3px_3px] duration-100 p-4 rounded-xl ${isExpanded ? 'shadow-[#097204] shadow-[3px_3px]' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h1 className={`overflow-hidden text-ellipsis ${!isExpanded ? 'whitespace-nowrap' : ''} text-xl font-bold`}>{entryTitle}</h1>

                <p className={`overflow-hidden  text-ellipsis ${!isExpanded ? 'whitespace-nowrap' : ''}`}>{entryContent}</p>

                {isExpanded && (
                    <div className="flex justify-end ">
                        <img 
                            src={isHovered ? TrashRed : Trash} 
                            alt="trash_svg" 
                            className="hover:cursor-pointer h-8 w-8"
                            onClick={ondeleteDiaryEntry}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        />
                    </div>
                )}
                    
            </div>
            
        </div>    
    )
}



function Diary(){

    const navigate = useNavigate();
    const location = useLocation();
    const { isOpen, openSidebar, closeSidebar } = useSidebar();
    const {diaryEntries, deleteDiaryEntry} = useTasks();

    const [deleteEntryNotif, setDeleteEntryNotif] = useState(false);
    const [successEntryNotif, setSuccesEntryNotif] = useState(false);


    const handleDeleteEntry = (entryId) => {
        deleteDiaryEntry(entryId);
        setDeleteEntryNotif(true);
        setTimeout(() => {
            setDeleteEntryNotif(false);
        }, 3000);
    }

    useEffect(() =>{
        if(location.state?.showSuccess){
            setSuccesEntryNotif(true);

            window.history.replaceState({}, document.title);

            setTimeout(() => {
                setSuccesEntryNotif(false);
            }, 3000);
        }
    }, [location])

    return(
        <div className="m-0 p-0">
            {/* Sidebar Section */}
            <Sidebar isOpen={isOpen} onClose={closeSidebar}/> 

            {/* Header Section*/}
            <Header onOpenSidebar={openSidebar}/>     

            {/* Success Notification */}
            {successEntryNotif && (
                <div className="fixed bottom-2 -right-15 transform -translate-x-1/2 -translate-y-1/2 z-999">
                    <div className="bg-green-500 text-white shadow-md flex flex-row justify-center items-center rounded-lg p-4 animate-slide-in-out-side"> {/*animate-slide-in-out-side*/}
                        <img src={Check} alt="check" className="h-6 w-6"/>
                        <h1 className="font-semibold text-center text-md md:text-xl ml-2">Entry Created</h1>
                    </div>
                </div>
            )}
            {/* Delete Notification */}
            {deleteEntryNotif && (
                <div className="fixed bottom-2 -right-15 transform -translate-x-1/2 -translate-y-1/2 z-999">
                    <div className="bg-red-500 text-white shadow-md flex flex-row justify-center items-center rounded-lg p-4 animate-slide-in-out-side"> {/*animate-slide-in-out-side*/}
                        <img src={Check} alt="check" className="h-6 w-6"/>
                        <h1 className="font-semibold text-center text-md md:text-xl ml-2">Entry Deleted</h1>
                    </div>
                </div>
            )}

            <div className="main-container w-full h-screen overflow-auto px-5 pt-26">

                <div className="header-bar flex items-center border-b-3 pb-2 border-gray-400 shadow-xl">
                    <img src={Book} alt="book_svg" className="h-15"/>
                    <h1 className="md:text-3xl text-2xl font-bold ml-2 text-gray-900">My Diary</h1>
                    <button 
                        className="hover:cursor-pointer flex bg-gray-900 hover:bg-gray-900/80 ml-auto px-3 py-3 md:text-xl text-lg font-semibold text-white items-center rounded-full"
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
                                entry={entry.id}
                                entryTitle={entry.title}
                                entryContent={entry.content}  
                                entryDate={entry.date}
                                ondeleteDiaryEntry={() => handleDeleteEntry(entry.id)}
                            />
                        ))
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default Diary