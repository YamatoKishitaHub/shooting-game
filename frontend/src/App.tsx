import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Playing } from './components/Playing'
import { Home } from './components/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/playing' element={<Playing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
