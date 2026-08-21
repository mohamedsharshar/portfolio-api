import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    // BrowserRouter: هو الغلاف اللي بيشغل نظام الروابط في الموقع كله
    <BrowserRouter>
      <Routes>
        {/* هنا بنقوله: لو الرابط الرئيسي (/)، اعرض صفحة الـ Home */}
        <Route path="/" element={<Home />} />
        
        {/* قدام شوية هنضيف صفحة لوحة التحكم بالشكل ده: */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;