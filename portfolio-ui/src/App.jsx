import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TextFallback from './pages/TextFallback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/text" element={<TextFallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;