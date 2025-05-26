import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Monitor from './pages/Monitor';
import NewJob from './pages/NewJob';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/monitor" element={<Monitor />} />
      <Route path="/new-job" element={<NewJob />} />
    </Routes>
  );
}

export default App;