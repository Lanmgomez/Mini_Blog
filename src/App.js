import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
// pages
import Home from './pages/Home/Home.js'
import About from './pages/About/About'
import Login from './pages/Login/Login.js'
import Register from './pages/Register/Register.js'
import CreatePost from './pages/CreatePost/CreatePost.js'
import Dashbord from './pages/dashbord/Dashbord.js'
// components
import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import Search from './Search/Search.js'
// context 
import {AuthProvider} from './context/AuthContext'
// função que mapeia se o usuário foi autenticado ou não
import { onAuthStateChanged } from 'firebase/auth'
// hooks
import {useState, useEffect} from 'react'
import {useAuthentication} from './hooks/useAuthentication'


function App() {

  const [user, setUser] = useState(undefined)
  const {auth} = useAuthentication()

  const loadingUser = user === undefined

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

  }, [auth])

  if(loadingUser) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <AuthProvider value={{user}}>
        <BrowserRouter>
            <Navbar />
              <div className="container">
                <Routes>
                  <Route path='/' element={<Home />}/>
                  <Route path='/about' element={<About />}/>
                  <Route path='/search' element={<Search />}/>
                  {/** Usuário não está logado: */}
                  <Route path='/login' element={!user ? <Login/> : <Navigate to='/'/>}/>
                  <Route path='/register' element={!user ? <Register/> : <Navigate to='/'/>}/>
                  {/** Usuário está logado: */}
                  <Route path='/posts/create' element={user ? <CreatePost /> : <Navigate to='/login'/>}/>
                  <Route path='/dashboard' element={user ? <Dashbord /> : <Navigate to='/login'/>}/> 
                </Routes>
              </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
