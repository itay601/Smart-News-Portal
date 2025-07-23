
const SignInPage = ({ onSignIn }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
                 <div className="inline-block w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mb-4"></div>
                <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
            </div>
            <form className="space-y-6">
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
                    <input type="email" id="email" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                 <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button 
                    type="button"
                    onClick={onSignIn}
                    className="w-full px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Sign In
                </button>
            </form>
        </div>
    </div>
);

export default SignInPage;