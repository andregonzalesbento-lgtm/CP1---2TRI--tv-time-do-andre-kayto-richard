import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TitleDetails from "./pages/TitleDetails";
import MyList from "./pages/MyList";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/titulo/:mediaType/:id" element={<TitleDetails />} />
          <Route path="/minha-lista" element={<MyList />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
