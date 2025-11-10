import React from 'react';

interface ScoreVisualizerProps {
  scores: { [key: string]: number };
}

const ScoreBar: React.FC<{ label: string; score: number; maxScore: number; color: string; }> = ({ label, score, maxScore, color }) => {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  return (
    <div className="flex items-center space-x-2 my-1">
      <span className="w-5 text-center font-bold text-gray-700">{label}</span>
      <div className="w-full bg-gray-200 rounded-full h-5">
        <div
          className={`h-5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-end px-2 text-white text-xs font-bold ${color}`}
          style={{ width: `${percentage}%` }}
        >
         {score > 0 && <span>{score}</span>}
        </div>
      </div>
    </div>
  );
};

const ScoreVisualizer: React.FC<ScoreVisualizerProps> = ({ scores }) => {
  const colors = {
      R: 'bg-red-500',
      I: 'bg-teal-500',
      A: 'bg-purple-500',
      S: 'bg-green-500',
      E: 'bg-stone-500',
      C: 'bg-gray-500'
  };
  
  const scoreOrder: (keyof typeof colors)[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  
  // Normalize the bar width based on the current highest score to make the visualization dynamic
  const maxScore = Math.max(...Object.values(scores), 5); // Use a minimum max-score to prevent overly large bars at the beginning

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-6">
      <h3 className="text-lg font-semibold text-center mb-3">Grafik Kepribadianmu</h3>
      <div className="space-y-1">
          {scoreOrder.map(key => (
              <ScoreBar 
                key={key}
                label={key}
                score={scores[key]}
                maxScore={maxScore}
                color={colors[key]}
              />
          ))}
      </div>
    </div>
  );
};

export default ScoreVisualizer;
