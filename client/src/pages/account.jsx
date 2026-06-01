import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { useSidebar } from "../hooks/useSidebar";
import User from "./styles/assets/user-svgrepo-com.svg";
import Target from './styles/assets/target-svgrepo-com.svg';
import Check from './styles/assets/circle-check-filled-svgrepo-com.svg';
import Alert from './styles/assets/alert-svgrepo-com.svg'
import Pencil from './styles/assets/pencil-svgrepo-com.svg'
import { useTasks } from "../context/TaskContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isOverdue } from '../hooks/checkOverdue';

/*
    - Fix password not being updated
    - Fix email not being updated
    - Fix name not being updated
    - Just displays account updated successfully but not actually updaing the account
    - fix go to claude (fuckass ai)
*/

function Account(){
    const { isOpen, openSidebar, closeSidebar } = useSidebar();
    const { user, updateUser, logout, tasks, deleteAccount } = useTasks();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });

    // Update formData when user changes (if user updates from elsewhere)
    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            confirmPassword: ''
        });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        // If password is empty, we don't want to update it (assuming empty means no change)
        const updateData = {
            name: formData.name,
            email: formData.email
        };
        if (formData.password) {
            updateData.password = formData.password;
        }
        
        try {
            await updateUser(updateData);
            // Optionally reset form or show success
            showPopupHandler();
            // Reset password fields for security
            setFormData(prev => ({
                ...prev,
                password: '',
                confirmPassword: ''
            }));
            setError(null);
        } catch (err) {
            setError("Failed to update account: " + (err.message || "Unknown error"));
        }
    };



    const handleLogout = () => {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.setItem('rememberMe', 'false');
        setIsLoading(true);
        logout();
        navigate('/');
    };
    
    const handleDeleteAccount = async () => {
        try {
            setIsLoading(true);
            await deleteAccount();
            navigate('/login');
        } catch (err) {
            setIsLoading(false);
            alert("Failed to delete account: " + (err.message || "Unknown error"));
        }
    };


    const totalOverdueTasks = tasks.filter(task => isOverdue(task.dueDate, task.dueTime) && !task.isComplete).length;
    const totalCompleted = tasks.filter(task => task.isComplete).length;
    const totalActiveTasks = tasks.filter(task => !task.isComplete).length;


    const showPopupHandler = () => {
        setShowPopup(true);
        setTimeout(() =>{
            setShowPopup(false);
        }, 1000);
    }


    if(isLoading) {
        return (
            <div className="flex overflow-hidden justify-center flex-col items-center bg-layout-primary min-h-screen">
                <div className="bg-white p-8 rounded-lg w-full max-w-md text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-layout-primary mx-auto mb-4"></div>
                    <p className="text-gray-700">Redirecting you to login...</p>
                </div>
            </div>
        );
    }

    return(
        <div className="p-0 m-0 box-border">
            <Sidebar isOpen={isOpen} onClose={closeSidebar}/> 

            <Header onOpenSidebar={openSidebar}/> 
            

            <div className="pt-22 h-screen px-5 md:px-60 overflow-auto" style={{scrollBehavior: 'smooth'}}>
                <div className="flex justify-between mb-5">
                    <h1 className="font-bold text-4xl ml-2 mb-2 text-gray-900">Account</h1>
                    <button 
                        className="hover:cursor-pointer flex bg-gray-900 hover:bg-gray-900/80 ml-auto px-5 py-3 md:text-xl text-lg font-semibold text-white items-center rounded-3xl"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                {confirmDeleteUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                        <div className="bg-gray-100 p-5 mx-5 rounded-xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Delete Account
                            </h2>
                            <p className="text-gray-600 mb-6 text-start text-sm md:text-lg">
                                This will permanently remove your account, all your tasks, notes, diary entries, and task notes. This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    className="hover:cursor-pointer px-5 py-2.5 text-sm md:text-md rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
                                    onClick={() => setConfirmDeleteUser(false)}
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="text-sm md:text-md px-5 py-2 rounded-xl bg-red-700 hover:cursor-pointer text-white font-semibold hover:bg-red-700/80"
                                    onClick={handleDeleteAccount}
                                    type="button"
                                >
                                    Yes, Delete My Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Popup for successfull account update */}
                {showPopup && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                        <div className="bg-green-500 text-white shadow-md flex flex-col justify-center items-center rounded-lg p-5 animate-slide-in-out">
                            <img src={Check} alt="Check" className="w-10 h-10 mb-2"/>
                            <h1 className="font-semibold text-center text-md md:text-xl">Account updated successfully</h1>
                        </div>
                    </div>
                )}

                <div className="flex flex-row gap-2">

                    <div className="flex flex-col md:flex-row bg-gray-200 rounded-xl p-3 min-w-50 md:min-w-150">
                        <div className="overflow-auto bg-gray-300 rounded-full w-23 h-23 md:w-30 md:h-30 flex items-end justify-center">
                            <img 
                                src={User} 
                                alt="user" 
                                className="w-20 h-20 md:w-25 md:h-25 opacity-70"
                            />
                        </div>

                        <div className="flex flex-col justify-center md:ml-5">
                            <h1 className="font-bold text-2xl md:text-4xl mb-1">{user.name}</h1>
                            <h1 className="font-semibold text-md md:text-xl">{user.email}</h1>
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <a href="#editinfo" >

                            <div 
                                className="hover rounded-xl p-3 bg-gray-200 hover:cursor-pointer hover:bg-gray-300/80 flex flex-col items-center text-center h-full"
                                
                            >
                                <img src={Pencil} alt="Pencil" className="w-10 h-10"/>
                                <p className="font-semibold">Edit personal info</p> 
                            </div>
                        </a>

                        <div 
                            className="bg-red-700 hover:cursor-pointer hover:bg-red-700/80 p-3 text-white rounded-xl flex items-center justify-center h-full"
                            onClick={() => setConfirmDeleteUser(true)}
                        >
                            <p className="font-semibold text-center">Delete Account</p>
                        </div>
                    </div>
                </div>
                             
                        
                <div className='grid grid-cols-1 gap-4 mb-10 mt-5'>
                    <div className='w-full bg-green-300 p-5 rounded-xl'>
                        <img src={Check} alt="Check_img" className='h-10 w-10'/>
                        <h1 className='mt-2 mb-2 font-bold text-5xl'>{totalCompleted}</h1>
                        <p className='font-semibold text-gray-900'>Total Completed</p>
                    </div>

                    <div className='w-full bg-red-300 p-5 rounded-xl'>
                        <img src={Target} alt="Target_img" className='h-10 w-10 '/>
                        <h1 className='mt-2 mb-2 font-bold text-5xl'>{totalActiveTasks}</h1>
                        <p className='font-semibold text-gray-900'>Total Remaining</p>
                    </div>

                    <div className='w-full bg-red-500 p-5 rounded-xl'>
                        <img src={Alert} alt="Target_img" className='h-10 w-10 '/>
                        <h1 className='mt-2 mb-2 font-bold text-5xl'>{totalOverdueTasks}</h1>
                        <p className='font-semibold text-gray-900'>Total Overdue</p>
                    </div>
                </div>

                <h1 className="font-bold text-2xl ml-2 mb-2">Edit personal info</h1>

                <form id="editinfo" onSubmit={handleSubmit}>   
                    <fieldset className="border border-gray-300 mt-5 rounded-md p-3 mb-4 focus-within:border-layout-primary transition-colors">
                        <legend className="text-sm md:text-md font-semibold text-gray-600 px-1">Name</legend>
                        <input 
                            name="name"
                            type="text" 
                            value={formData.name}
                            onChange={handleChange}
                            className="text-sm md:text-md w-full px-2 py-1 border-0 focus:outline-none bg-transparent" 
                            placeholder="Enter your name"
                        ></input>
                    </fieldset>
                    <fieldset className="border border-gray-300 rounded-md p-3 mb-4 focus-within:border-layout-primary transition-colors">
                        <legend className="text-sm md:text-md font-semibold text-gray-600 px-1">Email</legend>
                        <input 
                            name="email"
                            value={formData.email}
                            type="email" 
                            onChange={handleChange}
                            className="text-sm md:text-md w-full px-2 py-1 border-0 focus:outline-none bg-transparent" 
                            placeholder="Enter your email"
                            
                        ></input>
                    </fieldset>
                    <fieldset className="border flex border-gray-300 rounded-md p-3 mb-4 focus-within:border-layout-primary transition-colors">
                        <legend className="text-sm md:text-md font-semibold text-gray-600 px-1">Password</legend>
                        <input 
                            name="password"
                            type={'password'} 
                            value={formData.password}
                            onChange={handleChange}
                            className="text-sm md:text-md w-full px-2 py-1 border-0 focus:outline-none bg-transparent" 
                            placeholder="New password"
                        ></input>
                    </fieldset>

                    <fieldset className="border flex border-gray-300 rounded-md p-3 mb-4 focus-within:border-layout-primary transition-colors">
                        <legend className="text-sm md:text-md font-semibold text-gray-600 px-1">Confirm password</legend>
                        <input 
                            name="confirmPassword"
                            type={'password'} 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="text-sm md:text-md w-full px-2 py-1 border-0 focus:outline-none bg-transparent" 
                            placeholder="Confirm password"
                        ></input>
                    </fieldset>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    <div className="flex justify-end">
                        <button 
                            className="mb-5 bg-green-700 hover:cursor-pointer items-center hover:bg-green-700/80 p-3 text-white rounded-xl flex justify-center" 
                            type="submit"
                        >
                            <p className="font-semibold ml-2">Save Changes</p>
                        </button>
                    </div>
                     
                     
                     
                </form> 
            </div>

        </div>
    )
    
    
    
}

export default Account