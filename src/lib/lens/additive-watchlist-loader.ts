/**
 * Server-only loader for the additive watchlist (CHK-7.1c). Reads the cited YAML file from disk at
 * request time (fine in a serverless function) and parses it with the fs-free pure parser. Kept
 * SEPARATE from additive-watchlist.ts so the pure parser stays Node-testable without touching fs, and
 * so this fs import never reaches a client bundle (the Lens engine is server-only).
 *
 * Loads once and memoizes. Never throws — a missing/unreadable file degrades to [] (the rubric then
 * simply surfaces no additive findings, exactly like an empty panel).
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseAdditiveWatchlist, type AdditiveEntry } from './additive-watchlist.ts';

// Resolve the YAML relative to this module so it works from the built serverless bundle too.
const WATCHLIST_URL = new URL('../../data/additive-watchlist.yaml', import.meta.url);

let cache: AdditiveEntry[] | null = null;

export async function getAdditiveWatchlist(): Promise<AdditiveEntry[]> {
  if (cache) return cache;
  try {
    const text = await readFile(fileURLToPath(WATCHLIST_URL), 'utf8');
    cache = parseAdditiveWatchlist(text);
  } catch {
    cache = [];
  }
  return cache;
}
