import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CV from './components/CV';
import Contact from './components/Contact';
import ProjectsPage from './components/ProjectsPage';
import PortfolioHome from './components/PortfolioHome';
import ResearchProject from './components/ProjectComponents/ReseachProject';

const App = () =>{
  return(
  <div>
    <Router>
      <Routes>
      <Route path="/"  element={<PortfolioHome/>} /> 
      <Route path="/Contact"  element={<Contact/>} /> 
      <Route path="/CV"  element={<CV/>} /> 
      <Route path="/Home"  element={<PortfolioHome/>} />
      <Route path="/Projects"  element={<ProjectsPage/>} />  
      <Route path="/Projects/ResearchProject"  element={<ResearchProject/>} />  
      </Routes>
    </Router>
  </div>
  );
};
 
export default App;
