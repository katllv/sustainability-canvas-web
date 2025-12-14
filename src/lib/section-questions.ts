import type { SectionType } from '@/api/impacts';

export const SECTION_TITLES: Record<SectionType, string> = {
  UVP: 'Unique Value Proposition',
  CS: 'Customer Segment',
  CR: 'Customer Relationship',
  CH: 'Channels',
  GO: 'Governance',
  KS: 'Key Stakeholders',
  KA: 'Key Activities',
  WM: 'Waste Management',
  KTR: 'Key Resources',
  CO: 'Cost Structure',
  RE: 'Revenue Streams',
};

export const SECTION_QUESTIONS: Record<SectionType, string[]> = {
  UVP: [
    'What unique value does the project deliver to customers?',
    'Which specific customer needs does the project satisfy?',
    'How does the organisation create social value for its stakeholders?',
  ],
  CS: [
    'Which customer groups are we targeting with this project?',
    'How can we tailor the project to meet their specific needs and preferences?',
  ],
  CR: [
    'What types of relationships do the target customer segments expect?',
    'What is the cost of maintaining these relationships?',
    'How do these relationships align with the overall business model?',
  ],
  CH: [
    'Through which channels do the customer segments prefer to be reached?',
    'Which channels are the most cost-effective?',
    'What are the impacts of these distribution channels?',
  ],
  GO: [
    'Are there regulations that may restrict the project\'s business model?',
    'How does governance ensure responsible and transparent project management?',
    'How does the project align with laws, ethical standards, and sustainable practices?',
  ],
  KS: [
    'Who are the key partners involved in the project?',
    'Who are the main suppliers, and what roles do they play?'
  ],
  KA: [
    'Which activities deliver value, reach customers, build relationships, and generate revenue?',
    'How can we integrate social sustainability, like fair labour and safety standards, into these activities?',
  ],
  WM: [
    'Does the project have an effective waste management plan in place?',
    'Have overall waste outputs increased, decreased, or stayed the same?',
    'Is hazardous waste being managed properly?',
    'Are digital technologies being leveraged to improve waste management?'
  ],
  KTR: [
    'What resources support value, channels, relationships, and revenue?',
    'How do these resources impact the project economically, environmentally, and socially?',
    'Which assets are available and utilized?'
  ],
  CO: [
    'What are the major costs involved in the business model?',
    'Which resources and activities are the least sustainable, and why?',
    'Are there more sustainable alternatives available, and do they make economic sense?'
  ],
  RE: [
    'Which are existing and possible revenue sources?',
    'What value are customers willing to pay for?',
    'What are customers currently paying, and what payment methods are they using?',
    'What payment options are available?',
    'Are customers willing to pay extra for sustainability, and are there pricing models that encourage sustainable customer behaviour?'
  ],
};
