
export enum RiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  None = 'None',
}

export interface Task {
  id: number;
  name: string;
  assignee: string;
  dueDate: string | null;
  reminderDate?: string | null;
  complexity: 'Low' | 'Medium' | 'High';
  status: 'Not Started' | 'In Progress' | 'Completed';
  riskLevel?: RiskLevel;
  mitigationSuggestion?: string;
}

export interface HistoricalProject {
  id: number;
  description: string;
  duration: number; // in days
  complexity: 'Low' | 'Medium' | 'High';
  outcome: 'On Time' | 'Delayed' | 'Over Budget';
}

export interface ProjectActivity {
  id: number;
  timestamp: string;
  author: string;
  activity: string;
}

export interface RiskAnalysisResult {
  taskId: number;
  riskProbability: RiskLevel;
  mitigationSuggestion: string;
}
