import 'server-only';
import { randomInt } from 'node:crypto';

// No look-alike characters (0/O, 1/l/I), so a password read over the phone or WhatsApp isn't mistyped.
const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnpqrstuvwxyz';
const DIGITS = '23456789';
const SYMBOLS = '@#$%&*!?';
const ALL = UPPER + LOWER + DIGITS + SYMBOLS;

/** 14-character temporary password with at least one of each character type (~85 bits). */
export function generatePassword(length = 14): string {
  const chars = [UPPER, LOWER, DIGITS, SYMBOLS].map((set) => set[randomInt(set.length)]);
  while (chars.length < length) chars.push(ALL[randomInt(ALL.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}
