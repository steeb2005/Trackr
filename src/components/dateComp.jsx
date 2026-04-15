import Close from '../pages/styles/assets/close-svgrepo-com.svg'
import { useState } from 'react';

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

function DateComponent( {year, month, day, onClose, onSaveNote, existingNotes = []} ) {

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

    return (
        <div class="border border-gray-300 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md z-50">
            <div className='overflow-y-auto max-h-150'> {/* Scrolls the page */}
                
                <div className='flex flex-row justify-between items-center'>
                    <h1 className='text-gray-900 font-semibold text-2xl'>{month} {day}, {year}</h1>
                    <div onClick={onClose} className='hover:cursor-pointer'>
                        <img src={Close} alt="close_svg" className='h-7'/>
                    </div>
                </div>
            
                <div className=''></div>  {/* Div to put the Tasks */}
                
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
    );
}


export default DateComponent

