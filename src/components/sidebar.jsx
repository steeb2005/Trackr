import Burger from '../pages/styles/assets/burger-menu-svgrepo-com.svg';
import { Link } from 'react-router-dom';


function Sidebar({isOpen, onClose}){  
    return (       
        <div className={`bg-[#097204] h-screen w-64 z-50 fixed top-0 right-0 transition duration-300 
            ${isOpen ? 'visible' : 'hidden'}`}> {/* Checks if the sidebar is open and will make it visible else hidden */}

            <div className='p-5'>
                <div className="burger-icon absolute right-5"> 
                    <img src={Burger} 
                        alt="close_menu" 
                        className='w-10 h-10 hover:cursor-pointer' 
                        onClick={onClose}/>
                </div>
                <div className='menu'>

                    <nav className='space-y-4 text-white text-2xl font-semibold mt-20'> 

                        <span className='dashboard flex items-center gap-3 justify-end'>
                            <Link to="/dashboard">Dashboard</Link>
                        </span>
                        <span className='dashboard flex items-center gap-3 justify-end'>
                            <Link to="/calendar">Calendar</Link>
                        </span>
                        <span className='dashboard flex items-center gap-3 justify-end'>
                            <Link to="/tasklist">Tasks</Link>
                        </span>
                        <span className='dashboard flex items-center gap-3 justify-end'>
                            <Link to="#">Diary</Link>
                        </span>
                        <span className='dashboard flex items-center gap-3 justify-end'>
                            <Link to="#">Diary List</Link>
                        </span>
                    </nav>
                    
                </div>
            </div>
        </div>
    )
}

export default Sidebar
