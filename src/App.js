import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Friends from "./pages/Friends";
import About from "./pages/About";
import LocalStorageDB from "./LocalStorageDB";
import Login from "./pages/Login";

export default function App() {
    LocalStorageDB.createDefaultTables();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/" element={<Layout/>}>
                    <Route path="home" element={<Home/>}/>
                    <Route path="messages" element={<Messages/>}/>
                    <Route path="friends" element={<Friends/>}/>
                    <Route path="about" element={<About/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
