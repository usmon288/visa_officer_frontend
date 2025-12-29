// Demo interview responses for when ElevenLabs agents are not available

export const demoResponses = {
  ielts: {
    greeting: "Hello! Welcome to your IELTS Speaking Practice Test. I'm your examiner today. Let's begin with Part 1. Can you tell me about where you live?",
    questions: [
      "That's interesting. What do you like most about living there?",
      "Do you think you'll continue living there in the future?",
      "Now let's talk about your hobbies. What do you enjoy doing in your free time?",
      "How did you become interested in that hobby?",
      "Let's move on to Part 2. I'd like you to describe a memorable journey you've taken. You have one minute to prepare.",
      "Thank you. Now for Part 3, let's discuss travel in general. Why do you think people enjoy traveling?",
      "How has travel changed over the past few decades?",
      "Thank you for your responses. This concludes our speaking practice. Well done!",
    ],
    followUps: [
      "Could you elaborate on that?",
      "That's a good point. Can you give me an example?",
      "Interesting. What else can you tell me about that?",
    ],
  },
  job: {
    greeting: "Good morning! Thank you for joining us today. I'm the HR manager here. Let's start - can you tell me a little about yourself and your background?",
    questions: [
      "Thank you. What attracted you to this position?",
      "Can you describe a challenging project you've worked on and how you handled it?",
      "How do you handle working under pressure or tight deadlines?",
      "Tell me about a time when you had to work with a difficult team member.",
      "Where do you see yourself in five years?",
      "What do you consider your greatest professional strength?",
      "Do you have any questions for me about the role or our company?",
      "Thank you for your time today. We'll be in touch regarding the next steps.",
    ],
    followUps: [
      "Can you give me a specific example?",
      "How did that experience shape your approach?",
      "What did you learn from that situation?",
    ],
  },
  visa: {
    greeting: "Hello, please have a seat. I'll be reviewing your visa application today. Can you start by telling me the purpose of your visit?",
    questions: [
      "How long do you plan to stay in the country?",
      "Where will you be staying during your visit?",
      "What is your current occupation?",
      "Have you traveled internationally before?",
      "Who will be financing your trip?",
      "Do you have any family or friends in the country you're visiting?",
      "What ties do you have to your home country that will ensure your return?",
      "Thank you for answering my questions. Your application will be processed.",
    ],
    followUps: [
      "Can you provide more details about that?",
      "Do you have documentation to support that?",
      "Please clarify what you mean.",
    ],
  },
};

export type DemoInterviewType = keyof typeof demoResponses;

export class DemoInterviewer {
  private type: DemoInterviewType;
  private questionIndex: number = 0;
  private hasGreeted: boolean = false;
  private onResponse: (text: string) => void;
  private onSpeakingChange: (speaking: boolean) => void;

  constructor(
    type: DemoInterviewType,
    onResponse: (text: string) => void,
    onSpeakingChange: (speaking: boolean) => void
  ) {
    this.type = type;
    this.onResponse = onResponse;
    this.onSpeakingChange = onSpeakingChange;
  }

  start() {
    // Initial greeting
    setTimeout(() => {
      this.respond(demoResponses[this.type].greeting);
      this.hasGreeted = true;
    }, 1000);
  }

  handleUserInput(userText: string) {
    // Simulate AI "thinking" and responding
    const responseDelay = 1500 + Math.random() * 1000;
    
    setTimeout(() => {
      const responses = demoResponses[this.type];
      let response: string;

      if (this.questionIndex < responses.questions.length) {
        // Use follow-up occasionally for variety
        if (Math.random() > 0.7 && responses.followUps.length > 0) {
          const followUpIndex = Math.floor(Math.random() * responses.followUps.length);
          response = responses.followUps[followUpIndex];
        } else {
          response = responses.questions[this.questionIndex];
          this.questionIndex++;
        }
      } else {
        // Interview complete
        response = responses.questions[responses.questions.length - 1];
      }

      this.respond(response);
    }, responseDelay);
  }

  private respond(text: string) {
    this.onSpeakingChange(true);
    
    // Simulate speaking duration based on text length
    const speakingDuration = Math.min(text.length * 50, 5000);
    
    this.onResponse(text);
    
    setTimeout(() => {
      this.onSpeakingChange(false);
    }, speakingDuration);
  }

  isComplete(): boolean {
    return this.questionIndex >= demoResponses[this.type].questions.length;
  }
}
