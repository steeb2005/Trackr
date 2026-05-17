import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Burger from './styles/assets/burger-menu-svgrepo-com.svg';
import Check from './styles/assets/circle-check-filled-svgrepo-com.svg';
import Target from './styles/assets/target-svgrepo-com.svg';
import Header from '../components/header';
import { useSidebar } from '../hooks/useSidebar';
import { useTasks } from '../context/TaskContext';
import LowPriority from './styles/assets/lowflag-svgrepo-com.svg';
import MediumPriority from './styles/assets/mediumflag-svgrepo-com.svg';
import HighPriority from './styles/assets/highflag-svgrepo-com.svg';
import CriticalPriority from './styles/assets/criticalflag-svgrepo-com.svg';
import { isOverdue } from '../hooks/checkOverdue';
import Alert from './styles/assets/alert-svgrepo-com.svg'
import { HashLink } from 'react-router-hash-link';

/*
TODO:
    - Fix DatePick css missing in createTask (on deployed) (Done)
    - Fix dashboard status bar going full green despite no tasks listed (DONE)
    - Add Notes for TaskEntry (DONE)
    - Add Edit on TaskEntry (DONE)
    - Be able to save notes (DONE)
    - Finish Diary Page (DONE)
    - Fix login/Signin for mobile (DONE)
    - Add Login/SignIn function (DONE)
    - Implement backend for each user (DONE)
    
    - Make server usable in vercel using vercels serverless function 
        or deploy backend to railway and frontend to vercel (DONE)
*/


