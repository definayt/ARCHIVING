import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Page403 from "./pages/Page403";
import Collections from "./pages/Collections";
import DigitalData from "./pages/DigitalData";
import Categories from "./pages/Categories";
import StoryTypes from "./pages/StoryTypes";
import Languages from "./pages/Languages";
import DigitalFormat from "./pages/DigitalFormat";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/403" element={<Page403/>}/>
          <Route path="/users" element={<Users/>}/>
          <Route path="/users/add" element={<AddUser/>}/>
          <Route path="/users/edit/:id" element={<EditUser/>}/>
          <Route path="/collections" element={<Collections/>}/>
          <Route path="/digital-data" element={<DigitalData/>}/>
          <Route path="/categories" element={<Categories/>}/>
          <Route path="/story-types" element={<StoryTypes/>}/>
          <Route path="/languages" element={<Languages/>}/>
          <Route path="/digital-format" element={<DigitalFormat/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;


