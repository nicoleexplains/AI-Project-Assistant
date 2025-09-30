
import type { Task, HistoricalProject, ProjectActivity } from './types';
import { RiskLevel } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    name: 'Develop user authentication flow',
    assignee: 'Alice',
    dueDate: '2024-08-15',
    complexity: 'High',
    status: 'In Progress',
    riskLevel: RiskLevel.None,
  },
  {
    id: 2,
    name: 'Design database schema for new feature',
    assignee: 'Bob',
    dueDate: '2024-08-10',
    complexity: 'Medium',
    status: 'Not Started',
    riskLevel: RiskLevel.None,
  },
  {
    id: 3,
    name: 'Integrate third-party payment gateway',
    assignee: 'Charlie',
    dueDate: '2024-08-25',
    complexity: 'High',
    status: 'Not Started',
    riskLevel: RiskLevel.None,
  },
  {
    id: 4,
    name: 'Create marketing copy for landing page',
    assignee: 'Dana',
    dueDate: '2024-08-05',
    complexity: 'Low',
    status: 'Completed',
    riskLevel: RiskLevel.None,
  },
];

export const HISTORICAL_DATA: HistoricalProject[] = [
  { id: 1, description: 'User auth implementation', duration: 10, complexity: 'High', outcome: 'Delayed' },
  { id: 2, description: 'Schema design', duration: 5, complexity: 'Medium', outcome: 'On Time' },
  { id: 3, description: 'Payment gateway integration', duration: 12, complexity: 'High', outcome: 'Delayed' },
  { id: 4, description: 'Marketing copy', duration: 2, complexity: 'Low', outcome: 'On Time' },
  { id: 5, description: 'API performance optimization', duration: 8, complexity: 'High', outcome: 'Over Budget' },
  { id: 6, description: 'Mobile UI refresh', duration: 15, complexity: 'Medium', outcome: 'Delayed' },
];

export const PROJECT_ACTIVITY_LOG: ProjectActivity[] = [
  { id: 1, timestamp: '2024-07-28 09:15', author: 'Alice', activity: 'Pushed initial commit for authentication module. Blocked by API key availability.' },
  { id: 2, timestamp: '2024-07-28 14:30', author: 'Dana', activity: 'Completed initial draft of marketing copy. Ready for review.' },
  { id: 3, timestamp: '2024-07-29 11:00', author: 'ProjectBot', activity: 'Task "Create marketing copy for landing page" status changed to Completed.' },
  { id: 4, timestamp: '2024-07-29 16:45', author: 'Bob', activity: 'Started work on database schema. Initial ERD is drafted.' },
  { id: 5, timestamp: '2024-07-30 10:05', author: 'Charlie', activity: 'Received documentation for payment gateway. Looks more complex than anticipated.' },
];
