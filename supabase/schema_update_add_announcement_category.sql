-- This SQL file adds the announcement category support to existing blog tables
-- Note: This is informational - categories are stored as TEXT[] arrays
-- and managed through the application code, not the database schema

-- The categories field is already defined as TEXT[] which allows any text values
-- No schema changes are needed - just ensure the application code uses:
--   - Japanese: 'お知らせ'
--   - English: 'Announcement'  
--   - Korean: '공지'

-- If you want to add constraints or indexes for the announcement category, you can use:
-- (Note: GIN indexes on arrays already exist for efficient category filtering)

-- Example: Find all posts with announcement category
-- SELECT * FROM blog_ja WHERE 'お知らせ' = ANY(categories);
-- SELECT * FROM blog_en WHERE 'Announcement' = ANY(categories);
-- SELECT * FROM blog_ko WHERE '공지' = ANY(categories);

-- Categories are now managed through the application:
-- 1. Admin panel: app/[locale]/admin/new/page.tsx and edit/[id]/page.tsx
-- 2. Frontend display: lib/i18n/translations.ts and app/[locale]/page.tsx

-- No database migration is required as the TEXT[] column type already supports
-- any number of categories including the new 'announcement' category.

