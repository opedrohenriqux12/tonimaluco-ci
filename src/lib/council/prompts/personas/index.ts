import type { AdvisorPersona } from './types';
import { helena } from './helena';
import { rafael } from './rafael';
import { byte } from './byte';
import { icaro } from './icaro';
import { marina } from './marina';
import { ze } from './ze';
import { lucia } from './lucia';

export type { AdvisorPersona } from './types';

export const PERSONAS: AdvisorPersona[] = [helena, rafael, byte, icaro, marina, ze, lucia];

const BY_ID = new Map(PERSONAS.map((p) => [p.id, p]));

export function getPersona(id: string): AdvisorPersona | undefined {
  return BY_ID.get(id);
}
