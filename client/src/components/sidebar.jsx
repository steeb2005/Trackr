import Burger from '../pages/styles/assets/burger-menu-svgrepo-com.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

function Sidebar({isOpen, onClose}){  
    const { user, logout } = useTasks();
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleLogout = () => {
        logout();
        navigate('/');
        onClose();
    };


    const currentLocation = location.pathname.substring(1) || 'dashboard';

    return (       
    
        <div className={`bg-[#097204] z-999 h-screen w-45  fixed top-0 right-0 transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full' }
            `}> 

            <div className='py-5 px-3'>
                <div className="burger-icon absolute right-5 top-2"> 
                    <img src={Burger} 
                        alt="close_menu" 
                        className='w-10 h-10 hover:cursor-pointer' 
                        onClick={onClose}/>
                </div>
                <div className='menu mt-10 text-end'>
                    
                    <nav className='space-y-2 flex flex-col justify-center text-white text-xl font-semibold mt-5'> 

                        <span className={`py-1 px-2 rounded-md ${currentLocation === 'dashboard' ? 'bg-[#075e02]' : ''}`}>
                            <Link to="/dashboard" onClick={onClose}>Dashboard</Link>
                        </span>
                        <span className={`py-1 px-2 rounded-md ${currentLocation === 'calendar' ? 'bg-[#075e02]' : ''}`}>
                            <Link to="/calendar" onClick={onClose}>Calendar</Link>
                        </span>
                        <span className={`py-1 px-2 rounded-md ${currentLocation === 'tasklist' ? 'bg-[#075e02]' : ''}`}>
                            <Link to="/tasklist" onClick={onClose}>Tasks</Link>
                        </span>
                        <span className={`py-1 px-2 rounded-md ${currentLocation === 'diary' ? 'bg-[#075e02]' : ''}`}>
                            <Link to="/diary" onClick={onClose}>Diary</Link>
                        </span> 
                        {user && (
                            <span className='py-1 px-2 rounded-md'>
                                <button onClick={handleLogout} >
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
