// ElevenLabs Agent IDs for each interview type
// These are the public demo agent IDs - in production, you would create your own agents
export const AGENT_IDS = {
  ielts: "agent_01jxmnqf6ae18rbfr7qw2g7h90", // IELTS Examiner agent
  job: "agent_01jxmnr1g7f51r9mj0eka4p5kd", // HR Manager agent
  visa: "agent_01jxmnrkqe891sqsb1pw4cvgbr", // Visa Officer agent
  "visa-work": "agent_01jxmnrkqe891sqsb1pw4cvgbr", // Work Visa agent
  "visa-student": "agent_01jxmnrkqe891sqsb1pw4cvgbr", // Student Visa agent
  "visa-worktravel": "agent_01jxmnrkqe891sqsb1pw4cvgbr", // Work & Travel Visa agent
  "visa-travel": "agent_01jxmnrkqe891sqsb1pw4cvgbr", // Tourist Visa agent
} as const;

export type InterviewType = keyof typeof AGENT_IDS;

// Check if we have a valid agent ID
export function getAgentId(type: InterviewType): string | null {
  return AGENT_IDS[type] || null;
}
