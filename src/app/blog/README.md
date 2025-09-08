# Blog Structure

This directory contains the blog functionality for the Language Teacher website.

## Structure

```
src/app/blog/
├── page.tsx                    # Main blog page with category listing
├── [category]/
│   ├── page.tsx               # Category page (e.g., /blog/book-reviews)
│   └── [slug]/
│       └── page.tsx           # Individual blog entry (e.g., /blog/book-reviews/norwegian-wood-review)
└── README.md                  # This file
```

## Categories

- **Book Reviews** (`/blog/book-reviews`) - Reviews of books, from language learning to fiction
- **Travel** (`/blog/travel`) - Travel experiences and language learning adventures  
- **Movies** (`/blog/movies`) - Movie reviews and film analysis

## Data Structure

All blog data is centralized in `src/lib/blog.ts` with the following interfaces:

### BlogCategory
```typescript
interface BlogCategory {
  slug: string
  title: string
  description: string
  color: string
  icon: string
  entryCount?: number
}
```

### BlogEntry
```typescript
interface BlogEntry {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  rating?: number
  tags?: string[]
  author: string
  category: string
  published?: boolean
  featured?: boolean
}
```

## Adding New Content

### Adding a New Category

1. Add the category to `BLOG_CATEGORIES` in `src/lib/blog.ts`
2. Add sample entries to `SAMPLE_BLOG_ENTRIES` in the same file
3. The routing will automatically work with the new category

### Adding a New Blog Entry

1. Add the entry to the appropriate category in `SAMPLE_BLOG_ENTRIES` in `src/lib/blog.ts`
2. The entry will automatically appear on the category page and main blog page

### Example Entry

```typescript
'my-new-entry': {
  slug: 'my-new-entry',
  title: 'My New Blog Post',
  excerpt: 'A brief description of the post...',
  content: '<p>Full HTML content here...</p>',
  date: '2024-01-20',
  readTime: '5 min read',
  rating: 4,
  tags: ['tag1', 'tag2'],
  author: 'Language Teacher',
  category: 'book-reviews',
  published: true,
  featured: false
}
```

## Features

- **Responsive Design**: Works on all device sizes
- **SEO Optimized**: Proper meta tags and structured data
- **Category Navigation**: Easy browsing by topic
- **Tag System**: Organize content with tags
- **Rating System**: Star ratings for reviews
- **Read Time**: Automatic reading time calculation
- **Breadcrumb Navigation**: Easy navigation between pages
- **Search Ready**: Structure supports easy search implementation

## Future Enhancements

- Database integration (Supabase)
- Search functionality
- Comments system
- Newsletter integration
- Admin panel for content management
- Image optimization
- Social sharing
- Related posts
- RSS feed
