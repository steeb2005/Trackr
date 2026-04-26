import { useState } from "react";
import Header from "../components/header"
import Sidebar from "../components/sidebar"
import { useSidebar } from '../hooks/useSidebar'
import Book from './styles/assets/book-svgrepo-com.svg'
import { useNavigate } from "react-router-dom";
import Back from './styles/assets/back-svgrepo-com.svg';





function CreateDiaryEntry(){

    const { isOpen, openSidebar, closeSidebar } = useSidebar();

	const navigate = useNavigate();

	const today = new Date();

    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

	return(
		<div className="body m-0 p-0 h-screen">

			<Sidebar isOpen={isOpen} onClose={closeSidebar}/>		
			<Header onOpenSidebar={openSidebar}/>

			<div className={`pt-23 px-5 h-screen`}>

				<div className="flex gap-5 items-center">
					
					<div 
						className="hover:cursor-pointer back border border-[#097204] rounded-xl shadow-md p-3"
						onClick={() => navigate('/diary')}>
						<img src={Back} alt="back_svg" className="h-10" />        
                    </div>
				
					<div>
						<h1 className="text-4xl font-bold">My Diary</h1>
						<p className="mt-1 text-lg font-semibold">Write about how your day went</p>
					</div>
					
				</div>
				<div className="date-field mt-8">
					<h1 className="font-bold text-gray-800 text-2xl mb-4">Date</h1>
					<div className="bg-gray-100 border border-gray-600 p-5 rounded-4xl items-center text-xl text-gray-600">{formattedDate}</div>
				</div>

				<div className="input-field mt-6">
					<h1 className="font-bold text-gray-800 text-2xl mb-4">Your Entry</h1>
					<div className="bg-gray-100 py-5 px-8 border border-gray-600 rounded-4xl">
						<input 
							type="text" 
							placeholder="Title" 
							className={`font-semibold text-2xl w-full outline-none mb-2`}
                    	/>

						<textarea 
							id="diary-key"
							placeholder="What happened today? How are you feeling?"
							rows='3'
							className=" text-xl w-full  outline-none h-50"        
							>   
						</textarea>
					</div>
				</div>

				<div className="pb-10 mt-10">
                    <button 
                        className="hover:cursor-pointer hover:bg-[#097204]/80 border-none bg-[#097204] text-white text-2xl font-bold text-center p-3 w-full rounded-3xl"
                        
                    >
                        Save Entry

                    </button>
                </div>
			</div>
		</div>
	)
}

export default CreateDiaryEntry