import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import AddDigitalFormat from "./pages/AddDigitalFormat";
import AddLanguage from "./pages/AddLanguage";
import EditUser from "./pages/EditUser";
import EditDigitalFormat from "./pages/EditDigitalFormat";
import EditLanguage from "./pages/EditLanguage";
import Page403 from "./pages/Page403";
import Collections from "./pages/Collections";
import DigitalData from "./pages/DigitalData";
import Categories from "./pages/Categories";
import StoryTypes from "./pages/StoryTypes";
import Languages from "./pages/Languages";
import DigitalFormat from "./pages/DigitalFormat";
import AddCategory from "./pages/AddCategory";
import EditCategory from "./pages/EditCategory";
import AddStoryType from "./pages/AddStoryType";
import EditStoryType from "./pages/EditStoryType";
import AddDigitalData from "./pages/AddDigitalData";
import EditDigitalData from "./pages/EditDigitalData";
import AddCollection from "./pages/AddCollection";
import EditCollection from "./pages/EditCollection";

import CollectionList from "./pages/CollectionList";
import DigitalDataList from "./pages/DigitalDataList";
import PageViewCollection from "./pages/PageViewCollection";

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
          <Route path="/collections/add" element={<AddCollection/>}/>
          <Route path="/collections/edit/:id" element={<EditCollection/>} />
          <Route path="/collections/view/:id" element={<PageViewCollection/>} />
          <Route path="/digital-data" element={<DigitalDataList/>}/>
          <Route path="/digital-data/add" element={<AddDigitalData/>}/>
          <Route path="/digital-data/edit/:id" element={<EditDigitalData/>}/>
          <Route path="/categories" element={<Categories/>}/>
          <Route path="/categories/add" element={<AddCategory/>} />
          <Route path="/categories/edit/:id" element={<EditCategory/>} />
          <Route path="/story-types" element={<StoryTypes/>}/>
          <Route path="/story-types/add" element={<AddStoryType/>} />
          <Route path="/story-types/edit/:id" element={<EditStoryType/>} />
          <Route path="/languages" element={<Languages/>}/>
          <Route path="/languages/add" element={<AddLanguage/>}/>
          <Route path="/languages/edit/:id" element={<EditLanguage/>}/>
          <Route path="/digital-format" element={<DigitalFormat/>}/>
          <Route path="/digital-format/add" element={<AddDigitalFormat/>}/>
          <Route path="/digital-format/edit/:id" element={<EditDigitalFormat/>}/>

          <Route exact path="/collection" element={<CollectionList/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;


