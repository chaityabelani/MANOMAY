export default function TestPage() {
    return (
        <div className="p-8 space-y-4">
            <h1 className="text-4xl font-bold text-blue-600">CSS Test Page</h1>
            <p className="text-lg text-gray-600">If you see this styled, Tailwind is working.</p>

            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                Gradient Test - If this has a blue-to-purple gradient, custom config is working
            </div>

            <div className="p-4 bg-red-500 text-white">
                Basic red background - If this is red, Tailwind utilities are working
            </div>

            <button className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600">
                Button Test
            </button>
        </div>
    );
}
