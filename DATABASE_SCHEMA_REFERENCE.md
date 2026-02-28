# 📊 DATABASE SCHEMA REFERENCE

## New Tables Added to GrowHubTips

### 1. `page_content` - Main Pages Storage

```sql
CREATE TABLE page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,           -- 'about', 'contact', 'privacy', 'affiliate'
  title VARCHAR(255) NOT NULL,
  meta_description VARCHAR(160),
  hero_title VARCHAR(255),
  hero_subtitle TEXT,
  hero_image VARCHAR(512),
  content JSONB,                               -- Flexible content structure
  sections JSONB,                              -- Array of page sections
  status page_content_status DEFAULT 'published', -- draft, published, archived
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_page_content_slug ON page_content(slug);
CREATE INDEX idx_page_content_status ON page_content(status);
```

### 2. `timeline_events` - About Page Timeline

```sql
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES page_content(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER,                               -- 1-12 for months
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),                            -- emoji or icon name
  image_url VARCHAR(512),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_timeline_page ON timeline_events(page_id);
CREATE INDEX idx_timeline_year ON timeline_events(year);
```

### 3. `team_members` - Team/Experts Grid

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES page_content(id) ON DELETE CASCADE,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,                 -- 'Lead Expert', 'Botanist', etc.
  bio TEXT,
  credentials TEXT,                            -- Expert qualifications
  expertise JSONB DEFAULT '[]'::jsonb,         -- ["Plants", "Herbs", "Composting"]
  image_url VARCHAR(512),
  social_links JSONB DEFAULT '{}'::jsonb,     -- {"twitter": "...", "linkedin": "..."}
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_team_page ON team_members(page_id);
CREATE INDEX idx_team_author ON team_members(author_id);
```

### 4. `faq_items` - FAQ Accordion

```sql
CREATE TABLE faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES page_content(id) ON DELETE CASCADE,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),                      -- 'General', 'Clinic', 'Affiliate'
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_faq_page ON faq_items(page_id);
CREATE INDEX idx_faq_category ON faq_items(category);
```

### 5. `contact_form_submissions` - Form Submissions Archive

```sql
CREATE TABLE contact_form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general',         -- general, clinic, expert
  priority VARCHAR(50) DEFAULT 'normal',      -- low, normal, high
  status VARCHAR(50) DEFAULT 'received',      -- received, read, responded, archived
  ip_address VARCHAR(45),
  user_agent VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contact_email ON contact_form_submissions(email);
CREATE INDEX idx_contact_status ON contact_form_submissions(status);
CREATE INDEX idx_contact_type ON contact_form_submissions(type);
CREATE INDEX idx_contact_created ON contact_form_submissions(created_at);
```

### 6. `office_hours` - Clinic/Support Hours

```sql
CREATE TABLE office_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL,               -- 0 (Sunday) to 6 (Saturday)
  start_time VARCHAR(5) NOT NULL,             -- '09:00' format
  end_time VARCHAR(5) NOT NULL,               -- '17:00' format
  is_open BOOLEAN DEFAULT true,
  timezone VARCHAR(50) DEFAULT 'UTC',         -- 'Asia/Riyadh', 'UTC', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_office_hours_day ON office_hours(day_of_week);
```

---

## 📝 SAMPLE DATA

### Insert Sample About Page

```sql
INSERT INTO page_content (slug, title, hero_title, hero_subtitle, status)
VALUES (
  'about',
  'About GrowHubTips',
  'ملاذنا الأخضر',
  'منصة عربية متخصصة في البستنة والزراعة المنزلية',
  'published'
);

-- Get the ID for next inserts
SELECT id FROM page_content WHERE slug = 'about' LIMIT 1;
-- Use this ID as {ABOUT_PAGE_ID}
```

### Insert Timeline Events

```sql
INSERT INTO timeline_events (page_id, year, title, description, icon, sort_order) VALUES
  ('{ABOUT_PAGE_ID}', 2021, 'تأسيس المنصة', 'بدأنا رحلتنا كمدونة صغيرة', '🌱', 0),
  ('{ABOUT_PAGE_ID}', 2022, 'وصول 50 الف قارئ', 'تجاوزنا 50,000 قارئ شهري', '📈', 1),
  ('{ABOUT_PAGE_ID}', 2023, 'تطوير تطبيق', 'أطلقنا تطبيق بريد الهاتف الذكي', '📱', 2),
  ('{ABOUT_PAGE_ID}', 2024, 'فريق عالمي', 'توسعنا لخدمة 30 دولة عربية', '🌍', 3);
```

### Insert Team Members

```sql
INSERT INTO team_members (page_id, name, role, bio, expertise, sort_order) VALUES
  (
    '{ABOUT_PAGE_ID}',
    'أحمد النوري',
    'خبير البستنة الرئيسي',
    'متخصص في زراعة النباتات الداخلية مع 15 سنة خبرة',
    '["نباتات داخلية", "تصميم الحدائق", "الاستدامة"]'::jsonb,
    0
  ),
  (
    '{ABOUT_PAGE_ID}',
    'فاطمة العامري',
    'خبيرة الخضروات',
    'متخصصة في البستنة الحضرية والزراعة المنزلية',
    '["خضروات", "أعشاب", "السمادالعضوي"]'::jsonb,
    1
  );
