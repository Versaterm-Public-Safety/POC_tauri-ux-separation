import type { TranscriptSegment } from './types.js';

// Mock conversation script - Spanish-speaking caller scenario
export const mockConversation: Array<{
  delay: number; // milliseconds after call start
  segment: TranscriptSegment;
}> = [
  // Initial greeting
  {
    delay: 500,
    segment: {
      speaker: 'telecommunicator',
      text: '911, what is your emergency?',
      timestamp: 0,
      isFinal: true,
    },
  },
  // Caller responds in Spanish (interim)
  {
    delay: 2000,
    segment: {
      speaker: 'caller',
      text: 'Ayuda por favor',
      timestamp: 0,
      isFinal: false,
    },
  },
  // Caller final
  {
    delay: 2500,
    segment: {
      speaker: 'caller',
      text: 'Ayuda por favor, hay un incendio en mi casa!',
      timestamp: 0,
      isFinal: true,
    },
  },
  // Telecommunicator response
  {
    delay: 4000,
    segment: {
      speaker: 'telecommunicator',
      text: 'I understand. Fire department is being dispatched. What is your address?',
      timestamp: 0,
      isFinal: true,
    },
  },
  // Caller provides address
  {
    delay: 6000,
    segment: {
      speaker: 'caller',
      text: 'Calle Principal 123, cerca del parque',
      timestamp: 0,
      isFinal: false,
    },
  },
  {
    delay: 6500,
    segment: {
      speaker: 'caller',
      text: 'Calle Principal 123, cerca del parque central',
      timestamp: 0,
      isFinal: true,
    },
  },
  // Telecommunicator confirms
  {
    delay: 8000,
    segment: {
      speaker: 'telecommunicator',
      text: 'Confirmed, 123 Main Street near the central park. Is everyone out of the building?',
      timestamp: 0,
      isFinal: true,
    },
  },
  // Caller responds
  {
    delay: 10000,
    segment: {
      speaker: 'caller',
      text: 'Si, todos estamos afuera',
      timestamp: 0,
      isFinal: false,
    },
  },
  {
    delay: 10500,
    segment: {
      speaker: 'caller',
      text: 'Si, todos estamos afuera y seguros',
      timestamp: 0,
      isFinal: true,
    },
  },
  // Final telecommunicator message
  {
    delay: 12000,
    segment: {
      speaker: 'telecommunicator',
      text: 'Good. Stay away from the building. Fire department is on the way, ETA 4 minutes.',
      timestamp: 0,
      isFinal: true,
    },
  },
  {
    delay: 14000,
    segment: {
      speaker: 'caller',
      text: 'Gracias, muchas gracias',
      timestamp: 0,
      isFinal: true,
    },
  },
];

export function getConversationDuration(): number {
  const lastSegment = mockConversation[mockConversation.length - 1];
  return lastSegment.delay + 2000; // Add buffer
}
