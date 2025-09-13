# Chinese Phrase Generation System

A comprehensive AI-powered phrase generation system for Chinese language learning, built with Next.js, Supabase, and OpenAI Assistant API.

## 🏗️ System Architecture

### Core Components

1. **Database Layer** (`database/`)
   - `zh_cn_phrases_table.sql` - Main phrases table with full metadata
   - `zh_phrase_chars_table.sql` - Character relationship links
   - `phrase_generation_logs_table.sql` - Telemetry and analytics

2. **Service Layer** (`src/lib/services/`)
   - `phraseRequestNormalizer.ts` - Request validation and canonicalization
   - `phraseRepository.ts` - Database operations (find, insert, link)
   - `openaiClient.ts` - OpenAI Assistant integration
   - `phraseValidator.ts` - Business rule validation
   - `orchestrator.ts` - Main get-or-generate flow
   - `cacheService.ts` - In-memory caching layer
   - `rateLimiter.ts` - Request throttling
   - `backgroundJobs.ts` - Data maintenance tasks
   - `errorHandler.ts` - Error categorization and fallbacks

3. **API Layer** (`src/app/api/`)
   - `phrases/zh-cn/get/route.ts` - Main phrase generation endpoint

4. **UI Layer** (`src/app/phrases/`)
   - `page.tsx` - Main phrase generator interface
   - `components/PhraseRequestForm.tsx` - Request configuration form
   - `components/PhraseDisplay.tsx` - Phrase visualization and study tools

## 🚀 Features

### Phrase Generation
- **Level Systems**: HSK (1-6), Difficulty (1-10), Grade Band (1-12)
- **Phrase Types**: Phrases, Sentences, Chengyu (idioms)
- **Character Inclusion**: Custom character sets and predefined collections
- **Topic Focus**: Optional topic-based generation
- **Length Control**: Configurable maximum phrase length

### Smart Caching & Performance
- **Multi-tier Lookup**: Cache → Database Exact → Database Broader → AI Generate
- **Intelligent Fallbacks**: Relaxed constraints when exact matches unavailable
- **Rate Limiting**: 1 request per 5 seconds per IP
- **Background Processing**: Batch storage and character linking

### Quality Assurance
- **Business Rule Validation**: Character requirements, length limits, type constraints
- **Pinyin Consistency**: Tone marks and numbers validation
- **Level Appropriateness**: Confidence scoring and reasonableness checks
- **Quality Sweeper**: Periodic revalidation of stored phrases

### User Experience
- **Interactive Form**: Level selection, character picker, topic input
- **Rich Display**: Pinyin, translation, character breakdown, metadata
- **Study Mode**: Save phrases, toggle visibility, character analysis
- **Error Handling**: User-friendly messages with fallback phrases

## 📊 Database Schema

### zh_cn_phrases
```sql
- Core: phrase, translation_en, pinyin_marks[], pinyin_numbers[]
- Level: level_system, level_value, level_confidence
- Classification: type, topic, length, tags[]
- Analysis: char_set[], char_occurrences{}, include_chars_present[]
- Quality: quality_checks{}
- Tracking: request_* fields, batch_id, generated_at
```

### zh_phrase_chars
```sql
- Links: phrase_id, char, char_index
- Metadata: char_definition, char_pinyin, char_grade_level
```

### phrase_generation_logs
```sql
- Request: request_hash, canonical_request{}, decision_path
- Performance: db_lookup_ms, ai_generation_ms, validation_ms, total_ms
- Results: items_generated, items_validated, items_stored
- Context: user_id, ip_address, user_agent
```

## 🔄 Generation Flow

1. **Request Normalization**
   - Validate and canonicalize UI input
   - Apply defaults and constraints
   - Generate cache key

2. **Cache Lookup**
   - Check in-memory cache first
   - Return immediately if found

3. **Database Search**
   - Find exact matches (level, type, chars, length)
   - Fall back to broader matches (relaxed constraints)
   - Return best match if found

4. **AI Generation** (if no DB match)
   - Call OpenAI Assistant with structured prompt
   - Generate 3-5 phrases for batch storage
   - Validate against business rules

5. **Storage & Caching**
   - Store all valid phrases in database
   - Create character links for selected phrase
   - Cache result for future requests
   - Log generation metrics

