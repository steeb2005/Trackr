import { useState, useEffect } from 'react';
import Close from '../pages/styles/assets/close-svgrepo-com.svg';

function TaskNoteModal({ task, onClose, onSaveNote, existingNotes = [], onDeleteNote }) {
    const [notes, setNotes] = useState(existingNotes);
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        setNotes(existingNotes);
    }, [existingNotes]);

    const handleAddNote = () => {
        if (newNote.trim()) {
            const updated = [...notes, newNote.trim()];
            setNotes(updated);
            onSaveNote(updated);
            setNewNote('');
        }
    };

    const handleDeleteNote = (index) => {
        const updated = notes.filter((_, i) => i !== index);
        setNotes(updated);
        onDeleteNote?.(index); 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div 
                className="bg-white rounded-lg shadow-xl w-4/5 max-w-md p-6 overflow-y-auto max-h-150"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Note: {task.title}</h2>
                    <img src={Close} alt="close" className="h-6 cursor-pointer" onClick={onClose} />
                </div>

                <div className="note-list mb-4">
                    {notes.length === 0 ? (
                        <p className="text-gray-500">No notes yet.</p>
                    ) : (
                        notes.map((note, idx) => (
                            <div key={idx} className="bg-white p-3 mb-2 rounded-xl flex justify-between items-start border border-yellow-300">
                                <p className="flex-1">{note}</p>
                                <button 
                                    onClick={() => handleDeleteNote(idx)}
                                    className="hover:cursor-pointer text-red-500 ml-2 hover:text-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="bg-gray-100 w-full p-3 border border-gray-300 focus:outline-gray-400 rounded-lg resize-none"
                    rows="3"
                />
                <button
                    onClick={handleAddNote}
                    className=" mt-3 w-full bg-[#097204] text-white py-2 rounded-lg hover:bg-[#097204]/80 hover:cursor-pointer"
                >
                    Add Note
                </button>
            </div>
        </div>
    );
}

export default TaskNoteModal;