// ElevenLabs Agent IDs for each interview type
// Using single agent for all interview types
export const AGENT_IDS = {
  ielts: "agent_6201ke90s3zdf8xs44m0msqfgb7g",
  visa: "agent_6201ke90s3zdf8xs44m0msqfgb7g",
  "visa-work": "agent_6201ke90s3zdf8xs44m0msqfgb7g",
  "visa-student": "agent_6201ke90s3zdf8xs44m0msqfgb7g",
  "visa-worktravel": "agent_6201ke90s3zdf8xs44m0msqfgb7g",
  "visa-travel": "agent_6201ke90s3zdf8xs44m0msqfgb7g",
} as const;

export type InterviewType = keyof typeof AGENT_IDS;

// Check if we have a valid agent ID
export function getAgentId(type: InterviewType): string | null {
  return AGENT_IDS[type] || null;
}