```

### Insert Contact Form FAQs

```sql
INSERT INTO faq_items (page_id, question, answer, category, sort_order) VALUES
  (
    '{CONTACT_PAGE_ID}',
    'How long does it take to get a response?',
    'We respond to all inquiries within 24 business hours of submission',
    'General',
    0
  ),
  (
    '{CONTACT_PAGE_ID}',
    'Do you offer direct consultations?',
    'Yes! Plant clinic appointments are available Monday through Friday',
    'Clinic',
    1
  );
```

### Insert Office Hours

```sql
INSERT INTO office_hours (day_of_week, start_time, end_time, is_open, timezone) VALUES
  (0, '10:00', '16:00', false, 'Asia/Riyadh'),      -- Sunday closed
  (1, '09:00', '17:00', true, 'Asia/Riyadh'),       -- Monday
  (2, '09:00', '17:00', true, 'Asia/Riyadh'),       -- Tuesday
  (3, '09:00', '17:00', true, 'Asia/Riyadh'),       -- Wednesday
  (4, '09:00', '17:00', true, 'Asia/Riyadh'),       -- Thursday
  (5, '09:00', '17:00', true, 'Asia/Riyadh'),       -- Friday
  (6, '10:00', '14:00', true, 'Asia/Riyadh');       -- Saturday
```

---

## 🔄 RELATIONSHIPS

```
page_content
  ├─ timelineEvents (one-to-many)
  ├─ teamMembers (one-to-many)
  │   └─ authorId → authors.id (many-to-one)
  └─ faqItems (one-to-many)

users
  └─ createdBy → pageContent

authors
  ├─ userId → users.id
  └─ id → teamMembers.authorId
```

---

## 📤 ENUMS

```typescript
enum PageContentStatus {
  'draft'     // Not published
  'published' // Live
  'archived'  // Old versions
}

enum ContactFormType {
  'general'   // General inquiry
  'clinic'    // Clinic booking
  'expert'    // Expert consultation
}

enum ContactFormPriority {
  'low'       // Can wait
  'normal'    // Standard handling
  'high'      // Urgent
}

enum ContactFormStatus {
  'received'   // Just came in
  'read'       // Admin has read
  'responded'  // Admin replied
  'archived'   // Closed
}
```

---

## ⚡ SAMPLE QUERIES

### Get All Published Pages

```typescript
const allPages = await db.query.pageContent.findMany({
  where: eq(pageContent.status, 'published'),
});
```

### Get About Page with All Relations

```typescript
const aboutData = await db.query.pageContent.findFirst({
  where: eq(pageContent.slug, 'about'),
  with: {
    timelineEvents: {
      orderBy: asc(timelineEvents.year),
    },
    teamMembers: {
      orderBy: asc(teamMembers.sortOrder),
      with: { author: true },
    },
  },
});
```

### Get Contact Form Submissions (Last 30 Days)

```typescript
const recentSubmissions = await db.query.contactFormSubmissions.findMany({
  where: gte(
    contactFormSubmissions.createdAt,
    sql`NOW() - INTERVAL '30 days'`
  ),
  orderBy: desc(contactFormSubmissions.createdAt),
});
```

### Get Open Office Hours

```typescript
const openHours = await db.query.officeHours.findMany({
  where: eq(officeHours.isOpen, true),
});
```

---

## 🔐 SECURITY NOTES

- ✅ All inputs in `contact_form_submissions` are user-generated
- ✅ Validate all form inputs with Zod before inserting
- ✅ Sanitize HTML in descriptions if allowing rich text
- ✅ Use parameterized queries (Drizzle does this automatically)
- ✅ Implement rate limiting on form submissions

---

## 📊 USEFUL ANALYTICS QUERIES

### Contact Form Volume by Type

```sql
SELECT type, COUNT(*) as count
FROM contact_form_submissions
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY type;
```

### Most Common Question in FAQ

```sql
SELECT question, category, COUNT(*) 
FROM faq_items
WHERE is_published = true
GROUP BY question, category
ORDER BY COUNT(*) DESC;
```

### Team Member Expertise Coverage

```sql
SELECT name, jsonb_array_length(expertise) as expertise_count
FROM team_members
ORDER BY expertise_count DESC;
```

---

## 🆘 RECOVERY & MAINTENANCE

### Backup Page Content

```bash
# Backup to CSV
psql -d growhubtips -c "\COPY page_content TO 'backup.csv' CSV"

# Backup JSON
psql -d growhubtips -c "SELECT * FROM page_content" -F, > pages.csv
```

### Clean Up Archived Content

```sql
DELETE FROM page_content WHERE status = 'archived' AND updated_at < NOW() - INTERVAL '6 months';
```

### Archive Old Form Submissions

```sql
UPDATE contact_form_submissions 
SET status = 'archived' 
WHERE status = 'responded' AND updated_at < NOW() - INTERVAL '3 months';
```

---

**Last Updated**: February 2026  
**Database Version**: PostgreSQL 14+  
**Drizzle ORM Compatible**: Yes
