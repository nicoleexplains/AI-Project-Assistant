
import { GoogleGenAI, FunctionDeclaration, Type, GenerateContentResponse } from '@google/genai';
import type { Task, HistoricalProject, ProjectActivity, RiskAnalysisResult } from '../types';
import { RiskLevel } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const createTaskFunctionDeclaration: FunctionDeclaration = {
  name: 'createTask',
  description: 'Creates a new project task with the given parameters.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      taskName: {
        type: Type.STRING,
        description: 'The name or description of the task.',
      },
      assignee: {
        type: Type.STRING,
        description: 'The name of the person assigned to the task.',
      },
      dueDate: {
        type: Type.STRING,
        description: 'The due date for the task in YYYY-MM-DD format.',
      },
      reminderDate: {
        type: Type.STRING,
        description: 'A reminder date for the task in YYYY-MM-DD format.',
      },
    },
    required: ['taskName'],
  },
};

export const analyzeTaskRisk = async (
  currentTasks: Task[],
  historicalData: HistoricalProject[]
): Promise<RiskAnalysisResult[]> => {
  const model = 'gemini-2.5-flash';
  const prompt = `
    Analyze the risk for the following current project tasks based on the historical project data provided.
    For each task, provide a risk probability (Low, Medium, or High) and a concise, actionable mitigation suggestion.
    
    Historical Data: ${JSON.stringify(historicalData)}
    
    Current Tasks: ${JSON.stringify(currentTasks.map(t => ({ id: t.id, name: t.name, complexity: t.complexity, assignee: t.assignee })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              taskId: { type: Type.INTEGER },
              riskProbability: {
                type: Type.STRING,
                enum: [RiskLevel.Low, RiskLevel.Medium, RiskLevel.High],
              },
              mitigationSuggestion: { type: Type.STRING },
            },
            required: ["taskId", "riskProbability", "mitigationSuggestion"],
          },
        },
      },
    });

    const resultText = response.text.trim();
    const result = JSON.parse(resultText) as RiskAnalysisResult[];
    return result;
  } catch (error) {
    console.error("Error analyzing task risk:", error);
    throw new Error("Failed to analyze risks. Please check the console for details.");
  }
};

export const parseTaskFromString = async (naturalLanguageInput: string) => {
  const model = 'gemini-2.5-flash';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: naturalLanguageInput,
      config: {
        tools: [{ functionDeclarations: [createTaskFunctionDeclaration] }],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      return response.functionCalls[0];
    }
    return null;
  } catch (error) {
    console.error("Error parsing task from string:", error);
    throw new Error("Failed to parse task. The model could not understand the request.");
  }
};


export const generateProjectSummary = async (activityLog: ProjectActivity[]): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const logText = activityLog.map(log => `${log.timestamp} - ${log.author}: ${log.activity}`).join('\n');
  
  const prompt = `
    Based on the following project activity log, generate a concise, one-paragraph status update suitable for stakeholders.
    The tone should be professional and clear, focusing on key progress, completed items, and any noted blockers or risks.
    Do not use markdown formatting.
    
    Activity Log:
    ${logText}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating project summary:", error);
    throw new Error("Failed to generate summary. Please check the console for details.");
  }
};
