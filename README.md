# Language Teacher

Master Japanese, Thai, and other languages with our interactive flashcard system. Learn characters, readings, and meanings through spaced repetition.

## Features

- **Interactive Flashcards**: 3D flip animations with audio support
- **Kanji Poster**: Visual grid of all Japanese kanji characters
- **Practice Module**: Quiz-based learning with multiple choice questions
- **Multi-language Support**: Japanese (Kanji, Hiragana, Katakana) and Thai characters
- **Audio Integration**: WAV file playback and text-to-speech fallback
- **User Authentication**: Secure login with Google OAuth and email/password

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth with Google OAuth
- **Deployment**: Vercel (recommended)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd languageteacher2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=your_production_domain (optional)
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Auth Setup & URLs

### 1. Environment & Platform Configuration

#### Supabase Setup
1. Create a new Supabase project
2. Copy your project URL and anon key to `.env.local`
3. Enable Google OAuth provider in Authentication → Providers
4. Configure URL settings in Authentication → URL Configuration

#### Google Cloud Console Setup
1. **Consent Screen**: External, scopes: `openid`, `email`, `profile`
2. **Authorized Domains**: Include `supabase.co` and your app domain
3. **OAuth Client (Web)**:
   - Authorized JS origins: `http://localhost:3000`, your prod domain
   - Authorized redirect URIs: `https://<PROJECT>.supabase.co/auth/v1/callback`

#### Supabase Dashboard Configuration
1. **Auth → Providers → Google**: Set client ID and secret
2. **Auth → URL Configuration**:
   - Site URL = your production domain
   - Additional Redirect URLs: `http://localhost:3000` + any Vercel preview domains

### 2. Authentication Flow

- **Login**: `/login` - Google OAuth + email/password
- **Callback**: `/auth/callback` - Handles OAuth redirects
- **Account**: `/account` - Protected user profile page
- **Password Reset**: `/auth/forgot` → `/auth/update-password`

### 3. Protected Routes

Use the `ProtectedRoute` component to wrap authenticated pages:
```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content requires authentication</div>
    </ProtectedRoute>
  )
}
```

## Database Schema

### Enhanced Japanese Kanji Table
```sql
CREATE TABLE japanese_kanji (
  id SERIAL PRIMARY KEY,
  letter VARCHAR(10) NOT NULL,
  name TEXT NOT NULL,
  reading TEXT NOT NULL,
  sound_equiv TEXT NOT NULL,
  level VARCHAR(50) NOT NULL,
  wav_file TEXT,
  
  -- Learning enhancement columns
  jlpt_level VARCHAR(2),
  frequency_rank INTEGER,
  stroke_order TEXT,
  radical_info TEXT,
  mnemonics TEXT,
  example_words TEXT[],
  example_sentences TEXT[],
  
  -- Spaced repetition
  last_reviewed TIMESTAMP,
  review_count INTEGER DEFAULT 0,
  mastery_level INTEGER DEFAULT 0,
  next_review TIMESTAMP,
  difficulty_score FLOAT DEFAULT 0,
  
  -- Performance tracking
  correct_answers INTEGER DEFAULT 0,
  incorrect_answers INTEGER DEFAULT 0,
  accuracy_rate FLOAT DEFAULT 0,
  time_to_answer_avg FLOAT,
  
  -- User experience
  user_notes TEXT,
  tags TEXT[],
  favorite BOOLEAN DEFAULT FALSE,
  hidden BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utility functions
│   └── ...                # Route pages
├── components/             # Shared components
└── lib/                   # Library code
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `NEXT_PUBLIC_SITE_URL`: Your production domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open a GitHub issue or contact the development team.
