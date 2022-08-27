import {useState, useEffect} from 'react'
import {db} from '../firebase/config'
import {
    collection, // definir a coleção
    query, // para pegar o dado
    orderBy, // para ordenação
    onSnapshot, // para mapear os dados
    where, // fazer um filtro melhor dos resultados que estão sendo trazidos
} from 'firebase/firestore'

export const useFetchDocuments = (docCollection, search = null, uid = null) => {

    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    // deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    useEffect(() => {

        async function loadData() {
            if (cancelled) {
                return
            }

            setLoading(true)

            const collectionRef = await collection(db, docCollection)

            try {
                let q;

                // busca
                // dashboard
                // criando a busca de dados mais simples, pegar todos os dados ordenados por data de criação crescente
                if (search) {
                    q = await query(
                        collectionRef,
                        where("tags", "array-contains", search),
                        orderBy("createdAt", "desc")
                    )

                } else {
                    q = await query(collectionRef, orderBy("createdAt", "desc"))
                }

                // para mapear os dados, sempre que tiver um dado alterado, ele trás esse dado atualizado pra gente
                await onSnapshot(q, (querySnapshot) => {

                    // filtrando os dados que nos interessa do firebase
                    setDocuments(
                        querySnapshot.docs.map((doc) => ({
                            id: doc.id,  // o id vem separado dos dados, regra do firebase, por isso essa sintaxe...
                            ...doc.data(),
                        }))
                    )
                })

            } catch (error) {
                console.log(error)
                setError(error.message)
            }
            setLoading(false)
        }

        loadData()

    }, [docCollection, search, uid, cancelled])

    console.log(documents);

    // deal with memory leak
    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    return {documents, loading, error}
}