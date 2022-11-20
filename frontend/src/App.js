import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Friends from "./pages/Friends";
import About from "./pages/About";
import MongoDB from "./MongoDB";
import Login from "./pages/Login";
import {useEffect, useState} from "react";

export default function App() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!loading) {
            setLoading(true);
            MongoDB.createDefaultTables().then(() => {
                setLoading(false);
            });
        }
    }, []);

    return (
        <>
            {loading ? (
                <div>Creating default tables...</div>
            ) : <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/" element={<Layout/>}>
                        <Route path="home" element={<Home/>}/>
                        <Route path="messages" element={<Messages/>}/>
                        <Route path="friends" element={<Friends/>}/>
                        <Route path="about" element={<About/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>}
        </>
    );
};
