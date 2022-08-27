
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth'

import { useState, useEffect } from 'react'

export const useAuthentication = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    // clean up
    // deal with memory leak // evitando e limpando vazamento de memória
    /* Vazamentos de memória em aplicativos React são principalmente resultado do não cancelamento de assinaturas feitas quando um componente foi montado antes de o componente ser desmontado.
    */

    const [cancelled, setCancelled] = useState(false)

    const auth = getAuth()

    function checkIfIsCancelled() {
        if (cancelled) {
            return
        }
    }

    // register
    const createUser = async (data) => {
        checkIfIsCancelled() // limpando memory leak
        setLoading(true)

        try {
            const {user} = await createUserWithEmailAndPassword(
                auth, data.email, data.password
            )
            await updateProfile(user, {
                displayName: data.displayName
            })
            return user

        } catch (error) {
            console.log(error.message)
            console.log(typeof error.message)

                let systemErrorMessage

                if(error.message.includes("Password")) {
                    systemErrorMessage = "A senha precisa conter no mínimo 6 caracteres!"
                } else if(error.message.includes("email-already")) {
                    systemErrorMessage = "E-mail já cadastrado."
                } else {
                    systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde!"
                }
                setError(systemErrorMessage)
        }
        setLoading(false);
    }

    // Log-Out - Sing out
    const logout = () => {
        checkIfIsCancelled() // limpando memory leak
        signOut(auth)
    }

    // LogIn - Sign in
    const login = async (data) => {
        checkIfIsCancelled() // limpando memory leak
        setLoading(true)
        setError(false)

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password)

        } catch (error) {
            console.log(error.message);
            console.log(typeof error.message);
            console.log(error.message.includes("user-not"));

            let systemErrorMessage;

            if (error.message.includes("user-not-found")) {
                systemErrorMessage = "Usuário não encontrado."
            } else if (error.message.includes("wrong-password")) {
                systemErrorMessage = "Senha incorreta."
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde."
            }

            setError(systemErrorMessage)
            setLoading(false)
        }
    }

    // limpando memory leak, deixando o app mais performático
    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    return { auth, createUser, error, loading, logout, login }
}