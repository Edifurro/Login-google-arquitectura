import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import useLogin from "../hooks/useLogin"
import { useEffect } from "react"

const LoginForm = () => {
    const { 
        handleSubmit, 
        onInputChange, 
        formState, 
        isLoading, 
        errors,
        handleGoogleLogin,
        sessionData
    } = useLogin()

    const login = useGoogleLogin({
        onSuccess: handleGoogleLogin,
        flow: 'implicit',
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('AUTH_SESSION_USER')
        if (storedUser) {
            login();
        }
    }, [sessionData])

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <input
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        onChange={onInputChange}
                        value={formState.correo}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        onChange={onInputChange}
                        value={formState.password}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {errors !== null && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm text-center">
                        {errors.msg}
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                </button>
            </div>

            <div className="text-center">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                    ¿Olvidaste tu contraseña?
                </a>
            </div>
        </form>
    )
}

export default LoginForm