const quotes = [
    // --- BIBLICAL WISDOM (Original 15) ---
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
    "And we know that in all things God works for the good of those who love him, who have been called according to his purpose. - Romans 8:28",

    // --- PHILOSOPHERS & THINKERS ---
    "The only true wisdom is in knowing you know nothing. - Socrates",
    "Knowing yourself is the beginning of all wisdom. - Aristotle",
    "He who has a why to live for can bear almost any how. - Friedrich Nietzsche",
    "Our life is what our thoughts make it. - Marcus Aurelius",
    "In the middle of every difficulty lies opportunity. - Albert Einstein",
    "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does. - Jean-Paul Sartre",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit. - Will Durant",
    "Waste no more time arguing about what a good man should be. Be one. - Marcus Aurelius",
    "Life is not a problem to be solved, but a reality to be experienced. - Søren Kierkegaard",
    "I think, therefore I am. - René Descartes",

    // --- LEADERS & HISTORICAL FIGURES ---
    "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that. - Martin Luther King Jr.",
    "Do what you can, with what you have, where you are. - Theodore Roosevelt",
    "I have not failed. I've just found 10,000 ways that won't work. - Thomas Edison",
    "The only thing we have to fear is fear itself. - Franklin D. Roosevelt",
    "You must be the change you wish to see in the world. - Mahatma Gandhi",
    "Spread love everywhere you go. Let no one ever come to you without leaving happier. - Mother Teresa",
    "Whatever you are, be a good one. - Abraham Lincoln",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",

    // --- LITERARY & MODERN WISDOM ---
    "Not all those who wander are lost. - J.R.R. Tolkien",
    "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. - Ralph Waldo Emerson",
    "It is never too late to be what you might have been. - George Eliot",
    "There is no greater agony than bearing an untold story inside you. - Maya Angelou",
    "Life is what happens when you're making other plans. - John Lennon",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Everything you’ve ever wanted is on the other side of fear. - George Addair",
    "The journey of a thousand miles begins with one step. - Lao Tzu",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The best way to predict the future is to create it. - Peter Drucker",
    "To love and be loved is to feel the sun from both sides. - David Viscott",
    "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela"
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













function Dashboard(){    

    const quote = useQuote();
    const formattedDate = useFormattedDate();


    const { isOpen, openSidebar, closeSidebar } = useSidebar(); // This gets the hooks from useSidebar.jsx


    const { tasks, user } = useTasks();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // check if the date is in the current month
    const isInCurrentMonth = (dateString) => {
        const date = new Date(dateString);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    };

    // gets the total tasks this month
    const tasksThisMonth = tasks.filter(task => isInCurrentMonth(task.dueDate));

    // gets the total ACTIVE tasks this month
    const activeThisMonth = tasks.filter(task =>
        isInCurrentMonth(task.dueDate) && !task.isComplete
    );

    
    const completedThisMonth = tasks.filter(task => {
        return task.isComplete && isInCurrentMonth(task.dueDate);
    });

    /*
        if (!task.isComplete) return false;
        const completionDate = task.completedAt || task.createdAt;
        return isInCurrentMonth(completionDate);
    */


    // gets todays tasks
    const todayTasksTotal= tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
    });

    /*  GETS THE COUNT OF TASKS COMPLETED TODAY. Regardless if they are another date

    const completedToday = tasks.filter(task => {
        if(!task.isComplete || !task.completedAt) return false;
        if(isOverdue(task.dueDate)) return false;
        const completedDate = new Date(task.completedAt);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === today.getTime();
    });
    */

    // Gets todays active tasks
    const todayActiveTasks = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime() && !task.isComplete;
    });

    const tasksDueToday = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
    });

    const completedToday = tasksDueToday.filter(task => task.isComplete); 


    const totalOverdueTasks = tasks.filter(task => isOverdue(task.dueDate) && !task.isComplete).length;

    // gets the total completed tasks
    const totalCompleted = tasks.filter(task => task.isComplete).length;
    // gets the active tasks total
    const totalActiveTasks = tasks.filter(task => !task.isComplete).length;


    const categoryColor = {
        work: 'bg-[#4C6DF0]',
        personal: 'bg-[#5FF652]',
        health: 'bg-[#AC2DCC]',
        study: 'bg-[#FF8710]',
        finance: 'bg-[#FF02A2]',
        events: 'bg-[#FFE204]' 
    }


    
    const priorityFlag = {
        low: LowPriority,
        medium:  MediumPriority,
        high: HighPriority,
        critical: CriticalPriority
    };

    
    return (
        <div className="bg-white m-0 p-0">

            {/* Sidebar Section */}
            <Sidebar isOpen={isOpen} onClose={closeSidebar}/> 

            {/* Header Section*/}
            <Header onOpenSidebar={openSidebar}/> 
            

            <div className="h-screen overflow-auto main-container pt-22 px-8 grid grid-cols-1 gap-4">

                <div className="card">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Welcome {user.name}</h2>
                    <p className="text-gray-600 text-lg">{formattedDate}</p>
                </div>

                <div className="card bg-[#097204] px-8 py-5 rounded-lg shadow-md mt-2 shadow-amber-500">
                    <h2 className="text-2xl font-semibold text-white">Daily Quotes</h2>
                    <p className="text-md text-white mt-4">{quote}</p>
                </div>
                <h1 className='text-3xl mt-3 mb-5 font-bold text-gray-800'>Your Progress</h1>
            
            
                <div className="card p-4 rounded-lg border-[#097204] border">
                    <div className='flex justify-between items-center'>
                        <h2 className="text-xl font-semibold text-gray-800">Todays Tasks</h2>
                        <div className='px-4 py-1 rounded-full bg-gray-300 justitfy-center text-md font-semibold'>{completedToday.length}/{todayTasksTotal.length}</div>
                    </div>

                    {/* Progress Bar Portion*/}
                    <div className='bar w-full h-3 mt-2 rounded-xl bg-gray-400'>
                        <div className='bg-[#097204] h-full rounded-xl duration-300' style={ todayTasksTotal.length === 0 ? {width: 0} : {width: `${(completedToday.length / todayTasksTotal.length) * 100}%`} }></div>
                    </div>

                    <div className='tasks-displayer'>
                        {todayActiveTasks.length > 0 ?(
                            <>
                            <h1 className='text-gray-500 mt-2'>Tasks Due Today:</h1>
                            <ul className='mt-1'>
                                {todayActiveTasks.map(task => (
                                    <HashLink smooth to={`/tasklist/#${task.id}`}>
                                        <li className='whitespace-nowrap flex items-center mt-2 bg-gray-300 hover:bg-gray-200 rounded-md px-3 py-1'>
                                            <img src={priorityFlag[task.priority]} alt="priority_flag" className='w-5 h-5 mr-5'/>
                                            <div className={`w-3 h-3 ${categoryColor[task.category]} rounded-full mr-2`}></div>
                                            <p className='w-full overflow-hidden text-ellipsis font-semibold text-md md:text-lg'>{task.title}</p>
                                        </li>    
                                    </HashLink>
                                ))}
                            </ul> 
                            </>
                        ) : <p className="text-gray-600 mt-2">No tasks for today</p>}
                        
                    </div>
                </div>


                <div className="card p-4 rounded-lg border-[#097204] border">
                    <div className='flex justify-between items-center'>
                        <h2 className="text-xl font-semibold text-gray-800">Overall Progress</h2>
                        <div className='px-4 py-1 rounded-full bg-gray-300 justitfy-center text-md font-semibold'>{completedThisMonth.length}/{tasksThisMonth.length}</div>
                    </div>

                    {/* Progress Bar Portion*/}
                    <div className='bar w-full h-3 mt-2 rounded-xl bg-gray-400'>
                        <div className='bg-[#097204] h-full rounded-xl duration-300' style={tasksThisMonth.length === 0 ? {width: 0} : {width: `${(completedThisMonth.length / tasksThisMonth.length) * 100}%`} }></div>
                    </div>
                    <p className="text-gray-600 mt-2">Total completions for the month</p>
                </div>
                    
                <div className='grid grid-cols-2 md:grid-cols-1 gap-4 mb-10'>
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

                    <div className='w-full bg-red-500 p-5 rounded-xl col-span-2 md:col-span-1'>
                        <img src={Alert} alt="Target_img" className='h-10 w-10 '/>
                        <h1 className='mt-2 mb-2 font-bold text-5xl'>{totalOverdueTasks}</h1>
                        <p className='font-semibold text-gray-900'>Total Overdue</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard