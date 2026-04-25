import { useState } from "react";
import Header from "../components/header"
import Sidebar from "../components/sidebar"
import { useSidebar } from '../hooks/useSidebar'
import Book from './styles/assets/book-svgrepo-com.svg'

// TODO: Finish this and make the create diary entry

function DiaryEntry(){

    return(
        <div className="mb-5">
            <h1>Date: Feb 28, 2026</h1>
            <div className="entry hover:cursor-pointer bg-gray-300 shadow-[#097204] shadow-[3px_3px] duration-200 p-2 rounded-xl">
                <h1 className="text-xl font-bold">Title</h1>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque ratione nostrum autem minima et minus animi, delectus fugiat repellat. Corporis labore in eius illum voluptatibus facere delectus eveniet eaque. Iusto!</p>
            </div>
            
        </div>    
    )
}

function Diary(){

    const { isOpen, openSidebar, closeSidebar } = useSidebar();
    const [entries, setEntries] = useState([]);
    
    return(
        <div className="m-0 p-0">
            {/* Sidebar Section */}
            <Sidebar isOpen={isOpen} onClose={closeSidebar}/> 

            {/* Header Section*/}
            <Header onOpenSidebar={openSidebar}/>     

            <div className="main-container w-full h-screen px-5 pt-26">

                <div className="header-bar flex items-center border-b-3 pb-2 border-gray-400 shadow-xl">
                    <img src={Book} alt="book_svg" className="h-15"/>
                    <h1 className="text-4xl font-bold ml-2">My Diary</h1>
                    <button className="hover:cursor-pointer bg-gray-800 hover:bg-gray-800/80 ml-auto px-4 py-3 text-xl font-semibold text-white items-center rounded-xl">Add Entry</button>
                </div>

                <div className="content-body mt-5">

                    <DiaryEntry/>
                    <DiaryEntry/>
                    <DiaryEntry/>
                    <DiaryEntry/>
                    {/*
                    {entries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-100">
                            <h1 className="text-3xl font-semibold mb-5 text-gray-500">No Entries Yet</h1>
                            <button className="hover:cursor-pointer bg-gray-800 hover:bg-gray-800/80 px-4 py-3 text-xl font-semibold text-white rounded-xl">Add Entry</button>
                        </div>
                    ) : (
                        <div className="flex justify-center bg-gray-500">
                            <h1>Has Entries (test)</h1>
                        </div>
                    )
                    }*/}
                </div>
            </div>
        </div>
    )
}

export default Diary