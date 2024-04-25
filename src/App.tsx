import { BrowserRouter, Route, Routes } from "react-router-dom";

import Svg from "./pages/Svg";
import Webp from "./pages/Webp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Svg />} />
        <Route path="/webp" element={<Webp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
