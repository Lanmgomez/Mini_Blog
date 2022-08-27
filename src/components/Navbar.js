import './Navbar.sass'
import { NavLink } from 'react-router-dom'
import { useAuthentication } from '../hooks/useAuthentication'
// função de log out
import { useAuthValue } from '../context/AuthContext'

const Navbar = () => {

  const {user} = useAuthValue()
  const {logout} = useAuthentication()

  return (
    <nav>
        <NavLink to="/" className={({isActive}) => (isActive ? isActive : "")}>
          Mini <span>Blog</span>
        </NavLink>
          <ul>
            <li><NavLink to="/" className='a_NavLinks'>Home</NavLink></li>
            {/**Se o usuário não está logado: */}
            {!user && (
              <> {/**Para ter dois elementos pai, usamos o fragment */}
                <li><NavLink to="/login" className='a_NavLinks'>Entrar</NavLink></li>
                <li><NavLink to="/register" className='a_NavLinks'>Cadastrar</NavLink></li>
              </>
            )}
            {/**Se o usuário está logado: */}
            {user && (
              <>
                <li><NavLink to="/posts/create" className='a_NavLinks'>Novo Post</NavLink></li>
                <li><NavLink to="/dashboard" className='a_NavLinks'>Dashboard</NavLink></li>
              </>
            )}
            <li><NavLink to="/about" className='a_NavLinks'>Sobre Nós</NavLink></li>
            {user && (
              <>
              <li><button onClick={logout} className='a_NavLink_Sair'>Sair</button></li>
              </>
            )}
          </ul>
    </nav>
  )
}

export default Navbar