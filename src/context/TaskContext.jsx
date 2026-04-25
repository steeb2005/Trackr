import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Listen for storage changes from other tabs/instances
    useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem('tasks');
            if (saved) {
                setTasks(JSON.parse(saved));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
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
        updateTask
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
