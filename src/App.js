import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import AddCountry from "./countries/AddCountry";
import EditCountry from "./countries/EditCountry";
import Country from "./pages/Country";
import River from "./pages/River";
import Mountain from "./pages/Mountain";
import AddRiver from "./rivers/AddRiver";
import EditRiver from "./rivers/EditRiver";
import AddMountain from "./mountains/AddMountain";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/country" element={<Country />}></Route>
          <Route exact path="/river" element={<River />}></Route>
          <Route exact path="/mountain" element={<Mountain />}></Route>

          <Route exact path="/addcountry" element={<AddCountry />}></Route>
          <Route exact path="/addmountain" element={<AddMountain />}></Route>
          <Route exact path="/addriver" element={<AddRiver />}></Route>

          <Route exact path="/editriver/:id" element={<EditRiver />}></Route>
          <Route
            exact
            path="/editcountry/:id"
            element={<EditCountry />}
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
