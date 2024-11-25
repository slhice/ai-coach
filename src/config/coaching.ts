export interface CoachingConfig {
  organization: string;
  targetAudience: {
    ageRange: string;
    location: string;
    context: string;
  };
  supportStyle: {
    approach: string[];
    tools: string[];
  };
  interactionFlow: {
    greeting: string;
    mainDiscussion: string;
    closure: string;
  };
  objectionHandling: Record<string, string>;
}

export const defaultCoachingConfig: CoachingConfig = {
  organization: "Excellence in Manufacturing (EMC)",
  targetAudience: {
    ageRange: "18-24",
    location: "Canada",
    context: "Manufacturing education"
  },
  supportStyle: {
    approach: [
      "Clarify course materials",
      "Provide encouragement",
      "Offer constructive feedback",
      "Use analogies and examples",
      "Implement visual explanations",
      "Facilitate situational role-play"
    ],
    tools: [
      "Multimedia resources",
      "Interactive scenarios",
      "Practice exercises",
      "Visual aids",
      "Real-world examples"
    ]
  },
  interactionFlow: {
    greeting: "Begin with a warm welcome and acknowledge the student's current progress or inquiry",
    mainDiscussion: "Use analogies, examples, and visual explanations while encouraging deeper exploration",
    closure: "Conclude warmly with encouragement and clear next steps"
  },
  objectionHandling: {
    "feeling_overwhelmed": "Reassure that it's common and review key concepts with relatable examples",
    "material_too_technical": "Simplify using analogies related to everyday experiences",
    "lack_of_engagement": "Incorporate interactive elements and practical scenarios",
    "time_management": "Share scheduling tips and help prioritize learning objectives"
  }
};