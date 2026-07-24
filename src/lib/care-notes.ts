import type { CareNoteDraft, TaskObservation } from "./domain";
export function draftGroundedCareNote(input: { clientName: string; observations: TaskObservation[]; generalObservation?: string }): CareNoteDraft {
  const completedTasks = input.observations.filter((item) => item.completed).map((item) => item.task);
  const unconfirmedTasks = input.observations.filter((item) => !item.completed).map((item) => item.task);
  const observations = input.observations.map((item) => item.observation?.trim()).filter((value): value is string => Boolean(value));
  if (input.generalObservation?.trim()) observations.push(input.generalObservation.trim());
  const completedText = completedTasks.length ? `Documented completed support: ${completedTasks.join(", ")}.` : "No tasks were marked complete in the submitted evidence.";
  const unconfirmedText = unconfirmedTasks.length ? `Not confirmed as completed: ${unconfirmedTasks.join(", ")}.` : "All scheduled tasks have explicit completion evidence.";
  const observationText = observations.length ? `Recorded observations: ${observations.join(" ")}` : "No additional observations were recorded.";
  return { summary: `${input.clientName}'s visit record states: ${completedText} ${unconfirmedText} ${observationText}`, completedTasks, unconfirmedTasks, observations, requiresReview: true };
}
