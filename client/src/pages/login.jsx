import { Link, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useEffect, useState } from 'react';
import openEye from '../pages/styles/assets/eye-svgrepo-com.svg';
import closeEye from '../pages/styles/assets/eye-slash-svgrepo-com.svg';

function Login(){
    const navigate = useNavigate();
    const { login } = useTasks();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');
        const savedRememberMe = localStorage.getItem('rememberMe');

        if(savedRememberMe === 'true' && savedEmail){
            setEmail(savedEmail);
            setPassword(savedPassword) || '';
            setRememberMe(true);

            if(savedPassword){
                setIsLoading(true);
                autoLogin(savedEmail, savedPassword);
            }
        }

    }, []);


    const autoLogin = async (autoEmail, autoPassword) => {
        try{
            await login(autoEmail, autoPassword);
            navigate('/dashboard');
        }catch(err){
            setError(err.response?.data?.message || 'Login failed. Please login manually');
            setIsLoading(false); 
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
            localStorage.setItem('rememberMe', 'false');
            setRememberMe(false);
        }
    };


    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        
        if(rememberMe){
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
            localStorage.setItem('rememberMe', 'true');
        }else{
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
            localStorage.setItem('rememberMe', 'false');
        }


        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || 'Login failed');
        }
    };


    

    if (isLoading) {
        return (
            <div className="flex overflow-hidden justify-center flex-col items-center bg-[#097204] min-h-screen">
                <div className="bg-white p-8 rounded-lg w-full max-w-md text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#097204] mx-auto mb-4"></div>
                    <p className="text-gray-700">Logging you in...</p>
                </div>
            </div>
        );
    }






    return (
        <div className="flex overflow-hidden justify-center flex-col items-center bg-[#097204] min-h-screen">     

            
            <div className="header-container pb-10 ">
                <h1 className="text-5xl text-white font-bold">Login!</h1>
            </div>
    
            <div className="login-container bg-white p-8 rounded-lg w-full max-w-md">
                <form onSubmit={handleSubmit}>   
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-sm md:text-md w-full px-2 py-1 border-0 focus:outline-none bg-transparent" 
                            placeholder="Enter your password"
                            required
                        >
                            
                        </input>
                        <img src={showPassword ? closeEye : openEye} onClick={toggleShowPassword} alt="eye" className='h-6 w-6 hover:cursor-pointer'/>
                        
                    </fieldset>
                    <div className='flex text-center mt-2'>
                        <div className='flex items-center'>
                            <input 
                                type="checkbox" 
                                className='h-5 w-5 hover:cursor-pointer accent-gray-600'
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            
                        </div>
                        <h1 className='text-gray-800 ml-2 text-md'>Remember me</h1>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    
                    <button type="submit" className="mt-4 text-md w-full bg-[#097204] text-white font-bold py-2 px-4 rounded-md hover:bg-[#097204c4] hover:cursor-pointer transition">Login</button>
                    <div className='mt-5 flex justify-center text-md'>
                       <p>Don't have an account? <Link to='/signin' className='text-[#097204] hover:cursor-pointer '>Sign Up</Link></p> 
                    </div>
                </form> 
                
            </div>
        
        </div>

    )

}

export default Login