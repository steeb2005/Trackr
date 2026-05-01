import Burger from '../pages/styles/assets/burger-menu-svgrepo-com.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

function Sidebar({isOpen, onClose}){  
    const { user, logout } = useTasks();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        onClose();
    };

    return (       
        
            <div className={`bg-[#097204] h-screen w-64 z-50 fixed top-0 right-0 transition duration-300 
                ${isOpen ? 'visible' : 'hidden'}`}> 

                <div className='p-5'>
                    <div className="burger-icon absolute right-5 top-2"> 
                        <img src={Burger} 
                            alt="close_menu" 
                            className='w-10 h-10 hover:cursor-pointer' 
                            onClick={onClose}/>
                    </div>
                    <div className='menu mt-10'>
                        
                        <nav className='space-y-4 text-white text-xl font-semibold mt-5'> 

                            <span className='dashboard flex items-center gap-3 justify-end'>
                                <Link to="/dashboard" onClick={onClose}>Dashboard</Link>
                            </span>
                            <span className='dashboard flex items-center gap-3 justify-end'>
                                <Link to="/calendar" onClick={onClose}>Calendar</Link>
                            </span>
                            <span className='dashboard flex items-center gap-3 justify-end'>
                                <Link to="/tasklist" onClick={onClose}>Tasks</Link>
                            </span>
                            <span className='dashboard flex items-center gap-3 justify-end'>
                                <Link to="/diary" onClick={onClose}>Diary</Link>
                            </span>
                            {user && (
                                <span className='dashboard flex items-center gap-3 justify-end'>
                                    <button onClick={handleLogout} className="hover:text-gray-200 hover:cursor-pointer">
                                        Logout
                                    </button>
                                </span>
                            )}
                        </nav>
                        
                    </div>
                </div>
            </div>
        
    )
}

export default Sidebar
