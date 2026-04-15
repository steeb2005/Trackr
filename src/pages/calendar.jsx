import { useState } from 'react';
import Header from '../components/header'
import Sidebar from '../components/sidebar'
import { useSidebar } from '../hooks/useSidebar'
import Next from './styles/assets/next-svgrepo-com.svg'
import Prev from './styles/assets/previous-svgrepo-com.svg'
import DateComponent from '../components/dateComp';

function Calendar(){

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ];

    const { isOpen, openSidebar, closeSidebar } = useSidebar();
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null); 
  

    const [showDateModal, setShowDateModal] = useState(false);
    const [selectedDayData, setSelectedDayData] = useState({year:null, month:null, day:null});
    
    


    const getDaysinMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    }

    const getFirstDay = (year, month) =>{
        return new Date(year, month, 1).getDay();
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysinMonth(year, month);
    const firstDay = getFirstDay(year, month);

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    }

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    }

    
    const isToday = (year, month, day) => {
        const today = new Date();
        return today.getFullYear() == year && today.getMonth() == month && today.getDate() == day;
    }

    const backToCurrentDay = () =>{
        setCurrentDate(new Date());
    }
    
    const calendarDays = [];
    for(let i = 0; i < firstDay; i++){
        calendarDays.push(null);
    }

    for(let day = 1; day <= daysInMonth; day++){
        calendarDays.push(day);
    }

    const handleCloseModal = () => {
        setShowDateModal(false);
        setSelectedDate(null);
    }

    const handleDateClick = (day) => {
        const datekey = `${year}-${month + 1}-${day}`;
        setSelectedDate(datekey);
        setSelectedDayData({year: year, month:monthNames[month], day: day});
        setShowDateModal(true);  // Shows the modal when the date cell is clicked 
    }
             
    // Notes Component part
    const [notes, setNotes] = useState({});

    const handleSaveNotes = (dateKey, noteList) => {
        setNotes(prevNotes => ({
            ...prevNotes,
            [dateKey]: noteList
        }));
    };
    
    const getNotesForDate = (datekey) => {
        return notes[datekey] || [];
    }

    

    return(

        <div className="bg-white h-screen m-0 p-0">
        
            {/* Sidebar Section */}
            <Sidebar isOpen={isOpen} onClose={closeSidebar}/> 

            {/* Header Section*/}
            <Header onOpenSidebar={openSidebar}/> 



            {/* Main Calendar Container */}
            <div className="flex flex-col md:flex-row gap-6 pt-25 h-96">

                {/* Date Component */}
                {showDateModal && 
                    (<DateComponent 
                    year = {selectedDayData.year} 
                    month = {selectedDayData.month}
                    day = {selectedDayData.day}
                    onClose={handleCloseModal}
                    onSaveNote={(noteList) => handleSaveNotes(selectedDate, noteList)}
                    existingNotes={getNotesForDate(selectedDate)}/>)}

                {/* Sub Calendar Container */}
                <div className="flex-1 w-full md:w-auto px-5">

                    {/* Main header */}
                    <div className='date-header flex justify-between items-center px-5'>
                        <h2 
                            className='hover:cursor-pointer text-2xl font-bold text-gray-900 xl:text-4xl'
                            onClick={backToCurrentDay}>
                                {monthNames[month]} {year}
                        </h2>

                        <div className='button-section flex gap-5'>
                            <button 
                                onClick={prevMonth}
                                className='bg-white border-1 border-gray-300 px-5 py-3 rounded-xl flex justify-center shadow-md hover:bg-gray-100 hover:cursor-pointer'>
                                <img src={Prev} alt="next_svg" className='h-5 md:h-7'/>
                            </button>

                            <button 
                                onClick={nextMonth}
                                className='bg-white border-1 border-gray-300 px-5 py-3 rounded-xl flex justify-center shadow-md hover:bg-gray-100 hover:cursor-pointer'>
                                <img src={Next} alt="prev_svg" className='h-5 md:h-7'/>
                            </button>
                        </div>
                    </div>

                    {/*  Days Header */}
                    <div className='grid grid-cols-7 items-center gap-3 text-xl text-gray-500 font-semibold mt-5'>
                        <div className='flex justify-center'>Sun</div>
                        <div className='flex justify-center '>Mon</div>
                        <div className='flex justify-center '>Tue</div>
                        <div className='flex justify-center '>Wed</div>
                        <div className='flex justify-center '>Thu</div>
                        <div className='flex justify-center '>Fri</div>
                        <div className='flex justify-center '>Sat</div>
                    </div>


                    {/* Days Calendar */}
                    <div className='grid grid-cols-7 grid-rows-6 items-center gap-4 mt-5 justify-items-center'>
                        {calendarDays.map((day, index) => {
                            const isCurrentDay = isToday(year, month, day); {/* Gives the current date cell a green ring */}                            
                            const datekey = day ? `${year}-${month + 1}-${day}` : null;
                            const hasNotes = datekey && notes[datekey]?.length > 0;

                            return (
                                <div
                                    onClick={() => day && handleDateClick(day)}
                                    key={index}
                                    className={`
                                        text-xl w-12 h-13 md:w-13 md:h-14 xl:w-16 xl:h-16 xl:text-2xl border rounded-xl shadow-md/20 flex justify-center flex-col items-center 
                                        ${day ? 'border-gray-400  bg-white hover:cursor-pointer hover:bg-gray-100' : 'bg-gray-200 border-0'}
                                        ${isCurrentDay ? 'ring-2 ring-[#097204]' : ''}
                                        ${hasNotes ? 'border-yellow-400 border-2' : ''}
                                        `}  
                                >
                                    <span className='mb-2'>
                                        {day}
                                    </span>
                                    
                                </div>
                            )
                            
                        })}
                        
                        

                    </div>
                    
                </div>



                {/* Legends Container */}
                <div className="w-full md:max-w-130 flex px-5 flex-col">
                    {/* Legends */}
                    <h1 className='text-xl font-bold text-gray-600 mb-5'>TASK CATEGORIES</h1>

                    <div className='gap-3 border border-gray-300 rounded-xl py-5 px-6 shadow-md/20 grid grid-cols-2'>
                        <div className='flex flex-row items-center text-xl gap-4 mb-3'>
                            <div className='bg-[#4C6DF0] h-8 w-8 rounded-full '></div>
                            Work
                        </div>
                        <div className='flex flex-row items-center text-xl gap-4 mb-3'>
                            <div className='bg-[#5FF652] h-8 w-8 rounded-full '></div>
                            Personal
                        </div>
                        <div className='flex flex-row items-center text-xl gap-4 mb-3'>
                            <div className='bg-[#AC2DCC] h-8 w-8 rounded-full '></div>
                            Health
                        </div>
                        <div className='flex flex-row items-center text-xl gap-4 mb-3'>
                            <div className='bg-[#FF8710] h-8 w-8 rounded-full '></div>
                            Study
                        </div>
                        <div className='flex flex-row items-center text-xl gap-4 mb-3'>
                            <div className='bg-[#FF02A2] h-8 w-8 rounded-full '></div>
                            Finance
                        </div>
                        <div className='flex flex-row items-center text-xl gap-4 mb-3'>
                            <div className='bg-[#FFE204] h-8 w-8 rounded-full '></div>
                            Events
                        </div>
                        <div className='flex flex-row items-center text-xl gap-4 mb-3'>
                            <div className='bg-[#ACACAC] h-8 w-8 rounded-full '></div>
                            Completed
                        </div>
                        <div className='flex flex-row items-center text-xl gap-4 mb-3'>
                            <div className='bg-[#FF3538] h-8 w-8 rounded-full '></div>
                            Overdue
                        </div>
                    </div>
                    
                </div>
            </div>



        </div>
    )
}


export default Calendar