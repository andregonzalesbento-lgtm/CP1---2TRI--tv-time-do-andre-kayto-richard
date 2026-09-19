import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import TitleDetails from "./pages/TitleDetails";
import MyList from "./pages/MyList";
import Community from "./pages/Community";
import Upcoming from "./pages/Upcoming";
import PersonDetails from "./pages/PersonDetails";

import "./index.css";
//import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/titulo/:mediaType/:id"
            element={<TitleDetails />}
          />

          <Route
            path="/pessoa/:id"
            element={<PersonDetails />}
          />

          <Route
            path="/minha-lista"
            element={<MyList />}
          />

          <Route
            path="/lancamentos"
            element={<Upcoming />}
          />

          <Route
            path="/comunidade"
            element={<Community />}
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;