import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import AddCountry from "./countries/AddCountry";
import EditCountry from "./countries/EditCountry";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/addcountry" element={<AddCountry />}></Route>
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
