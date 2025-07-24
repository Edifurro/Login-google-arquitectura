import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-light text-gray-900 mb-2">
                        Bienvenido de vuelta
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Ingresa tus credenciales para continuar
                    </p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <LoginForm />
                </div>
                
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                       
                        <a href="/registro" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;