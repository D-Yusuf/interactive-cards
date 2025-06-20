interface GameOverModalProps {
  winner: string;
}

export default function GameOverModal({ winner }: GameOverModalProps) {
  const handlePlayAgain = () => {
    window.location.href = '/';
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-lg w-full text-center">
        <h2 className="text-4xl font-bold mb-4 text-yellow-400">🎉 انتهت اللعبة 🎉</h2>
        <p className="text-2xl text-white mb-6">
          الفريق الفائز هو: <span className="font-bold text-cyan-400">{winner}</span>
        </p>
        <button
          onClick={handlePlayAgain}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-md text-lg transition-transform transform hover:scale-105"
        >
          العب مرة أخرى
        </button>
      </div>
    </div>
  );
} 