import fs from "fs";
import path from "path";
import fg from "fast-glob";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// columns in your table (lowercase)
const COLS = {
  kDefinition: "kdefinition",
  kMandarin: "kmandarin",
  kCantonese: "kcantonese",
  kTotalStrokes: "ktotalstrokes",
  kRSUnicode: "krsunicode",
  kSimplifiedVariant: "ksimplifiedvariant",
  kTraditionalVariant: "ktraditionalvariant",
  kSemanticVariant: "ksemanticvariant",
  kSpecializedSemanticVariant: "kspecializedsemanticvariant",
  kZVariant: "kzvariant",
};

const ARRAYISH = new Set([
  "kMandarin",
  "kCantonese",
  "kSimplifiedVariant",
  "kTraditionalVariant",
  "kSemanticVariant",
  "kSpecializedSemanticVariant",
  "kZVariant",
]);

function codepointToChar(uplus) {
  const hex = uplus.replace("U+", "");
  return String.fromCodePoint(parseInt(hex, 16));
}

function normArrayish(prop, val) {
  // split on ; or whitespace, keep U+XXXX tokens intact
  return val
    .replace(/,/g, " ")
    .split(/[;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseOfficialLine(line) {
  if (!line || line.startsWith("#")) return null;
  const parts = line.split("\t");
  if (parts.length < 3) return null;
  const [uplus, prop, rawVal] = parts;
  const char = codepointToChar(uplus);
  const codepoint = parseInt(uplus.replace("U+", ""), 16);
  const val = ARRAYISH.has(prop) ? normArrayish(prop, rawVal) : rawVal.trim();
  return { char, codepoint, prop, val };
}

function parseDraftLine(line) {
  if (!line || line.startsWith("#")) return null;
  const parts = line.split("\t");
  if (parts.length < 3) return null;
  let [uplus, maybeChar, prop, rawVal] = parts;
  // Some draft files include the actual char, some don't.
  if (!rawVal) {
    rawVal = prop;
    prop = maybeChar;
    maybeChar = codepointToChar(uplus);
  }
  const codepoint = parseInt(uplus.replace("U+", ""), 16);
  const char = maybeChar && maybeChar.length ? maybeChar : codepointToChar(uplus);
  const val = ARRAYISH.has(prop) ? normArrayish(prop, rawVal) : rawVal.trim();
  return { char, codepoint, prop, val };
}

function merge(rec, prop, val) {
  if (ARRAYISH.has(prop)) {
    const col = COLS[prop];
    rec[col] = Array.from(new Set([...(rec[col] || []), ...val]));
  } else if (prop === "kTotalStrokes") {
    // keep first integer if multiple present
    const n = parseInt(String(val).match(/\d+/)?.[0] ?? "", 10);
    if (!Number.isNaN(n)) rec[COLS[prop]] = n;
  } else if (COLS[prop]) {
    // only overwrite if empty
    if (rec[COLS[prop]] == null || rec[COLS[prop]] === "") {
      rec[COLS[prop]] = val;
    }
  } else {
    // dump anything extra into properties
    rec.properties ||= {};
    rec.properties[prop] = val;
  }
}

async function importFiles(paths) {
  const records = new Map(); // char -> row

  for (const file of paths) {
    const isOfficial = /Unihan_/.test(path.basename(file));
    const lines = fs.readFileSync(file, "utf8").split("\n");
    for (const line of lines) {
      const parsed = isOfficial ? parseOfficialLine(line) : parseDraftLine(line);
      if (!parsed) continue;
      const { char, codepoint, prop, val } = parsed;

      if (!records.has(char)) {
        records.set(char, {
          char,
          codepoint,
          kdefinition: null,
          kmandarin: null,
          kcantonese: null,
          ktotalstrokes: null,
          krsunicode: null,
          ksimplifiedvariant: null,
          ktraditionalvariant: null,
          ksemanticvariant: null,
          kspecializedsemanticvariant: null,
          kzvariant: null,
          properties: {},
          sources: ["unihan"],
        });
      }
      merge(records.get(char), prop, val);
    }
  }

  // upsert in chunks
  const rows = Array.from(records.values());
  const chunkSize = 800;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase
      .from("hanzi_characters")
      .upsert(chunk, { onConflict: "char" });
    if (error) {
      console.error("Upsert error:", error);
      process.exit(1);
    }
    console.log(`Upserted ${i + chunk.length}/${rows.length}`);
  }
  console.log("✅ Done");
}

(async () => {
  // Pass in both your draft files and the official files
  // Example:
  // node scripts/import-unihan-official.js "temp/ch_characters/*.txt" "temp/Unihan/*.txt"
  const globs = process.argv.slice(2);
  if (!globs.length) {
    console.error("Usage: node scripts/import-unihan-official.js <glob1> <glob2> ...");
    process.exit(1);
  }
  const paths = await fg(globs, { dot: false });
  if (!paths.length) {
    console.error("No files matched.");
    process.exit(1);
  }
  await importFiles(paths);
})();
