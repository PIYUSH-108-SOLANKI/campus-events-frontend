const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-md border p-8">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                        <span className="text-4xl">👋</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome, {user?.name}!
                    </h1>
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
                        <span className="text-sm font-medium text-blue-800">
                            Role: {user?.role}
                        </span>
                    </div>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border">
                        <p className="text-gray-600 text-center">
                            Use the navigation menu above to explore campus events and manage your activities.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
