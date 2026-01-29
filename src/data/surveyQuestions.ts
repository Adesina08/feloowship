export type QuestionType =
  | "single"
  | "multi"
  | "text"
  | "matrix"
  | "info"
  | "email";

export interface SurveyOption {
  value: string | number;
  label: string;
  // Option-level visibility rule used for hiding choices based on prior answers.
  hideWhen?: {
    questionId: string;
    value: any;
  };
  // Marks an option as mutually exclusive in multi-select questions.
  exclusive?: boolean;
  // Indicates the option expects a free-text specification.
  requiresText?: boolean;
}

export interface MatrixRow {
  id: string;
  label: string;
}

export interface MatrixColumn {
  value: string;
  label: string;
}

export type QuestionCondition =
  | {
      questionId: string;
      value: any;
    }
  | {
      questionId: string;
      values: any[];
    }
  | {
      questionId: string;
      predicate: (answer: any, answers: Record<string, any>) => boolean;
    };

export interface SurveyQuestion {
  id: string;
  section: string;
  type: QuestionType;
  title: string;
  description?: string;
  options?: SurveyOption[];
  maxSelect?: number;
  condition?: QuestionCondition;
  // Matrix questions render rows with single-choice columns.
  matrixRows?: MatrixRow[];
  matrixColumns?: MatrixColumn[];
}

/* =========================
   COMMON OPTION SETS
========================= */

// Shared Likert scale options for agreement questions.
const likertAgreementOptions: SurveyOption[] = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
];

/* =========================
   SURVEY QUESTIONS
========================= */

