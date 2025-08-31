# Dictionary Backend Setup

This sets up a local dictionary backend using JMdict (words) and KANJIDIC2 (kanji) data.

## Prerequisites

1. **Database Tables**: Run the SQL from the main README to create the required tables
2. **Environment Variables**: Ensure `.env.local` has:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Source Files

Place these files in `/data/dict/`:

- **`jmdict.json`** - JMdict JSON build (e.g., "jmdict-simplified" English)
- **`kanjidic2.xml`** - Official EDRDG KANJIDIC2 XML file

## Import Commands

```bash
# Import JMdict (words)
npm run dict:jmdict

# Import KANJIDIC2 (kanji)  
npm run dict:kanji
```

## Usage Examples

### Word Lookup
```sql
-- Find words by kanji
SELECT * FROM jmdict_entries 
WHERE '学校' = ANY(headwords) 
LIMIT 5;

-- Find words by reading
SELECT * FROM jmdict_entries 
WHERE 'がっこう' = ANY(readings) 
LIMIT 5;

-- Search with trigram (fuzzy)
SELECT * FROM jmdict_entries 
WHERE search_text % '学校'
LIMIT 5;
```

### Kanji Lookup
```sql
-- Get kanji details
SELECT * FROM kanjidic2 
WHERE kanji = '学';

-- Find kanji by grade
SELECT kanji, meanings_en, on_readings, kun_readings 
FROM kanjidic2 
WHERE grade = 1 
LIMIT 10;
```

## Data Structure

### JMdict Entries
- `seq`: Unique sequence ID
- `headwords`: Array of kanji forms
- `readings`: Array of kana readings
- `glosses_en`: Array of English meanings
- `is_common`: Boolean for common words
- `pos_tags`: Part-of-speech tags
- `freq_tags`: Frequency tags (ichi1, news2, etc.)
- `search_text`: Searchable text (auto-generated)

### KANJIDIC2
- `kanji`: Single kanji character
- `grade`: School grade (1-8, null for non-jouyou)
- `jlpt`: JLPT level
- `strokes`: Stroke count
- `on_readings`: On-yomi readings
- `kun_readings`: Kun-yomi readings
- `meanings_en`: English meanings
- `jouyou`: Boolean for jouyou kanji

## Attribution

Remember to add this to your UI:
"Contains dictionary data from JMdict and KANJIDIC2, © EDRDG, used under CC BY-SA 4.0." 