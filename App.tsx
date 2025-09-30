
import React, { useState } from 'react';
import type { Task } from './types';
import { INITIAL_TASKS, HISTORICAL_DATA, PROJECT_ACTIVITY_LOG } from './constants';
import RiskAnalysis from './components/RiskAnalysis';
import NaturalTaskCreator from './components/NaturalTaskCreator';
import StatusSummarizer from './components/StatusSummarizer';
import { ShieldAlertIcon, WandSparklesIcon, FileTextIcon, BotIcon } from './components/IconComponents';

type Feature = 'risk' | 'task' | 'summary';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeFeature, setActiveFeature] = useState<Feature>('risk');

  const renderFeature = () => {
    switch (activeFeature) {
      case 'risk':
        return <RiskAnalysis tasks={tasks} setTasks={setTasks} historicalData={HISTORICAL_DATA} />;
      case 'task':
        return <NaturalTaskCreator setTasks={setTasks} />;
      case 'summary':
        return <StatusSummarizer activityLog={PROJECT_ACTIVITY_LOG} />;
      default:
        return null;
    }
  };

  const NavButton: React.FC<{
    feature: Feature;
    icon: React.ReactNode;
    label: string;
  }> = ({ feature, icon, label }) => (
    <button
      onClick={() => setActiveFeature(feature)}
      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 font-semibold text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        activeFeature === feature
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-white text-slate-600 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <BotIcon className="w-8 h-8 text-indigo-600"/>
             <h1 className="text-2xl font-bold text-slate-800">AI Project Assistant</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-2 rounded-xl shadow-md mb-8">
          <nav className="flex space-x-2">
            <NavButton feature="risk" icon={<ShieldAlertIcon className="w-5 h-5" />} label="Risk Analysis" />
            <NavButton feature="task" icon={<WandSparklesIcon className="w-5 h-5" />} label="Create Task" />
            <NavButton feature="summary" icon={<FileTextIcon className="w-5 h-5" />} label="Generate Summary" />
          </nav>
        </div>
        
        <div>
          {renderFeature()}
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-8">
        <p className="text-center text-sm text-slate-500">
          Powered by Gemini API & React
        </p>
      </footer>
    </div>
  );
};

export default App;
