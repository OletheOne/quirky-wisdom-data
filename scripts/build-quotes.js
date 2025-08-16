// scripts/build-quotes.js
import fs from "fs/promises";

async function fetchFromSourceA() {
  // Example: return an array of strings
  // Replace with real fetch() calls to your preferred APIs
  return [
    "Direction beats speed when the map is wrong.",
    "Constraints are the artist’s secret superpower."
  ];
}

async function fetchFromSourceB() {
  // Example: return objects you then map/clean
  return [
    { text: "Sleep is a power-up, not a pause." },
    { text: "Keyboard shortcuts are spells. Learn the incantations." }
  ].map(x => x.text);
}

// Optional: add your own hardcoded “house” quotes
const houseSerious = [
  "Simplicity is a feature you ship every day.",
  "You learn faster when you teach sooner."
];
const houseFunny = [
  "A meeting is an email that wanted to feel important.",
  "If at first you don’t succeed, rename it v2-final-FINAL."
];

function dedupe(arr) {
  return Array.from(new Set(arr.map(s => s.trim()).filter(Boolean)));
}

function pickMax(arr, n) {
  return arr.slice(0, n);
}

async function main() {
  const [a, b] = await Promise.all([fetchFromSourceA(), fetchFromSourceB()]);
  const funny = dedupe([...houseFunny, ...b]);
  const serious = dedupe([...houseSerious, ...a]);

  // Optional: blend to a single pool too
  const custom = dedupe([...serious, ...funny]);

  // Choose one of your app’s supported shapes
  const output = {
    serious: pickMax(serious, 100),
    funny: pickMax(funny, 100),
    // You can add metadata; your app ignores extras safely
    updated_at: new Date().toISOString(),
    source: "GitHub Actions auto-build"
  };

  await fs.writeFile("quotes.json", JSON.stringify(output, null, 2), "utf8");
  console.log("Wrote quotes.json with", output.serious.length, "serious and", output.funny.length, "funny");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});