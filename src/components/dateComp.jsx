import Close from '../pages/styles/assets/close-svgrepo-com.svg'
import { useState } from 'react';
import { useEffect } from 'react';
import { isOverdue } from '../hooks/checkOverdue';

function NoteEntry({note, onDelete}){
    return(
        <div className='note bg-white border border-yellow-300 w-full p-3 mb-5 rounded-xl hover:cursor-pointer'>
            <span>
                {note}
            </span>
            <div className='flex justify-end'>
                <img src={Close} onClick={onDelete} alt="close_svg" className='h-5'/>
            </div>
        </div>
    )
}


function TaskEntryCalendar({ task, onToggleComplete}){    
    const categoryColor = {
        work: 'bg-[#4C6DF0]',
        personal: 'bg-[#5FF652]',
        health: 'bg-[#AC2DCC]',
        study: 'bg-[#FF8710]',
        finance: 'bg-[#FF02A2]',
        events: 'bg-[#FFE204]' 
    }    

    return(
        <div key={task.id} className={`flex min-h-20 ${task.isComplete ? 'bg-gray-600' : isOverdue(task.dueDate) ? 'bg-[#FF3538]' : categoryColor[task.category]} rounded-xl shadow-md mb-5`}> 
            <div className={`bg-gray-50 w-full ml-2 rounded-lg`}>
                <div className="flex items-start gap-3 p-6">
                    <div className="mt-1 items-center bg-gray-600  flex justify-center accent-gray-700 outline-none text-white rounded p-1 text-xs">
                        <input 
                            type="checkbox"
                            checked={task.isComplete}
                            onChange={() => onToggleComplete(task.id)}
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 ">{task.title}</h2>
                        <p className="text-gray-600 text-xl">{task.description}</p>
                        <h1 className='text-red-600 font-semibold'>{isOverdue(task.dueDate) ? 'overdue' : ''}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DateComponent( {year, month, day, onClose, onSaveNote, existingNotes = [], tasks = [], toggleTaskComplete} ) {
    
    // When tasks are changed, it will save in localstorage
    /*
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);
    */

    const [notes, setNotes] = useState(existingNotes);
    const [newNote, setNewNote] = useState('');

    const handleAddNote = () => {
        if(newNote.trim()) {
            const updatedNotes = [...notes, newNote.trim()];
            setNotes(updatedNotes);
            onSaveNote(updatedNotes);
            setNewNote(''); // Clears the input
        }
    };

    const handleDeleteNote = (indexToDelete) => {
        const updatedNotes = notes.filter((_, index) => index !== indexToDelete);
        setNotes(updatedNotes);
        onSaveNote(updatedNotes); // Save to parent component
    };

    const categoryColor = {
        work: 'bg-[#4C6DF0]',
        personal: 'bg-[#5FF652]',
        health: 'bg-[#AC2DCC]',
        study: 'bg-[#FF8710]',
        finance: 'bg-[#FF02A2]',
        events: 'bg-[#FFE204]' 
    }    

    return (
        <div className='fixed inset-0 z-40 bg-black/30'> {/* prevents background clicks */}
            <div className="border border-gray-300 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md z-50">
                <div className='overflow-y-auto max-h-150'> {/* Scrolls the page */}
                    
                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='text-gray-900 font-semibold text-2xl'>{month} {day}, {year}</h1>
                        <div onClick={onClose} className='hover:cursor-pointer'>
                            <img src={Close} alt="close_svg" className='h-7'/>
                        </div>
                    </div>
                    
                    
                    {/* Div to put the Tasks */}
                    {tasks.length > 0 && (
                        <div className='task-section'>

                            <h1 className='text-xl text-gray-500 font-semibold mt-3 mb-3'>Tasks</h1>                    
                            {tasks.map(task => (
                            <TaskEntryCalendar key={task.id} task={task} onToggleComplete={toggleTaskComplete}/> 
                            ))}  

                        </div>
                        
                        
                    )}
                    

                    <h1 className='text-xl text-gray-500 font-semibold mt-3 mb-3'>Notes</h1>
                    
                    <div className='note-section'> {/* Container to put the notes */}
                        {notes.length === 0 ? (
                            ''
                        ) : (
                            notes.map((note, index) => (
                                <NoteEntry 
                                    key={index}
                                    note = {note}
                                    onDelete={() => handleDeleteNote(index)}
                                />
                            ))
                        )}
                    </div>  

                    <textarea 
                        rows="3" 
                        className='focus:outline-gray-400 flex w-full min-h-20 bg-gray-100 p-3 border border-gray-300 rounded-xl mt-2' 
                        placeholder='Add a note for this date...'
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}/>
                    <div className='flex justify-center mt-5'>
                        <button 
                            className='text-white text-md px-26 py-2 bg-[#097204] rounded-4xl hover:cursor-pointer hover:bg-[#097204]/70'
                            onClick={handleAddNote}>Add Note</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default DateComponent


/*
{tasks.map(task => (
    <div key={task.id} className={`flex min-h-20 ${task.isComplete ? 'bg-gray-600' : categoryColor[task.category]} rounded-xl shadow-md mb-5`}> 
        <div className={`bg-gray-50 w-full ml-2 rounded-lg`}>
            <div className="flex items-start gap-3 p-6">
                <div className="mt-1 items-center bg-gray-600  flex justify-center accent-gray-700 outline-none text-white rounded p-1 text-xs">
                    <input 
                        type="checkbox"
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 ">{task.title}</h2>
                    <p className="text-gray-600 text-xl">{task.description}</p>
                </div>
            </div>
        </div>
    </div>
))}
*/