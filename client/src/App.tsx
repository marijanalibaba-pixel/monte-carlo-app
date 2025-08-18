import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Monte Carlo Forecasting Application
          </h1>
          <p className="text-gray-600 mb-4">
            Professional-grade forecasting with throughput and cycle time analysis.
          </p>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Test Counter</h2>
            <p className="mb-4">Count: {count}</p>
            <button 
              onClick={() => setCount(count + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Increment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}