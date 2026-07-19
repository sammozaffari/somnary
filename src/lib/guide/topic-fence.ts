/**
 * Guide topic-fence (CHK-6.8a) — a DETERMINISTIC input gate that runs BEFORE the model on open
 * intake. Because it is not a model call, it cannot be jailbroken through the model: an off-topic or
 * abusive turn is rejected with a neutral redirect before a single token reaches the LLM.
 *
 * It is deliberately generous toward on-topic input (sleep is a broad subject and the concierge asks
 * open questions) and only rejects turns that show NO sleep/health signal at all, OR that are
 * abusive/prompt-injection attempts. Uses the SAME norm() as search, retrieval, and the ask engine,
 * so token matching is identical everywhere.
 *
 * Erasable TS; imported by src/lib/guide/engine.ts and by scripts/test-guide.mjs directly.
 */
import { norm } from '../search-rank.ts';
import type { RemedyRef } from '../ask/guardrails.ts';

export interface TopicFenceAllow {
  ok: true;
}
export interface TopicFenceReject {
  ok: false;
  reason: 'off-topic' | 'abusive';
  message: string;
}
export type TopicFenceResult = TopicFenceAllow | TopicFenceReject;

/** Neutral redirect — the concierge only helps find sleep-related reading on Somnary. */
export const OFF_TOPIC_MESSAGE =
  'I can only help you find sleep-related reading on Somnary. Tell me a little about your sleep — ' +
  'trouble falling asleep, staying asleep, an anxious mind at night, or the habits around it — and ' +
  "I'll point you to the right pages.";

/** Same neutral surface for abusive/injection input: no engagement, just the redirect. */
export const ABUSIVE_MESSAGE = OFF_TOPIC_MESSAGE;

// On-topic vocabulary — sleep, the symptoms, the habit levers, and the health-screener words the
// intake needs to hear. Whole-token matched against norm(input). Intentionally broad.
const TOPIC_TERMS = [
  'sleep',
  'sleeping',
  'asleep',
  'insomnia',
  'awake',
  'wake',
  'waking',
  'woke',
  'tired',
  'exhausted',
  'exhaustion',
  'fatigue',
  'fatigued',
  'rest',
  'rested',
  'restless',
  'drowsy',
  'nap',
  'naps',
  'napping',
  'bed',
  'bedtime',
  'night',
  'nights',
  'nighttime',
  'nightly',
  'nightmare',
  'nightmares',
  'dream',
  'dreams',
  'snore',
  'snoring',
  'apnea',
  'melatonin',
  'remedy',
  'remedies',
  'supplement',
  'supplements',
  'herb',
  'herbal',
  'tea',
  'caffeine',
  'coffee',
  'alcohol',
  'nightcap',
  'screen',
  'screens',
  'phone',
  'light',
  'schedule',
  'routine',
  'exercise',
  'nap',
  'anxiety',
  'anxious',
  'stress',
  'stressed',
  'worry',
  'worried',
  'racing',
  'relax',
  'calm',
  'pregnant',
  'pregnancy',
  'breastfeeding',
  'child',
  'kid',
  'toddler',
  'baby',
  'medication',
  'medications',
  'meds',
  'prescription',
  'doctor',
  'shift',
  'jetlag',
  'jet',
  'lag',
  'sleepy',
  'sedative',
  'grogginess',
  'groggy',
  'help',
  'trouble',
  'fall',
  'stay',
  'quality',
];

// Abuse / prompt-injection signals — matched on the ORIGINAL text (case-insensitive) so injection
// syntax (brackets, "system:") isn't normalized away. Any hit → neutral redirect, never the model.
const ABUSE_PATTERNS: RegExp[] = [
  /\bignore (all |any |your |the |previous |prior |above )*(instructions?|prompts?|rules?|guardrails?)\b/i,
  /\bdisregard (all |any |your |the |previous |prior |above )*(instructions?|prompts?|rules?)\b/i,
  /\byou are now\b|\bpretend (to be|you are)\b|\bact as\b|\brole[-\s]?play\b/i,
  /\b(system|developer|assistant)\s*(prompt|message|:)/i,
  /\bjailbreak\b|\bDAN\b|\bdo anything now\b/i,
  /\breveal (your |the )?(system )?(prompt|instructions?)\b|\bwhat (are|were) your (instructions?|rules?)\b/i,
  /\b(fuck|shit|bitch|asshole|cunt|dickhead|motherfucker)\b/i,
];

/**
 * Gate one raw intake turn. Order: abuse first (a hostile turn is rejected even if it name-drops
 * "sleep" to slip through), then topic. A turn passes topic if it contains ANY topic term OR names a
 * corpus remedy (via the SAME whole-token alias match the ask engine uses). Empty/whitespace → reject.
 */
export function checkTopic(text: string, remedies: RemedyRef[] = []): TopicFenceResult {
  const raw = typeof text === 'string' ? text : '';
  if (!raw.trim()) return { ok: false, reason: 'off-topic', message: OFF_TOPIC_MESSAGE };

  for (const re of ABUSE_PATTERNS) {
    if (re.test(raw)) return { ok: false, reason: 'abusive', message: ABUSIVE_MESSAGE };
  }

  const n = ` ${norm(raw)} `;
  const hasTopicTerm = TOPIC_TERMS.some((t) => n.includes(` ${t} `));
  if (hasTopicTerm) return { ok: true };

  // A named corpus remedy is on-topic even without a generic sleep word ("does valerian work?").
  const namesRemedy = remedies.some((r) =>
    [r.name, ...r.aliases].some((label) => {
      const l = norm(label);
      return l.length > 2 && n.includes(` ${l} `);
    }),
  );
  if (namesRemedy) return { ok: true };

  return { ok: false, reason: 'off-topic', message: OFF_TOPIC_MESSAGE };
}
