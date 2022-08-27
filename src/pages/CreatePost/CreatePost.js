import './CreatePost.sass'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
// pegar o usuário e atrelar ele ao post
import { useAuthValue } from '../../context/AuthContext'
import { useInsertDocument } from '../../hooks/useInsertDocument'

const CreatePost = () => {

  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState([])
  const [formError, setFormError] = useState("")

  const {user} = useAuthValue()

  const {insertDocument, response} = useInsertDocument("posts")

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError("")

    // validate image URL
    try {
      new URL(image)
    } catch (error) {
      setFormError("A imagem precisa ser uma URL")
    }
    // criar o array de tags
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase())

    // checar todos os valores vieram
    if (!title || !image || !tags || !body) {
      setFormError("Por favor, preencha todos os campos!")
    }

    if(formError) return;

    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    })

    // redirect to home page
    navigate("/")
  }

  return (
    <div className='create_post'>
        <h1>Criar Post</h1>
          <p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Título:</span>
                <input type="text" 
                       name='title'
                       placeholder='Pense em um bom título...'
                       onChange={(e) => setTitle(e.target.value)}
                       value={title}
                       required
                />
              </label>
              <label>
                <span>URL da imagem:</span>
                <input type="text" 
                       name='image'
                       placeholder='Insira uma imagem que represente o seu post...'
                       onChange={(e) => setImage(e.target.value)}
                       value={image}
                       required
                />
              </label>
              <label>
                <span>Conteúdo:</span>
                <textarea name="body" 
                          placeholder='Insira o conteúdo do post'
                          onChange={(e) => setBody(e.target.value)}
                          value={body}
                          required>
                </textarea>
              </label>
              <label>
                <span>Tags:</span>
                <input type="text" 
                       name='tags'
                       placeholder='Insira as tags separadas por vírgula'
                       onChange={(e) => setTags(e.target.value)}
                       value={tags}
                       required
                />
              </label>
              {!response.loading && <button className='btn'>Cadastrar</button>}
              {response.loading && (
                <button className='btn' disabled>Aguarde...</button>
              )}
              {response.error && <p className='error'>{response.error}</p>} 
              {formError && <p className='error'>{formError}</p>}
            </form>
    </div>
  )
}

export default CreatePost