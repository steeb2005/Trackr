import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Burger from './styles/assets/burger-menu-svgrepo-com.svg';
import Check from './styles/assets/circle-check-filled-svgrepo-com.svg';
import Target from './styles/assets/target-svgrepo-com.svg';
import Header from '../components/header';
import { useSidebar } from '../hooks/useSidebar';

const quotes = [
        "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope. - Jeremiah 29:11",
        "I can do all things through him who strengthens me. - Philippians 4:13",
        "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths. - Proverbs 3:5-6",
        "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. - Philippians 4:6",
        "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. - Psalm 23:1-3",        
        "Be strong and courageous. Do not fear or be in dread of them, for it is the Lord your God who goes with you. He will not leave you or forsake you. - Deuteronomy 31:6",
        "Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It does not insist on its own way; it is not irritable or resentful. - 1 Corinthians 13:4-5",
        "Cast all your anxiety on him because he cares for you. - 1 Peter 5:7", 
        "But seek first the kingdom of God and his righteousness, and all these things will be added to you. - Matthew 6:33",
        "Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go. - Joshua 1:9",
        "Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you. - 1 Thessalonians 5:16-18",
        "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come. - 2 Corinthians 5:17",
        "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control; against such things there is no law. - Galatians 5:22-23",
        "Come to me, all who labor and are heavy laden, and I will give you rest. Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls. - Matthew 11:28-29",
        "And we know that in all things God works for the good of those who love him, who have been called according to his purpose. - Romans 8:28"
];





function useQuote(){
    const [quote, setQuote] = useState("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

    return quote;
}





function useFormattedDate(){
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    return formattedDate;
}









function useProgressBar(initialProgress = 0){    
    const [progress, setProgress] = useState(0);

    const increaseProgress = () => {
        if(progress < 100){
            setProgress(progress + 10);
        }
    }

    const resetProgress = () => {
        setProgress(0);
    }

    return {
        progress,
        increaseProgress,
        resetProgress
    };
}








function Dashboard(){    
    const quote = useQuote();
    const formattedDate = useFormattedDate();

    const {progress, increaseProgress, resetProgress} = useProgressBar(0);
    const { isOpen, openSidebar, closeSidebar } = useSidebar(); // This gets the hooks from useSidebar.jsx

    return (
        <div className="bg-white h-screen m-0 p-0">

            {/* Sidebar Section */}
            <Sidebar isOpen={isOpen} onClose={closeSidebar}/> 

            {/* Header Section*/}
            <Header onOpenSidebar={openSidebar}/> 
            

            <div className="main-container px-8 pt-25 grid grid-cols-1 gap-4">

                <div className="card">
                    <h2 className="text-4xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-600 mt-2 text-2xl">{formattedDate}</p>
                </div>

                <div className="card bg-[#097204] px-10 py-6 rounded-lg shadow-md mt-2 shadow-amber-500">
                    <h2 className="text-2xl font-semibold text-white">Daily Quotes</h2>
                    <p className="text-xl text-white mt-4">{quote}</p>
                </div>
                <h1 className='text-3xl mt-3 mb-5 font-bold text-gray-800'>Your Progress</h1>
            
            
                <div className="card p-4 rounded-lg border-[#097204] border">
                    <div className='flex justify-between items-center'>
                        <h2 className="text-xl font-semibold text-gray-800">Todays Tasks</h2>
                        <div className='px-4 py-1 rounded-full bg-gray-300 justitfy-center text-md font-semibold'> {`${progress}`}/10 </div>
                    </div>

                    {/* Progress Bar Portion*/}
                    <div className='bar w-full h-3 mt-2 rounded-xl bg-gray-400'>
                        <div className='bg-[#097204] h-full rounded-xl duration-300' style={ {width: `${progress}%`} }></div>
                    </div>
                    <p className="text-gray-600 mt-2">No tasks for today</p>
                </div>


                <div className="card p-4 rounded-lg border-[#097204] border">
                    <div className='flex justify-between items-center'>
                        <h2 className="text-xl font-semibold text-gray-800">Overall Progress</h2>
                        <div className='px-4 py-1 rounded-full bg-gray-300 justitfy-center text-md font-semibold'> {`${progress}`}/10 </div>
                    </div>

                    {/* Progress Bar Portion*/}
                    <div className='bar w-full h-3 mt-2 rounded-xl bg-gray-400'>
                        <div className='bg-[#097204] h-full rounded-xl duration-300' style={ {width: `${progress}%`} }></div>
                    </div>
                    <p className="text-gray-600 mt-2">Total completions for the month</p>
                </div>
                    
                <div className='grid grid-cols-2 gap-6 mb-10'>
                    <div className='w-full bg-green-300 p-5 rounded-xl'>
                        <img src={Check} alt="Check_img" className='h-10 w-10'/>
                        <h1 className='mt-2 mb-2 font-bold text-5xl'>0</h1>
                        <p>Completed</p>
                    </div>

                    <div className='w-full bg-red-300 p-5 rounded-xl'>
                        <img src={Target} alt="Target_img" className='h-10 w-10 '/>
                        <h1 className='mt-2 mb-2 font-bold text-5xl'>0</h1>
                        <p>Remaining</p>
                    </div>
                </div>


                {/* Progress Test

                <button onClick={increaseProgress} className='bg-green-600 hover:cursor-pointer' > click me </button>
                <button className='bg-green-600 hover:cursor-pointer mt-10' onClick={resetProgress}> reset </button>
                */}

            </div>
        </div>
    )
}

export default Dashboard