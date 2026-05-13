import Burger from '../pages/styles/assets/burger-menu-svgrepo-com.svg';
import Logo from '../pages/styles/assets/trackr-logo.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useState } from 'react';

function Header({ onOpenSidebar }){
    const { user, logout } = useTasks();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const currentLoocation = location.pathname.substring(1) || 'dashboard';

    return(
        
        <div className="t-0 r-0 header bg-[#097204] fixed w-full py-2 px-5 border-b-4 border-amber-500 z-100">
            <div className='flex justify-between'>
                
                <div className='flex items-center gap-4'>
                    <img src={Logo} alt="logo" className='h-10'/>
                    
                </div>
               
                <div className="burger-icon flex md:hidden justify-end"> 
                    <img src={Burger} 
                        alt="open_menu" 
                        className='w-10 h-10 hover:cursor-pointer'
                        onClick={onOpenSidebar}/>
                </div>    
                <div className='hidden md:flex flex-row items-center gap-10 justify-end text-lg text-white font-semibold'>
                    <span>
                        <Link to="/dashboard" className={`${currentLoocation=== 'dashboard' ? 'bg-[#075e02]' : ''} p-2 hover:bg-[#075e02] rounded-full transition duration-200`}>Dashboard</Link>
                    </span>
                    <span>
                        <Link to="/calendar" className={`${currentLoocation === 'calendar' ? 'bg-[#075e02]' : ''} p-2 hover:bg-[#075e02] rounded-full transition duration-200`}>Calendar</Link>
                    </span>
                    <span>
                        <Link to="/tasklist" className={`${currentLoocation === 'tasklist' ? 'bg-[#075e02]' : ''} p-2 hover:bg-[#075e02] rounded-full transition duration-200`}>Tasks</Link>
                    </span>
                    <span>
                        <Link to="/diary" className={`${currentLoocation === 'diary' ? 'bg-[#075e02]' : ''} p-2 hover:bg-[#075e02] rounded-full transition duration-200`}>Diary</Link>
                    </span>
                    {user && (
                        <span>
                            <button 
                                onClick={handleLogout}
                                className='p-2 hover:bg-[#075e02] rounded-full transition duration-200 hover:cursor-pointer'
                            >
                                Logout
                            </button>
                        </span>
                    )}
                </div>
               
            </div>
        </div>
    )
}

export default Header