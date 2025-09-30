
import React, { useState, useCallback } from 'react';
import type { ProjectActivity } from '../types';
import { generateProjectSummary } from '../services/geminiService';
import Spinner from './Spinner';
import { FileTextIcon, BotIcon } from './IconComponents';

interface StatusSummarizerProps {
  activityLog: ProjectActivity[];
}

const StatusSummarizer: React.FC<StatusSummarizerProps> = ({ activityLog }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await generateProjectSummary(activityLog);
      setSummary(result);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [activityLog]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-full"><FileTextIcon className="w-6 h-6 text-emerald-600"/></div>
            <h2 className="text-2xl font-bold text-slate-700">Automated Status Summaries</h2>
        </div>
        <p className="text-slate-600">
          Let AI read recent comments and task updates to generate a concise status update for stakeholders, saving you valuable reporting time.
        </p>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          {isLoading ? <Spinner className="w-5 h-5 mr-2" /> : <FileTextIcon className="w-5 h-5 mr-2"/>}
          {isLoading ? 'Generating Summary...' : 'Generate AI Summary'}
        </button>
        {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
      </div>

      {isLoading && (
          <div className="p-6 bg-slate-100 rounded-lg animate-pulse flex items-center justify-center space-x-3">
              <BotIcon className="w-6 h-6 text-slate-500"/>
              <p className="text-slate-500 font-medium">AI is thinking...</p>
          </div>
      )}

      {summary && (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <div className="flex items-center space-x-3 mb-4">
                 <div className="p-2 bg-slate-100 rounded-full"><BotIcon className="w-6 h-6 text-slate-600"/></div>
                <h3 className="text-xl font-bold text-slate-700">AI Generated Summary</h3>
            </div>
          <p className="text-slate-600 leading-relaxed">{summary}</p>
        </div>
      )}
      
      <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
        <h3 className="text-xl font-semibold text-slate-700">Project Activity Log</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {activityLog.map(activity => (
            <div key={activity.id} className="text-sm">
              <p className="font-semibold text-slate-800">{activity.author} <span className="font-normal text-slate-500">- {activity.timestamp}</span></p>
              <p className="text-slate-600">{activity.activity}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default StatusSummarizer;
