import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : [];
    });


    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('notes');
        return saved ? JSON.parse(saved) : {};
    });


    const [diaryEntries, setDiaryEntries] = useState(() => {
        const saved = localStorage.getItem('diaryEntries');
        return saved ? JSON.parse(saved) : [];
    });

    
    const [taskNotes, setTaskNotes] = useState(() => {
        const saved = localStorage.getItem('taskNotes');
        return saved ? JSON.parse(saved) : {};
    })

    // For Task Notes
    useEffect(() => {
        localStorage.setItem('taskNotes', JSON.stringify(taskNotes));
    }, [taskNotes]);


    // For diary entries
    useEffect(() => {
        localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    }, [diaryEntries]);

    
    // For notes
    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    // Persist to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Listen for storage changes from other tabs/instances
    useEffect(() => {
        const handleStorageChange = () => {
            const savedTaskNotes = localStorage.getItem('taskNotes');
            if(savedTaskNotes){
                setTaskNotes(JSON.parse(savedTaskNotes));  
            } 

            const savedDiary = localStorage.getItem('diaryEntries');
            if(savedDiary){
                setDiaryEntries(JSON.parse(savedDiary));
            }

            const savedTasks = localStorage.getItem('tasks');
            if (savedTasks) {
                setTasks(JSON.parse(savedTasks));
            }

            const savedNotes = localStorage.getItem('notes');
            if(savedNotes){
                setNotes(JSON.parse(savedNotes));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);



    const saveTaskNotes = useCallback((taskId, noteList) => {
        setTaskNotes(prev => ({
            ...prev,
            [taskId]: noteList
        }));
    }, []);

    const deleteTaskNote = useCallback((taskId, indexToDelete) => {
        setTaskNotes(prev => {
            const notes = prev[taskId] || [];
            const updated = notes.filter((_, i) => i !== indexToDelete);
            return { ...prev, [taskId]: updated };
        });
    }, []);



    const addDiaryEntry = useCallback((entry) => {
        setDiaryEntries(prev => [...prev, {...entry, id: Date.now(), date: new Date().toISOString()}]);

    }, []);

    const deleteDiaryEntry = useCallback((entryId) => {
        setDiaryEntries(prev => prev.filter(entry => entry.id !== entryId));
    }, []);




    const saveNotes = useCallback((datekey, noteList) => {
        setNotes(prev => ({
            ...prev, 
            [datekey]: noteList
        }));
    }, []);

    const deleteNote = useCallback((datekey, indexToDelete) => {
        setNotes(prev => {
            const notesForDate = prev[datekey] || [];
            const updated = notesForDate.filter((_, i) => i !== indexToDelete);
            return { ...prev, [datekey]: updated};
        });
    }, []);



    const addTask = useCallback((task) => {
        setTasks(prev => [...prev, { ...task, id: Date.now() }]);
    }, []);

    const deleteTask = useCallback((taskId) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    }, []);

    const toggleTaskComplete = useCallback((taskId) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? {
                ...task,
                isComplete: !task.isComplete,
                completedAt: !task.isComplete ? new Date().toISOString() : null
            } : task
        ));
    }, []);

    const updateTask = useCallback((taskId, updates) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
        ));
    }, []);


    const value = {
        tasks,
        setTasks,
        addTask,
        deleteTask,
        toggleTaskComplete,
        updateTask,
        notes,
        saveNotes,
        deleteNote,
        diaryEntries,
        addDiaryEntry,
        deleteDiaryEntry,
        taskNotes,
        saveTaskNotes,
        deleteTaskNote
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}
