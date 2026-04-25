import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signin from './pages/signin';
import Dashboard from './pages/dashboard';
import Calendar from './pages/calendar';
import TaskList from './pages/tasklist';
import CreateTask from './pages/createTask.';
import Diary from './pages/diary';
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar/>} />
          <Route path="/tasklist" element={<TaskList/>}/>
          <Route path='/createtask' element={<CreateTask/>}/>
          <Route path='/diary' element={<Diary/>}/>
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  );
}

export default App;