export const surveyQuestions: SurveyQuestion[] = [
  /* =========================
     INTRO
  ========================= */
  {
    id: "INTRO",
    section: "Introduction",
    type: "info",
    title:
      "Evaluation of Women Empowerment Initiatives at Reliance Foundation: Women Leaders India Fellowship",
    description:
      "Thank you for taking the time to participate in this survey. This questionnaire is part of the independent evaluation of the Women Leaders India (WLI) Fellowship, commissioned by the Reliance Foundation. The purpose of the study is to understand how the Fellowship has contributed to your leadership journey, professional growth, and the outcomes of your work. Your responses will help generate valuable insights on what is working well, how the programme has supported Fellows, and how future Fellowship cycles can be further strengthened. The survey should take approximately 10-15 minutes to complete. All information shared will be treated with strict confidentiality and reported only in aggregated form. Participation in this study is entirely voluntary.",
  },

  /* =========================
     SECTION A - FELLOWSHIP INFO
  ========================= */
  {
    id: "QA1",
    section: "Fellowship Information",
    type: "single",
    title: "Please select the cohort you participated in as part of the Fellowship.",
    options: [
      { value: "cohort1", label: "Cohort 1 (2022-2023)" },
      { value: "cohort2", label: "Cohort 2 (2024-2025)" },
    ],
  },

  /* =========================
     SECTION B - PROFILE & CONTEXT
  ========================= */
  {
    id: "QB1",
    section: "Profile & Context",
    type: "single",
    title: "What is your age group?",
    options: [
      { value: "18-24", label: "18-24" },
      { value: "25-34", label: "25-34" },
      { value: "35-44", label: "35-44" },
      { value: "45-54", label: "45-54" },
      { value: "55+", label: "55 or older" },
    ],
  },
  {
    id: "QB2",
    section: "Profile & Context",
    type: "text",
    title: "What is your state of residence?",
  },
  {
    id: "QB3",
    section: "Profile & Context",
    type: "single",
    title: "How many years have you been engaged in leadership or initiative-driven work?",
    options: [
      { value: "0-2", label: "0-2 years" },
      { value: "3-5", label: "3-5 years" },
      { value: "6-10", label: "6-10 years" },
      { value: "10+", label: "10+ years" },
    ],
  },
  {
    id: "QB4",
    section: "Profile & Context",
    type: "single",
    title: "What was your primary track in the fellowship?",
    options: [
      { value: "economic", label: "Social Entrepreneurs" },
      { value: "social", label: "Social Sector Leaders" },
      {
        value: "changemakers",
        label: "Changemakers",
        hideWhen: {
          questionId: "QA1",
          value: "cohort2",
        },
      },
    ],
  },
  {
    id: "QB5",
    section: "Profile & Context",
    type: "single",
    title: "In what sector do you mainly work?",
    options: [
      { value: "ngo", label: "NGO/Civil society/Non-profit sector" },
      { value: "social_enterprise", label: "Social Enterprise" },
      { value: "business", label: "Business/private for-profit sector" },
      { value: "government", label: "Government/public sector" },
      { value: "multilateral", label: "Multilateral agency" },
      { value: "other", label: "Other (specify)", requiresText: true },
    ],
  },

  /* =========================
     SECTION C - PARTICIPATION DOSE
  ========================= */
  {
    id: "QC1",
    section: "Participation",
    type: "single",
    title:
      "During the WLI Fellowship, how many of the learning or training sessions did you attend?",
    options: [
      { value: "75-100", label: "Attended most sessions (75-100%)" },
      { value: "50-74", label: "Attended many sessions (50-74%)" },
      { value: "25-49", label: "Attended some sessions (25-49%)" },
      { value: "<25", label: "Attended few sessions (less than 25%)" },
      { value: "dont_remember", label: "Do not remember" },
    ],
  },
  {
    id: "QC2",
    section: "Participation",
    type: "single",
    title: "Did you undergo one-on-one mentorship as part of the WLI Fellowship?",
    options: [
      { value: 1, label: "Yes" },
      { value: 0, label: "No" },
    ],
  },
  {
    id: "QC3",
    section: "Participation",
    type: "single",
    title:
      "If yes, approximately how many times did you interact with your mentor during the fellowship?",
    condition: { questionId: "QC2", value: 1 },
    options: [
      { value: "1-2", label: "1-2 times" },
      { value: "3-5", label: "3-5 times" },
      { value: "6-10", label: "6-10 times" },
      { value: "10+", label: "More than 10 times" },
    ],
  },
  {
    id: "QC4",
    section: "Participation",
    type: "single",
    title: "Overall, how helpful was the mentorship you received?",
    condition: { questionId: "QC2", value: 1 },
    options: [
      { value: "not_at_all", label: "Not at all helpful" },
      { value: "slightly", label: "Slightly helpful" },
      { value: "moderately", label: "Moderately helpful" },
      { value: "very", label: "Very helpful" },
      { value: "extremely", label: "Extremely helpful" },
    ],
  },
  {
    id: "QC5",
    section: "Participation",
    type: "single",
    title:
      "During the fellowship period, how often did you interact or engage with other fellows?",
    options: [
      { value: "weekly", label: "Weekly" },
      { value: "fortnightly", label: "Fortnightly" },
      { value: "monthly", label: "Monthly" },
      { value: "rarely", label: "Rarely" },
      { value: "never", label: "Never" },
    ],
  },
  {
    id: "QC6",
    section: "Participation",
    type: "multi",
    title:
      "Which of the following exposure or visibility opportunities did you experience through the WLI Fellowship?",
    options: [
      { value: "speaking", label: "Speaking opportunities or panel discussions" },
      { value: "media", label: "Media features or public recognition" },
      {
        value: "networking",
        label: "Networking with Reliance Foundation / Vital Voices / guest speakers",
      },
      {
        value: "showcases",
        label: "Showcases, demos, or public presentations of your work",
      },
      {
        value: "introductions",
        label: "Introductions to partners, funders, or collaborators",
      },
      {
        value: "none",
        label: "None of the above",
        exclusive: true,
      },
    ],
  },
  {
    id: "QC7",
    section: "Participation",
    type: "multi",
    title:
      "Thinking about your overall WLI experience, which TWO components were the most valuable for your leadership journey?",
    maxSelect: 2,
    options: [
      { value: "learning", label: "Learning modules / training sessions" },
      { value: "mentorship", label: "Mentorship" },
      { value: "peer_network", label: "Peer network (other fellows)" },
      { value: "exposure", label: "Exposure / visibility opportunities" },
      { value: "seed_support", label: "Seed support or technical assistance" },
      { value: "other", label: "Other (specify)", requiresText: true },
    ],
  },

  /* =========================
     SECTION D - LEADERSHIP OUTCOMES
  ========================= */
  {
    id: "QD1",
    section: "Leadership Outcomes",
    type: "single",
    title: "I feel confident speaking in influential or professional spaces.",
    options: likertAgreementOptions,
  },
  {
    id: "QD2",
    section: "Leadership Outcomes",
    type: "single",
    title: "I see myself as a stronger leader.",
    options: likertAgreementOptions,
  },
  {
    id: "QD3",
    section: "Leadership Outcomes",
    type: "single",
    title: "I am comfortable taking on challenging leadership responsibilities.",
    options: likertAgreementOptions,
  },
  {
    id: "QD4",
    section: "Leadership Outcomes",
    type: "single",
    title: "I am more likely to speak up and advocate for myself or others.",
    options: likertAgreementOptions,
  },
  {
    id: "QD5",
    section: "Leadership Outcomes",
    type: "single",
    title: "My influence in important decisions has increased.",
    options: likertAgreementOptions,
  },
  {
    id: "QD6",
    section: "Leadership Outcomes",
    type: "single",
    title: "I take initiative more often than before.",
    options: likertAgreementOptions,
  },
  {
    id: "QD7",
    section: "Leadership Outcomes",
    type: "single",
    title: "I actively apply WLI learning in my leadership work.",
    options: likertAgreementOptions,
  },
  {
    id: "QD8",
    section: "Leadership Outcomes",
    type: "single",
    title: "I have changed my leadership practices as a result of WLI.",
    options: likertAgreementOptions,
  },
  {
    id: "QD9",
    section: "Leadership Outcomes",
    type: "single",
    title: "Since completing WLI, have you taken on a new or higher leadership role?",
    options: [
      { value: 1, label: "Yes" },
      { value: 0, label: "No" },
    ],
  },
  {
    id: "QD10",
    section: "Leadership Outcomes",
    type: "single",
    title: "If yes, where?",
    condition: { questionId: "QD9", value: 1 },
    options: [
      { value: "workplace", label: "Workplace" },
      { value: "community", label: "Community" },
      { value: "both", label: "Both" },
    ],
  },
  {
    id: "QD11",
    section: "Leadership Outcomes",
    type: "single",
    title: "Since WLI, my visibility and recognition as a leader has increased.",
    options: likertAgreementOptions,
  },

  /* =========================
     SECTION E - ORGANISATIONAL & PROJECT CHANGE
  ========================= */
  {
    id: "QE1",
    section: "Organisational & Project Change",
    type: "multi",
    title: "Which of the following organisational changes have you made since WLI?",
    options: [
      { value: "strategy", label: "Strategy or growth planning" },
      {
        value: "governance",
        label: "Governance systems (board, policies, compliance, accountability)",
      },
      { value: "operations", label: "Operations & management systems" },
      { value: "team", label: "Team structure or hiring" },
      { value: "new_products", label: "New products or services" },
      { value: "fundraising", label: "Fundraising / resource mobilisation" },
      { value: "new_initiative", label: "Started a new initiative" },
      { value: "none", label: "None of the above", exclusive: true },
      { value: "other", label: "Other (specify)", requiresText: true },
    ],
  },
  {
    id: "QE1_1",
    section: "Organisational & Project Change",
    type: "single",
    title: "To what extent did the WLI Fellowship contribute to these changes?",
    condition: {
      questionId: "QE1",
      predicate: (answer) =>
        Array.isArray(answer) && answer.length > 0 && !answer.includes("none"),
    },
    options: [
      { value: 1, label: "Not at all" },
      { value: 2, label: "Slightly" },
      { value: 3, label: "Moderately" },
      { value: 4, label: "Significantly" },
      { value: 5, label: "Very significantly" },
    ],
  },
  {
    id: "QE2",
    section: "Organisational & Project Change",
    type: "multi",
    title:
      "Which of the following changes have occurred in your SDG project or community work since WLI?",
    options: [
      { value: "strengthened_focus", label: "Strengthened focus or redesign of SDG initiative" },
      { value: "expansion", label: "Expansion to new communities or locations" },
      { value: "measurement", label: "Improved measurement or reporting of SDG impact" },
      {
        value: "community_practices",
        label: "Changes in community practices or norms influenced by your work",
      },
      { value: "policy", label: "Policy engagement or advocacy" },
      {
        value: "partnerships",
        label: "Institutional partnerships or collaborations",
      },
      { value: "none", label: "None of the above", exclusive: true },
      { value: "other", label: "Other (specify)", requiresText: true },
    ],
  },
  {
    id: "QE2_1",
    section: "Organisational & Project Change",
    type: "single",
    title: "To what extent did the WLI Fellowship contribute to these changes?",
    condition: {
      questionId: "QE2",
      predicate: (answer) =>
        Array.isArray(answer) && answer.length > 0 && !answer.includes("none"),
    },
    options: [
      { value: 1, label: "Not at all" },
      { value: 2, label: "Slightly" },
      { value: 3, label: "Moderately" },
      { value: 4, label: "Significantly" },
      { value: 5, label: "Very significantly" },
    ],
  },
  {
    id: "QE3",
    section: "Organisational & Project Change",
    type: "multi",
    title: "Which of the following reflect longer-term change since WLI?",
    options: [
      { value: "replication", label: "Replication or adaptation of my model in new locations" },
      {
        value: "institutionalisation",
        label: "Institutionalisation of new practices within my organisation",
      },
      { value: "continued_growth", label: "Continued growth of my SDG project" },
      { value: "sustainability", label: "Increased financial sustainability" },
      { value: "none", label: "None of the above", exclusive: true },
      { value: "other", label: "Other (specify)", requiresText: true },
    ],
  },
  {
    id: "QE3_1",
    section: "Organisational & Project Change",
    type: "single",
    title: "To what extent did the WLI Fellowship contribute to these changes?",
    condition: {
      questionId: "QE3",
      predicate: (answer) =>
        Array.isArray(answer) && answer.length > 0 && !answer.includes("none"),
    },
    options: [
      { value: 1, label: "Not at all" },
      { value: 2, label: "Slightly" },
      { value: 3, label: "Moderately" },
      { value: 4, label: "Significantly" },
      { value: 5, label: "Very significantly" },
    ],
  },

  /* =========================
     SECTION F - NETWORKS & OPPORTUNITIES
  ========================= */
  {
    id: "QF1",
    section: "Networks & Opportunities",
    type: "single",
    title: "Since WLI, I have gained useful connections that helped advance my work.",
    options: likertAgreementOptions,
  },
  {
    id: "QF2",
    section: "Networks & Opportunities",
    type: "multi",
    title: "What outcomes resulted from these connections?",
    condition: { questionId: "QF1", values: [4, 5] },
    options: [
      { value: "partnership", label: "Partnership or collaboration" },
      { value: "funding", label: "Funding opportunity" },
      { value: "speaking", label: "Speaking opportunity" },
      { value: "clients", label: "New clients / market linkages" },
      { value: "recruitment", label: "Recruitment / team building" },
      { value: "mentorship", label: "Ongoing mentorship / advice" },
      {
        value: "support",
        label: "Support or resources for SDG project implementation or scaling",
      },
      { value: "none_yet", label: "None yet" },
    ],
  },
  {
    id: "QF3",
    section: "Networks & Opportunities",
    type: "single",
    title: "Are you still connected with RF and VV teams?",
    options: [
      { value: 1, label: "Yes" },
      { value: 0, label: "No" },
    ],
  },
  {
    id: "QF4",
    section: "Networks & Opportunities",
    type: "multi",
    title: "What do you usually discuss?",
    condition: { questionId: "QF3", value: 1 },
    options: [
      { value: "updates", label: "Programme updates or follow-up activities" },
      { value: "advisory", label: "Mentorship or advisory support" },
      { value: "collaboration", label: "Opportunities for collaboration or partnerships" },
      { value: "funding", label: "Funding or resource mobilisation opportunities" },
      { value: "visibility", label: "Speaking, visibility, or platform opportunities" },
      { value: "sdg_support", label: "Support related to SDG project implementation or scaling" },
      {
        value: "leadership_guidance",
        label: "Organisational or leadership development guidance",
      },
      {
        value: "peer_connections",
        label: "Peer connections or introductions to other Fellows or partners",
      },
      { value: "informal", label: "Informal check-ins or relationship building" },
      { value: "other", label: "Other (please specify)", requiresText: true },
    ],
  },

  /* =========================
     SECTION G - COMPONENT OUTCOME CONTRIBUTION
  ========================= */
  {
    id: "QG1",
    section: "Component Outcome Contribution",
    type: "matrix",
    title: "For each outcome area, which WLI component contributed the most?",
    matrixRows: [
      { id: "confidence", label: "Confidence" },
      { id: "agency_voice", label: "Agency & voice" },
      { id: "decision_influence", label: "Decision influence" },
      { id: "leadership_role", label: "Leadership role" },
      { id: "organisational_change", label: "Organisational change" },
    ],
    matrixColumns: [
      { value: "learning", label: "Learning" },
      { value: "mentorship", label: "Mentorship" },
      { value: "peer_network", label: "Peer Network" },
      { value: "exposure", label: "Exposure" },
      { value: "no_change", label: "Did not experience change" },
    ],
  },
  {
    id: "QG2",
    section: "Component Outcome Contribution",
    type: "text",
    title:
      "Why did the selected component matter most for your leadership journey?",
    condition: {
      questionId: "QG1",
      predicate: (answer) =>
        typeof answer === "object" &&
        answer !== null &&
        Object.values(answer).some((value) => value !== "no_change"),
    },
  },

  /* =========================
     SECTION H - ENABLERS, BARRIERS & RECOMMENDATIONS
  ========================= */
  {
    id: "QH1",
    section: "Enablers, Barriers & Recommendations",
    type: "single",
    title: "What helped your progress the most?",
    options: [
      { value: "mentor_support", label: "Mentor support" },
      { value: "peer_network", label: "Fellowship peer network" },
      { value: "exposure", label: "Exposure & visibility platforms" },
      { value: "organisational_support", label: "Organisational support" },
      { value: "motivation", label: "Personal motivation" },
      { value: "family_support", label: "Family / community support" },
      { value: "funding", label: "Access to funding / resources" },
      { value: "other", label: "Other (specify)", requiresText: true },
    ],
  },
  {
    id: "QH2",
    section: "Enablers, Barriers & Recommendations",
    type: "single",
    title: "What was your biggest challenge after WLI?",
    options: [
      { value: "time", label: "Time constraints" },
      { value: "funding", label: "Funding limitations" },
      { value: "resistance", label: "Organisational resistance" },
      { value: "norms", label: "Social / gender norms" },
      { value: "networks", label: "Limited networks" },
      { value: "other", label: "Other (specify)", requiresText: true },
    ],
  },
  {
    id: "QH3",
    section: "Enablers, Barriers & Recommendations",
    type: "text",
    title:
      "What are your top three suggestions to strengthen WLI for future cohorts?",
  },
  {
    id: "QH4",
    section: "Enablers, Barriers & Recommendations",
    type: "multi",
    title:
      "What were the top three challenges you experienced during the WLI Fellowship?",
    maxSelect: 3,
    options: [
      {
        value: "time_commitment",
        label: "Time commitment alongside professional or personal responsibilities",
      },
      { value: "scheduling", label: "Programme scheduling or pacing" },
      {
        value: "expectations",
        label: "Clarity of programme expectations or milestones",
      },
      { value: "coordination", label: "Coordination or communication during programme delivery" },
      {
        value: "mentors",
        label: "Access to mentors or frequency of mentorship sessions",
      },
      {
        value: "alignment",
        label: "Alignment between programme content and my specific needs",
      },
      {
        value: "digital",
        label: "Digital access or technology related challenges",
      },
      {
        value: "networking",
        label: "Networking or engagement opportunities with peers",
      },
      {
        value: "logistics",
        label: "Operational or logistical challenges during convenings or activities",
      },
      { value: "none", label: "None of the above", exclusive: true },
      { value: "other", label: "Other (please specify)", requiresText: true },
    ],
  },
  {
    id: "QH5",
    section: "Enablers, Barriers & Recommendations",
    type: "multi",
    title: "Overall, how has the WLI Fellowship contributed to your leadership journey?",
    options: [
      {
        value: "confidence_identity",
        label: "Significantly strengthened my leadership confidence and identity",
      },
      {
        value: "influence_roles",
        label: "Improved my ability to influence decisions and take leadership roles",
      },
      {
        value: "skills_application",
        label: "Enhanced my leadership skills and practical application of learning",
      },
      {
        value: "networks_visibility",
        label: "Expanded my professional networks and visibility",
      },
      { value: "organisation", label: "Strengthened my organisation or SDG project" },
      {
        value: "direction",
        label: "Helped clarify my leadership direction or purpose",
      },
      { value: "marginal", label: "Contributed only marginally" },
      {
        value: "did_not_contribute",
        label: "Did not contribute significantly",
        exclusive: true,
      },
      { value: "other", label: "Other (please specify)", requiresText: true },
    ],
  },
  {
    id: "QH6",
    section: "Enablers, Barriers & Recommendations",
    type: "multi",
    title: "In what ways has the mentorship component of the Fellowship benefited you?",
    options: [
      {
        value: "strategic_guidance",
        label: "Strategic guidance on leadership or career decisions",
      },
      {
        value: "organisation_support",
        label: "Support in strengthening my organisation or SDG project",
      },
      { value: "confidence", label: "Increased confidence and motivation" },
      {
        value: "networks",
        label: "Access to networks, introductions, or opportunities",
      },
      { value: "problem_solving", label: "Practical problem-solving and advice" },
      {
        value: "perspectives",
        label: "Exposure to new perspectives or ways of working",
      },
      {
        value: "advisory_relationship",
        label: "Ongoing advisory relationship beyond the Fellowship",
      },
      {
        value: "not_helpful",
        label: "Mentorship was not particularly helpful",
      },
      {
        value: "no_mentorship",
        label: "I did not receive mentorship",
        exclusive: true,
      },
      { value: "other", label: "Other (please specify)", requiresText: true },
    ],
  },
  {
    id: "QH7",
    section: "Email Address",
    type: "email",
    title:
      "What is your email address",
  },
];
