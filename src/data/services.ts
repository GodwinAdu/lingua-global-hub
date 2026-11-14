// Server-safe service summaries used for routing and SEO metadata.
// The full page content lives in src/views/ServiceDetailPage.tsx until it moves to the CMS.
export const serviceSummaries = [
  {
    id: 'translation',
    title: 'Translation Services',
    description:
      'Culturally-adapted translation that resonates with your target audience while keeping the integrity of your original message.',
  },
  {
    id: 'interpretation',
    title: 'Interpretation Services',
    description:
      'Professional interpreters for international conferences, business meetings and events, conveying every word with precision.',
  },
  {
    id: 'voiceover',
    title: 'Voice-over Production',
    description: 'Studio-quality voice-over in any language for commercials, documentaries and more.',
  },
  {
    id: 'jingle',
    title: 'Jingle Recording',
    description: 'Custom jingles that capture your brand essence, crafted by our composers and vocalists.',
  },
  {
    id: 'editing',
    title: 'Editing & Proofreading',
    description: 'Comprehensive editing and proofreading for clear, consistent and impactful text.',
  },
  {
    id: 'scriptwriting',
    title: 'Script Writing',
    description: 'Engaging scripts for commercials, documentaries and any other medium.',
  },
] as const;

export function getServiceSummary(id: string) {
  return serviceSummaries.find((s) => s.id === id);
}
