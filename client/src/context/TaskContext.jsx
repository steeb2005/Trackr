import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = '/api';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState({});
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [taskNotes, setTaskNotes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // Check for existing token and load user
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/me`);
            setUser(res.data);
            await fetchData();
        } catch (err) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setError('Session expired');
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const [tasksRes, diaryRes] = await Promise.all([
                axios.get(`${API_URL}/tasks`),
                axios.get(`${API_URL}/diary`)
            ]);

            setTasks(tasksRes.data);
            setDiaryEntries(diaryRes.data);

            const notesRes = await axios.get(`${API_URL}/notes`);
            setNotes(notesRes.data.notes || {});

            const taskNotesRes = await axios.get(`${API_URL}/task-notes`);
            setTaskNotes(taskNotesRes.data.taskNotes || {});
        } catch (err) {
            setError(err.message);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { token, ...userData } = res.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        await fetchData();
        return userData;
    };

    const register = async (name, email, password) => {
        const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
        const { token, ...userData } = res.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        await fetchData();
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setTasks([]);
        setNotes({});
        setDiaryEntries([]);
        setTaskNotes({});
    };

    // Task operations
    const addTask = useCallback(async (task) => {
        try {
            const response = await axios.post(`${API_URL}/tasks`, task);
            setTasks(prev => [...prev, response.data]);
        } catch (err) {
            console.error('Failed to add task:', err);
            setError(err.message);
        }
    }, []);

    const deleteTask = useCallback(async (taskId) => {
        try {
            await axios.delete(`${API_URL}/tasks/${taskId}`);
            setTasks(prev => prev.filter(task => task.id !== taskId));
        } catch (err) {
            console.error('Failed to delete task:', err);
            setError(err.message);
        }
    }, []);

    const toggleTaskComplete = useCallback(async (taskId) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            const updates = {
                isComplete: !task.isComplete,
                completedAt: !task.isComplete ? new Date().toISOString() : null
            };

            const response = await axios.put(`${API_URL}/tasks/${taskId}`, updates);
            setTasks(prev => prev.map(t =>
                t.id === taskId ? response.data : t
            ));
        } catch (err) {
            console.error('Failed to toggle task:', err);
            setError(err.message);
        }
    }, [tasks]);

    const updateTask = useCallback(async (taskId, updates) => {
        try {
            const response = await axios.put(`${API_URL}/tasks/${taskId}`, updates);
            setTasks(prev => prev.map(t =>
                t.id === taskId ? response.data : t
            ));
        } catch (err) {
            console.error('Failed to update task:', err);
            setError(err.message);
        }
    }, []);

    // Notes operations (date-based)
    const saveNotes = useCallback(async (datekey, noteList) => {
        try {
            await axios.post(`${API_URL}/notes`, { date: datekey, content: noteList });
            setNotes(prev => ({
                ...prev,
                [datekey]: noteList
            }));
        } catch (err) {
            console.error('Failed to save notes:', err);
            setError(err.message);
        }
    }, []);

    const deleteNote = useCallback(async (datekey, indexToDelete) => {
        try {
            const currentNotes = notes[datekey] || [];
            const noteToDelete = currentNotes[indexToDelete];
            if (!noteToDelete) return;

            await axios.delete(`${API_URL}/notes`, {
                data: { date: datekey, content: noteToDelete }
            });

            setNotes(prev => {
                const updated = (prev[datekey] || []).filter((_, i) => i !== indexToDelete);
                return { ...prev, [datekey]: updated };
            });
        } catch (err) {
            console.error('Failed to delete note:', err);
            setError(err.message);
        }
    }, [notes]);

    // Diary operations
    const addDiaryEntry = useCallback(async (entry) => {
        try {
            const newEntry = {
                ...entry,
                id: Date.now(),
                date: new Date().toISOString()
            };
            const response = await axios.post(`${API_URL}/diary`, newEntry);
            setDiaryEntries(prev => [...prev, response.data]);
        } catch (err) {
            console.error('Failed to add diary entry:', err);
            setError(err.message);
        }
    }, []);

    const deleteDiaryEntry = useCallback(async (entryId) => {
        try {
            await axios.delete(`${API_URL}/diary/${entryId}`);
            setDiaryEntries(prev => prev.filter(entry => entry.id !== entryId));
        } catch (err) {
            console.error('Failed to delete diary entry:', err);
            setError(err.message);
        }
    }, []);

    /*
    const saveTaskNotes = useCallback(async (taskId, noteList) => {
        try {
            await axios.delete(`${API_URL}/task-notes`, {
                data: { taskId }
            });

            await Promise.all(
                noteList.map(note =>
                    axios.post(`${API_URL}/task-notes`, {
                        taskId,
                        content: note
                    })
                )
            );

            setTaskNotes(prev => ({
                ...prev,
                [taskId]: noteList
            }));
        } catch (err) {
            console.error('Failed to save task notes:', err);
            setError(err.message);
        }
    }, []);
    */
   
    // Task Notes operations
    const saveTaskNotes = useCallback(async (taskId, noteList) => {
        try {
            // Send the entire array in ONE request
            await axios.post(`${API_URL}/task-notes`, {
                taskId,
                content: noteList  // array, not individual strings
            });
            setTaskNotes(prev => ({
                ...prev,
                [taskId]: noteList
            }));
        } catch (err) {
            console.error('Failed to save task notes:', err);
            setError(err.message);
        }
    }, []);

    const deleteTaskNote = useCallback(async (taskId, indexToDelete) => {
        try {
            const currentNotes = taskNotes[taskId] || [];
            const noteToDelete = currentNotes[indexToDelete];
            if (!noteToDelete) return;

            await axios.delete(`${API_URL}/task-notes`, {
                data: { taskId, content: noteToDelete }
            });

            setTaskNotes(prev => {
                const updated = (prev[taskId] || []).filter((_, i) => i !== indexToDelete);
                return { ...prev, [taskId]: updated };
            });
        } catch (err) {
            console.error('Failed to delete task note:', err);
            setError(err.message);
        }
    }, [taskNotes]);

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
        deleteTaskNote,
        loading,
        error,
        user,
        login,
        register,
        logout
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
