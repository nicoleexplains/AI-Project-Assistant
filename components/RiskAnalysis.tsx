
import React, { useState, useCallback } from 'react';
import type { Task, HistoricalProject } from '../types';
import { RiskLevel } from '../types';
import { analyzeTaskRisk } from '../services/geminiService';
import Spinner from './Spinner';
import { ShieldAlertIcon } from './IconComponents';

interface RiskAnalysisProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  historicalData: HistoricalProject[];
}

const getRiskColorClasses = (riskLevel?: RiskLevel): string => {
  switch (riskLevel) {
    case RiskLevel.High:
      return 'bg-red-100 text-red-800 border-red-300';
    case RiskLevel.Medium:
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case RiskLevel.Low:
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-slate-100 text-slate-500 border-slate-300';
  }
};


const RiskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div className={`p-4 rounded-lg border ${getRiskColorClasses(task.riskLevel)} transition-all duration-300`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold">{task.name}</p>
                <p className="text-sm text-slate-600">Assignee: {task.assignee} | Complexity: {task.complexity}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColorClasses(task.riskLevel)}`}>
                {task.riskLevel ?? 'N/A'}
            </span>
        </div>
        {task.mitigationSuggestion && (
            <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <p className="text-sm font-semibold">Suggested Mitigation:</p>
                <p className="text-sm">{task.mitigationSuggestion}</p>
            </div>
        )}
    </div>
);


const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ tasks, setTasks, historicalData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeRisks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await analyzeTaskRisk(tasks, historicalData);
      setTasks(prevTasks =>
        prevTasks.map(task => {
          const result = results.find(r => r.taskId === task.id);
          if (result) {
            return {
              ...task,
              riskLevel: result.riskProbability,
              mitigationSuggestion: result.mitigationSuggestion,
            };
          }
          return { ...task, riskLevel: RiskLevel.Low, mitigationSuggestion: 'No significant risks identified based on historical data.' };
        })
      );
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [tasks, historicalData, setTasks]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-full"><ShieldAlertIcon className="w-6 h-6 text-indigo-600"/></div>
            <h2 className="text-2xl font-bold text-slate-700">Risk Mitigation Engine</h2>
        </div>
        <p className="text-slate-600">
          Use historical project data to flag current tasks with a high risk probability. The AI will suggest mitigation actions to keep your project on track.
        </p>
        <button
          onClick={handleAnalyzeRisks}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? <Spinner className="w-5 h-5 mr-2" /> : <ShieldAlertIcon className="w-5 h-5 mr-2"/>}
          {isLoading ? 'Analyzing Risks...' : 'Analyze Project Risks'}
        </button>
        {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-600 px-2">Current Tasks Analysis</h3>
        {tasks.map(task => (
            <RiskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default RiskAnalysis;
