import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

//const API_URL = '/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState({});
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [taskNotes, setTaskNotes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get(`${API_URL}/auth/me`, { signal: controller.signal })
                .then(res => {
                    setUser(res.data);
                    return fetchData(controller.signal);
                })
                .catch(err => {
                    if (err.name !== 'AbortError') {
                        localStorage.removeItem('token');
                        delete axios.defaults.headers.common['Authorization'];
                    }
                })
                .finally(() => {
                    if (!controller.signal.aborted) setLoading(false);
                });
        } else {
            setLoading(false);
        }
        return () => controller.abort();
    }, []);

    const fetchData = useCallback(async (signal = null) => {
        try {
            const [tasksRes, diaryRes, notesRes, taskNotesRes] = await Promise.all([
                axios.get(`${API_URL}/tasks`, { signal }),
                axios.get(`${API_URL}/diary`, { signal }),
                axios.get(`${API_URL}/notes`, { signal }),
                axios.get(`${API_URL}/task-notes`, { signal })
            ]);
            setTasks(tasksRes.data);
            setDiaryEntries(diaryRes.data);
            setNotes(notesRes.data.notes || {});
            setTaskNotes(taskNotesRes.data.taskNotes || {});
        } catch (err) {
            if (err.name !== 'AbortError') setError(err.message);
        }
    }, []);

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

    const addTask = useCallback(async (task) => {
        const tempId = `temp-${Date.now()}`;
        const tempTask = { ...task, id: tempId };
        
        setTasks(prev => [...prev, tempTask]); // instant
        try {
            const response = await axios.post(`${API_URL}/tasks`, task);
            // replace temp task with real one from DB (gets real id)
            setTasks(prev => prev.map(t => t.id === tempId ? response.data : t));
        } catch (err) {
            setTasks(prev => prev.filter(t => t.id !== tempId)); // rollback
            setError(err.message);
        }
    }, []);

    const deleteTask = useCallback(async (taskId) => {
        const prev = tasks; // snapshot for rollback
        setTasks(p => p.filter(t => t.id !== taskId)); // instant
        try {
            await axios.delete(`${API_URL}/tasks/${taskId}`);
        } catch (err) {
            setTasks(prev); // rollback
            setError(err.message);
        }
    }, [tasks]);

    const toggleTaskComplete = useCallback(async (taskId) => {
        const prevTasks = tasks;
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        const updates = {
            isComplete: !task.isComplete,
            completedAt: !task.isComplete ? new Date().toISOString() : null
        };
        setTasks(p => p.map(t => t.id === taskId ? { ...t, ...updates } : t)); // instant
        try {
            const response = await axios.put(`${API_URL}/tasks/${taskId}`, updates);
            setTasks(p => p.map(t => t.id === taskId ? response.data : t));
        } catch (err) {
            setTasks(prevTasks); // rollback
            setError(err.message);
        }
    }, [tasks]);

    const updateTask = useCallback(async (taskId, updates) => {
        const prevTasks = tasks;
        setTasks(p => p.map(t => t.id === taskId ? { ...t, ...updates } : t)); // instant
        try {
            const response = await axios.put(`${API_URL}/tasks/${taskId}`, updates);
            setTasks(p => p.map(t => t.id === taskId ? response.data : t));
        } catch (err) {
            setTasks(prevTasks); // rollback
            setError(err.message);
        }
    }, [tasks]);

    const saveNotes = useCallback(async (datekey, noteList) => {
        const prevNotes = notes;
        setNotes(prev => ({ ...prev, [datekey]: noteList })); // instant
        try {
            await axios.post(`${API_URL}/notes`, { date: datekey, content: noteList });
        } catch (err) {
            setNotes(prevNotes); // rollback
            setError(err.message);
        }
    }, [notes]);

    const deleteNote = useCallback(async (datekey, indexToDelete) => {
        const prevNotes = notes;
        const currentNotes = notes[datekey] || [];
        const noteToDelete = currentNotes[indexToDelete];
        if (!noteToDelete) return;
        setNotes(prev => {
            const updated = (prev[datekey] || []).filter((_, i) => i !== indexToDelete);
            return { ...prev, [datekey]: updated };
        }); // instant
        try {
            await axios.delete(`${API_URL}/notes`, { data: { date: datekey, content: noteToDelete } });
        } catch (err) {
            setNotes(prevNotes); // rollback
            setError(err.message);
        }
    }, [notes]);

    const addDiaryEntry = useCallback(async (entry) => {
        const tempId = `temp-${Date.now()}`;
        const tempEntry = { ...entry, id: tempId, date: new Date().toISOString() };
        setDiaryEntries(prev => [...prev, tempEntry]); // instant
        try {
            const response = await axios.post(`${API_URL}/diary`, tempEntry);
            setDiaryEntries(prev => prev.map(e => e.id === tempId ? response.data : e));
        } catch (err) {
            setDiaryEntries(prev => prev.filter(e => e.id !== tempId)); // rollback
            setError(err.message);
        }
    }, []);

    const deleteDiaryEntry = useCallback(async (entryId) => {
        const prevEntries = diaryEntries;
        setDiaryEntries(prev => prev.filter(e => e.id !== entryId)); // instant
        try {
            await axios.delete(`${API_URL}/diary/${entryId}`);
        } catch (err) {
            setDiaryEntries(prevEntries); // rollback
            setError(err.message);
        }
    }, [diaryEntries]);

    const saveTaskNotes = useCallback(async (taskId, noteList) => {
        const prevTaskNotes = taskNotes;
        setTaskNotes(prev => ({ ...prev, [taskId]: noteList })); // instant
        try {
            await axios.post(`${API_URL}/task-notes`, { taskId, content: noteList });
        } catch (err) {
            setTaskNotes(prevTaskNotes); // rollback
            setError(err.message);
        }
    }, [taskNotes]);

    const deleteTaskNote = useCallback(async (taskId, indexToDelete) => {
        const prevTaskNotes = taskNotes;
        const currentNotes = taskNotes[taskId] || [];
        const noteToDelete = currentNotes[indexToDelete];
        if (!noteToDelete) return;
        setTaskNotes(prev => {
            const updated = (prev[taskId] || []).filter((_, i) => i !== indexToDelete);
            return { ...prev, [taskId]: updated };
        }); // instant
        try {
            await axios.delete(`${API_URL}/task-notes`, { data: { taskId, content: noteToDelete } });
        } catch (err) {
            setTaskNotes(prevTaskNotes); // rollback
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