## 🛠️ Setup Instructions

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup
```bash
# Run SQL files in order
psql -f database/zh_cn_phrases_table.sql
psql -f database/zh_phrase_chars_table.sql
psql -f database/phrase_generation_logs_table.sql
```

### Dependencies
```bash
npm install openai uuid @types/uuid
```

## 🎯 Usage Examples

### Basic Phrase Generation
```typescript
const request = {
  level: 2,
  level_system: 'HSK',
  type: 'phrase',
  topic: 'greetings',
  include_chars: ['你', '好'],
  count: 5,
  max_len: 8
};

const response = await fetch('/api/phrases/zh-cn/get', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request)
});
```

### Character Set Selection
```typescript
// Predefined sets
const hsk1Chars = ['一', '二', '三', '四', '五', '人', '大', '小', '中', '国'];
const basicChars = ['你', '好', '谢', '谢', '对', '不', '起'];

// Custom characters
const customChars = ['学', '生', '老', '师', '朋', '友'];
```

## 📈 Performance & Monitoring

### Metrics Tracked
- Database lookup times
- AI generation latency
- Validation success rates
- Cache hit ratios
- Error rates by type

### Background Jobs
- **Character Link Backfill**: Hourly, processes 100 phrases
- **Quality Sweeper**: Daily, revalidates 50 phrases
- **Log Cleanup**: Weekly, removes logs older than 90 days

### Error Handling
- **Retry Logic**: Exponential backoff for transient errors
- **Fallback Phrases**: Curated phrases when generation fails
- **User Messages**: Context-appropriate error messages
- **Logging**: Structured error logging with context

## 🔒 Security & Privacy

### Row Level Security (RLS)
- **Public Read**: Anyone can read phrases
- **Service Write**: Only service role can insert/update
- **User Logs**: Users can only see their own generation logs

### Rate Limiting
- **IP-based**: 1 request per 5 seconds
- **User-based**: Additional limits for authenticated users
- **Graceful Degradation**: Fallback responses when limits exceeded

## 🧪 Testing Strategy

### Test Coverage
- **Happy Path**: Normal generation flow
- **Cache Hits**: Cached phrase retrieval
- **Database Fallbacks**: Broader match scenarios
- **AI Generation**: End-to-end AI flow
- **Validation**: Business rule enforcement
- **Error Handling**: Various failure modes

### Test Data
- **Sample Phrases**: Curated test phrases for each level
- **Character Sets**: Predefined character collections
- **Edge Cases**: Boundary conditions and error scenarios

## 🚀 Future Enhancements

### Planned Features
- **Japanese Support**: JLPT levels and kanji phrases
- **User Progress**: Learning progress tracking
- **Spaced Repetition**: Intelligent phrase review scheduling
- **Community Features**: Shared phrase collections
- **Advanced Analytics**: Learning pattern analysis

### Technical Improvements
- **Redis Caching**: Replace in-memory cache with Redis
- **Queue System**: Background job processing with Bull/Agenda
- **CDN Integration**: Static asset optimization
- **Monitoring**: APM integration (DataDog, New Relic)

## 📝 API Reference

### POST /api/phrases/zh-cn/get

**Request Body:**
```typescript
{
  level: number;           // 1-6 for HSK, 1-10 for difficulty, 1-12 for grade
  level_system: string;    // 'HSK' | 'difficulty' | 'grade_band'
  type: string;            // 'phrase' | 'sentence' | 'chengyu'
  topic?: string;          // Optional topic focus
  include_chars?: string[]; // Required characters
  count?: number;          // Number to generate (1-50, default 10)
  max_len?: number;        // Max length (1-50, default 14)
}
```

**Response:**
```typescript
{
  phrase: PhraseRecord;    // Generated phrase with full metadata
  source: string;          // 'cache' | 'database_exact' | 'database_broader' | 'ai_generated'
  confidence: number;      // 0-1 confidence score
  generation_time_ms?: number; // AI generation time (if applicable)
  request: CanonicalRequest;   // Echo of canonicalized request
}
```

## 🤝 Contributing

### Development Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations
5. Start development server: `npm run dev`

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Comprehensive error handling
- Detailed logging

### Pull Request Process
1. Create feature branch
2. Add tests for new functionality
3. Update documentation
4. Ensure all tests pass
5. Submit PR with detailed description

---

This system provides a robust, scalable foundation for AI-powered language learning tools with comprehensive error handling, performance optimization, and user experience considerations.
