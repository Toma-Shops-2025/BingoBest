import React, { useState } from 'react';

const GameInstructions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">How to Play Bingo</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">Basic Rules</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Each player gets one or more bingo cards with 25 squares</li>
                    <li>Numbers are called randomly from 1-75</li>
                    <li>Mark matching numbers on your card</li>
                    <li>First to complete a line (horizontal, vertical, or diagonal) wins!</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">Power-Ups</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><strong>Auto Daub:</strong> Automatically marks numbers for you</li>
                    <li><strong>Extra Ball:</strong> Get an additional number called</li>
                    <li><strong>Peek Next:</strong> See the next number to be called</li>
                    <li><strong>Double Prize:</strong> Double your winnings if you win</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">Winning Patterns</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Horizontal line: 5 in a row</li>
                    <li>Vertical line: 5 in a column</li>
                    <li>Diagonal line: 5 from corner to corner</li>
                    <li>Full house: All 25 squares marked</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">Money & Prizes</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Pay entry fee to join games</li>
                    <li>Prize pool grows with more players</li>
                    <li>Winner takes the entire prize pool</li>
                    <li>Add funds securely through PayPal</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameInstructions;