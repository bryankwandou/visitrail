import type { Caregiver, ScheduledVisit } from "./domain";
export const demoVisit: ScheduledVisit = {
  id: "visit-2048", clientName: "Evelyn Carter", caregiverName: "Maya Thompson", address: "1148 Oakridge Lane, Austin, TX",
  scheduledStart: "2026-07-24T09:00:00-05:00", scheduledEnd: "2026-07-24T10:30:00-05:00", serviceMinutes: 90,
  location: { latitude: 30.26762, longitude: -97.74298 }, tasks: ["Medication reminder", "Breakfast preparation", "Mobility support", "Wellbeing check"],
};
export const demoCaregivers: Caregiver[] = [
  { id: "cg-1", name: "Maya Thompson", skills: ["Dementia", "Mobility", "Medication"], languages: ["English", "Spanish"], availability: ["Weekday morning", "Saturday morning"], distanceMiles: 2.4, continuityScore: 96 },
  { id: "cg-2", name: "Jordan Lee", skills: ["Mobility", "Meal preparation", "Hospice"], languages: ["English", "Korean"], availability: ["Weekday morning", "Weekday evening"], distanceMiles: 4.8, continuityScore: 88 },
  { id: "cg-3", name: "Amara Wilson", skills: ["Dementia", "Medication", "Diabetes"], languages: ["English"], availability: ["Weekday afternoon"], distanceMiles: 1.7, continuityScore: 91 },
];
