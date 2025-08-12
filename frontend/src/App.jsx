import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import CV from './components/CV';
//import Contact from './components/Contact';
//import ProjectsPage from './components/ProjectsPage';
//import Settings from './components/PortfolioHome';
import SighInPage from './components/authPages/SignInPage';
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
        <Route path="/sighin" element={<SighInPage />} />

        {/*<Route path="/settings" element={<Settings />} />*/}
      </Routes>
    </Router>
  </div>
  );
};
 
export default App;
