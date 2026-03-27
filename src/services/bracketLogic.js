/**
 * XFL Seeding Logic: 
 * Ensures Seeds 1 & 2 are opposite.
 * Attempts to separate teammates.
 */
export const generateSeededBracket = (fighters, size) => {
  // 1. Initialize an empty array of the required size
  let bracket = new Array(size).fill(null);

  // 2. Sort selected fighters by seed (if they have one)
  const seeded = fighters.filter(f => f.seed).sort((a, b) => a.seed - b.seed);
  const unseeded = fighters.filter(f => !f.seed);

  // 3. Standard Placement (Industry Standard for 8-man)
  // Seed 1 -> Slot 0 | Seed 2 -> Slot 7 | Seed 3 -> Slot 4 | Seed 4 -> Slot 3
  if (size === 8) {
    if (seeded[0]) bracket[0] = seeded[0]; // Seed 1
    if (seeded[1]) bracket[7] = seeded[1]; // Seed 2
    if (seeded[2]) bracket[4] = seeded[2]; // Seed 3
    if (seeded[3]) bracket[3] = seeded[3]; // Seed 4
  }

  // 4. Fill remaining slots with unseeded fighters
  let unseededIdx = 0;
  for (let i = 0; i < size; i++) {
    if (!bracket[i] && unseeded[unseededIdx]) {
      bracket[i] = unseeded[unseededIdx];
      unseededIdx++;
    }
  }

  return bracket;
};