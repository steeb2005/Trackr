import { Link, useNavigate } from 'react-router-dom';

function App(){
    const navigate = useNavigate();

    const handleSubmit = (e) => {   {/*Temporary Sumbit handler since there is no backend for emails and passwords*/}
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="flex justify-center flex-col items-center bg-[#097204] min-h-screen">     
            <div className="header-container pb-10 ">
                <h1 className="text-5xl text-white font-bold">Welcome, <br /> Login!</h1>
            </div>
    
            <div className="text-md md:text-sm login-container bg-white p-8 rounded-lg w-full max-w-md">
                
                <form onSubmit={handleSubmit}>   
                    <fieldset className="border border-gray-300 rounded-md p-3 mb-4 focus-within:border-[#097204] transition-colors">
                        <legend className="text-md md:text-sm font-semibold text-gray-600 px-1">Email</legend>
                        <input type="email" id="email" className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent" placeholder="Enter your email"></input>
                    </fieldset>
                    <fieldset className="border border-gray-300 rounded-md p-3 mb-4 focus-within:border-[#097204] transition-colors">
                        <legend className="text-md md:text-sm font-semibold text-gray-600 px-1">Password</legend>
                        <input type="password" id="password" className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent" placeholder="Enter your password"></input>
                    </fieldset>
                    
                    <button type="submit" className="mt-4 text-xl w-full bg-[#097204] text-white font-bold py-4 px-4 rounded-md hover:bg-[#097204c4] hover:cursor-pointer transition">Login</button>
                </form> 
                
            </div>
        
        </div>

    )

}

export default App