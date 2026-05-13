import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import Signin from './pages/signin'
import Dashboard from './pages/dashboard'
import Calendar from './pages/calendar'
import TaskList from './pages/tasklist'
import CreateTask from './pages/createTask'
import Diary from './pages/diary'
import CreateDiaryEntry from './pages/createDiary'
import Login from './pages/login'
import { TaskProvider, useTasks } from './context/TaskContext'

// Protected Route wrapper
function ProtectedRoute({ children }) {
    const { user, loading } = useTasks();

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
  return (
    <>   
        
        <TaskProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path='/login' element={<Login/>}/>
                    <Route path="/signin" element={<Signin />} />
                    <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                        <Dashboard />
                        </ProtectedRoute>
                    } 
                    />
                    <Route 
                    path="/calendar" 
                    element={
                        <ProtectedRoute>
                        <Calendar/>
                        </ProtectedRoute>
                    } 
                    />
                    <Route 
                    path="/tasklist" 
                    element={
                        <ProtectedRoute>
                        <TaskList/>
                        </ProtectedRoute>
                    } 
                    />
                    <Route 
                    path='/createtask' 
                    element={
                        <ProtectedRoute>
                        <CreateTask/>
                        </ProtectedRoute>
                    } 
                    />
                    <Route 
                    path='/diary' 
                    element={
                        <ProtectedRoute>
                        <Diary/>
                        </ProtectedRoute>
                    } 
                    />
                    <Route 
                    path='/create-diary-entry' 
                    element={
                        <ProtectedRoute>
                        <CreateDiaryEntry/>
                        </ProtectedRoute>
                    } 
                    />
                </Routes>
            </BrowserRouter>
        </TaskProvider>
    </>
  );
}

export default App;

