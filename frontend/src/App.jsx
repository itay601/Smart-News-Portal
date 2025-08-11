import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import CV from './components/CV';
//import Contact from './components/Contact';
//import ProjectsPage from './components/ProjectsPage';
//import PortfolioHome from './components/PortfolioHome';
//import ResearchProject from './components/ProjectComponents/ReseachProject';
import SaasHomepage2 from './components/SaasHomePage';
import Dashboard from './components/Dashboard';
import Calendar  from './components/Calender';


const App = () =>{
  return(
  <div>
    <Router>
      <Routes>
	      <Route path="/"  element={<SaasHomepage2/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calender" element={<Calendar />} />
      </Routes>
    </Router>
  </div>
  );
};
 
export default App;
