import { Link, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useState } from 'react';
import openEye from '../pages/styles/assets/eye-svgrepo-com.svg';
import closeEye from '../pages/styles/assets/eye-slash-svgrepo-com.svg';


function SignIn(){
    const navigate = useNavigate();
    const { register } = useTasks();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };




    if (isLoading) {
        return (
            <div className="flex overflow-hidden justify-center flex-col items-center bg-[#097204] min-h-screen">
                <div className="bg-white p-8 rounded-lg w-full max-w-md text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#097204] mx-auto mb-4"></div>
                    <p className="text-gray-700">Signing you in...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex overflow-hidden justify-center flex-col items-center bg-[#097204] min-h-screen">     
            <div className="header-container pb-10 ">
                <h1 className="text-5xl text-white font-bold">Sign Up!</h1>
            </div>
    
            <div className="login-container bg-white p-8 rounded-lg w-full max-w-md">
                
                <form onSubmit={handleSubmit}>   
                    <fieldset className="border border-gray-300 rounded-md p-3 mb-4 focus-within:border-[#097204] transition-colors">
                        <legend className="text-sm md:text-md font-semibold text-gray-600 px-1">Name</legend>
                        <input 
                            type="text" 
                            className="text-sm md:text-md w-full px-2 py-1 border-0 focus:outline-none bg-transparent" 
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        ></input>
                    </fieldset>
                    <fieldset className="border border-gray-300 rounded-md p-3 mb-4 focus-within:border-[#097204] transition-colors">
                        <legend className="text-sm md:text-md font-semibold text-gray-600 px-1">Email</legend>
                        <input 
                            type="email" 
                            className="text-sm md:text-md w-full px-2 py-1 border-0 focus:outline-none bg-transparent" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        ></input>
                    </fieldset>
                    <fieldset className="border flex border-gray-300 rounded-md p-3 mb-4 focus-within:border-[#097204] transition-colors">
                        <legend className="text-sm md:text-md font-semibold text-gray-600 px-1">Password</legend>
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            className="text-sm md:text-md w-full px-2 py-1 border-0 focus:outline-none bg-transparent" 
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        ></input>
                        <img src={showPassword ? openEye : closeEye} onClick={toggleShowPassword} alt="eye" className='h-6 w-6 hover:cursor-pointer'/>
                    </fieldset>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    
                    <button type="submit" className="mt-4 text-md w-full bg-[#097204] text-white font-bold py-2 px-4 rounded-md hover:bg-[#097204c4] hover:cursor-pointer transition">Sign Up</button>
                    <div className='mt-5 flex justify-center text-md'>
                       <p>Already have an account? <Link to='/login' className='text-[#097204] hover:cursor-pointer '>Login</Link></p> 
                    </div>
                </form> 
                
            </div>
        
        </div>

    )

}

export default SignIn