import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import CV from './components/CV';
//import Contact from './components/Contact';
//import ProjectsPage from './components/ProjectsPage';
//import PortfolioHome from './components/PortfolioHome';
//import ResearchProject from './components/ProjectComponents/ReseachProject';
import SaasHomepage from './components/SaasHomePage';

const App = () =>{
  return(
  <div>
    <Router>
      <Routes>
        <Route path="/"  element={<SaasHomepage/>} />  
      </Routes>
    </Router>
  </div>
  );
};
 
export default App;
