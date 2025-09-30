
import React, { useState, useCallback } from 'react';
import type { Task } from '../types';
import { parseTaskFromString } from '../services/geminiService';
import Spinner from './Spinner';
import { WandSparklesIcon } from './IconComponents';

interface NaturalTaskCreatorProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const NaturalTaskCreator: React.FC<NaturalTaskCreatorProps> = ({ setTasks }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateTask = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const functionCall = await parseTaskFromString(inputValue);
      
      if (functionCall && functionCall.name === 'createTask') {
        const { taskName, assignee, dueDate, reminderDate } = functionCall.args;
        
        if (!taskName) {
            throw new Error("The model could not determine a task name. Please be more specific.");
        }

        const newTask: Task = {
          id: Date.now(),
          name: taskName,
          assignee: assignee || 'Unassigned',
          dueDate: dueDate || null,
          reminderDate: reminderDate || null,
          complexity: 'Medium', // Default value
          status: 'Not Started',
        };

        setTasks(prevTasks => [newTask, ...prevTasks]);
        setSuccessMessage(`Task "${taskName}" created successfully!`);
        setInputValue('');
      } else {
        setError("I couldn't understand that. Please try rephrasing your request to create a task.");
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, setTasks]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
         <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-100 rounded-full"><WandSparklesIcon className="w-6 h-6 text-sky-600"/></div>
            <h2 className="text-2xl font-bold text-slate-700">Natural Language Task Creation</h2>
        </div>
        <p className="text-slate-600">
          Type a command like, "Create a task for John to design the new logo by Friday," and the AI will handle the rest.
        </p>
        <form onSubmit={handleCreateTask} className="space-y-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., Remind me to review the Q3 report with Sarah next Monday"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
            rows={3}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="w-full flex items-center justify-center px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:bg-sky-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            {isLoading ? <Spinner className="w-5 h-5 mr-2" /> : <WandSparklesIcon className="w-5 h-5 mr-2"/>}
            {isLoading ? 'Creating Task...' : 'Create Task with AI'}
          </button>
        </form>
        {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
        {successMessage && <p className="text-sm text-green-600 mt-2 text-center">{successMessage}</p>}
      </div>
    </div>
  );
};

export default NaturalTaskCreator;
