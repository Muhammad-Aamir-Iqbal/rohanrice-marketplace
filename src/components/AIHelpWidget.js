import React, { useState } from 'react';

export default function AIHelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // This would connect to Algolia or your backend AI service
      const result = await fetch('/api/ai-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      }).then(r => r.json());

      setResponse(result.answer || 'No relevant information found.');
    } catch (error) {
      setResponse('Error fetching response. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-rice text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        aria-label="Open AI Help"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-end md:items-center justify-end md:justify-center">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-96 max-h-96 overflow-auto shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-rice text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold">RohanRice AI Help</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:opacity-80 transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Response Display */}
              {response && (
                <div className="bg-rice-beige-50 border border-rice-beige-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">{response}</p>
                </div>
              )}

              {/* Question Examples */}
              {!response && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 font-semibold">Popular Questions:</p>
                  {[
                    'What rice varieties do you offer?',
                    'How do I place a bulk order?',
                    'What are your certifications?',
                    'How is rice shipped internationally?',
                  ].map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(example)}
                      className="w-full text-left text-sm p-2 bg-rice-beige-50 hover:bg-rice-beige-100 rounded transition text-gray-700"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="border-t border-rice-beige-200 pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about rice, orders, certifications..."
                    className="flex-1 input-field text-sm"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary text-sm px-3 disabled:opacity-50"
                  >
                    {loading ? '...' : '→'}
                  </button>
                </div>
              </form>

              {/* Footer Note */}
              <p className="text-xs text-gray-500 text-center mt-2">
                Powered by AI. Free to use.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
