import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Pages/home.jsx";
import "./styles/main.css"
import About from "./Pages/about.jsx";
import ScrollTop from "./scrollTop.jsx";
import Login from "./Pages/login.jsx";
import Register from "./Pages/register.jsx";
import PrivateRoute from "./privateRoute.jsx";
import Dashboard from "./Pages/Dashboard/dashboard.jsx";
import AddProperty from "./Pages/Add&Update_property/addProperty.jsx";
import UpdateProperty from "./Pages/Add&Update_property/updateProperty.jsx";
import DetailProperty from "./Pages/Detail_property/detailProperty.jsx";
import ListProperty from "./Pages/List_property/listProperty.jsx";
import RegisterNewUser from "./Components/Login&Register/registerNewUser.jsx";


function App() {
    return (
        <Router>
            <ScrollTop/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/aboutUs" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/registerNewUser" element={<RegisterNewUser />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard/> </PrivateRoute>} />
                <Route path="/add" element={<PrivateRoute><AddProperty/> </PrivateRoute>} />
                <Route path="/update/:id" element={<PrivateRoute><UpdateProperty/> </PrivateRoute>} />
                <Route path="/detail/:id" element={<PrivateRoute><DetailProperty/> </PrivateRoute>} />
                <Route path="/list" element={<PrivateRoute><ListProperty/> </PrivateRoute>} />
                <Route path="/logout" element={<PrivateRoute><Login/> </PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
