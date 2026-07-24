import type { Caregiver, ClientNeeds, MatchResult } from "./domain";
const overlap = (source: string[], target: string[]) => source.filter((value) => target.includes(value));
export function rankCaregivers(caregivers: Caregiver[], needs: ClientNeeds): MatchResult[] {
  return caregivers.map((caregiver) => {
    const skills = overlap(caregiver.skills, needs.skills);
    const languages = overlap(caregiver.languages, needs.languages);
    const slots = overlap(caregiver.availability, needs.preferredSlots);
    const skillScore = needs.skills.length ? (skills.length / needs.skills.length) * 45 : 45;
    const languageScore = needs.languages.length ? (languages.length / needs.languages.length) * 20 : 20;
    const scheduleScore = needs.preferredSlots.length ? (slots.length / needs.preferredSlots.length) * 20 : 20;
    const score = Math.round(Math.min(100, skillScore + languageScore + scheduleScore + caregiver.continuityScore * 0.1 + Math.max(0, 5 - caregiver.distanceMiles * 0.5)));
    return { ...caregiver, score, reasons: [skills.length ? `${skills.join(", ")} skill match` : "No required skill match", languages.length ? `${languages.join(", ")} language match` : "No preferred language match", slots.length ? `${slots.length} preferred time slot match` : "No preferred time overlap", `${caregiver.distanceMiles.toFixed(1)} miles away`] };
  }).sort((a, b) => b.score - a.score || a.distanceMiles - b.distanceMiles);
}
