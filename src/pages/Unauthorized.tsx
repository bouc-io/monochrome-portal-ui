import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-2">Access Denied</p>
        <p className="text-sm text-gray-500 mb-6">
          You don't have permission to view this page.
        </p>
        <button
          onClick={() => navigate("/instructions")}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Return to Instructions
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
