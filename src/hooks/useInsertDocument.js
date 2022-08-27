import { useState, useEffect, useReducer } from "react";
import {db} from '../firebase/config'
// cada lugar que a gente salva algum dado no firebase, é chamado de collection
// addDoc faz o insert do documento no banco de dados
// o Timestamp marca o horário que ele foi criado
import { collection, addDoc, Timestamp } from "firebase/firestore";

const initialState = {
    loading: null,
    error: null
}

const insertReducer = (state, action) => {
    switch(action.type) {
        case "Loading":
            return {loading: true, error: null}
        case "INSERTED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:  state;    
    }
}

export const useInsertDocument = (docCollection) => {
    const [response, dispatch] = useReducer(insertReducer, initialState)

    // deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    const checkCancelBeforeDispatch = (action) => {
        if(!cancelled) {
            dispatch(action)
        }
    }

    const insertDocument = async (document) => {
        checkCancelBeforeDispatch({
            type:"LOADING"
        })

        try {
            const newDocument = {...document, createdAt: Timestamp.now() }

            const insertedDocument = await addDoc(
                collection(db, docCollection), 
                newDocument
            )

            checkCancelBeforeDispatch({
                type:"INSERTED_DOC",
                payload: insertedDocument
            })

        } catch (error) {

            checkCancelBeforeDispatch({
                type:"ERROR",
                payload: error.message
            })
        }
    }
    // evitando memory leak
    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    return {insertDocument, response}
}