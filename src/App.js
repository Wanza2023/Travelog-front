import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Main from "./pages/Main";
import PostWrite from "./pages/PostWrite";
import PostList from "./pages/PostList";
import PostView from "./pages/PostView";
import PersonalHome from './pages/PersonalHome';
import Navbar from "./component/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route index element={<Main />} />
        <Route path="/:land" element={<Main />} />
        <Route path="write" element={<PostWrite />} />
        <Route path="post-list" element={<PostList />} />
        <Route path="post-view" element={<PostView />} />
        <Route path="login" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="personalhome" element={<PersonalHome/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;