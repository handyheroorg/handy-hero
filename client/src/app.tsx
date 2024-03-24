import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/pages/home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
