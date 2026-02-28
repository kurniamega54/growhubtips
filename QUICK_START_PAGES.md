# 🚀 QUICK START GUIDE - Static Pages Implementation

## ⚡ 5-Minute Setup

### Step 1: Run Database Migrations
```bash
npm run db:push
# or
drizzle-kit push
```

### Step 2: Seed Sample Data (Optional)
```bash
# This creates About, Contact, Privacy, Affiliate pages with sample content
npm run db:seed
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: View the Pages
- About page: http://localhost:3000/about
- Contact page: http://localhost:3000/contact
- Privacy page: http://localhost:3000/privacy
- Affiliate page: http://localhost:3000/affiliate

---

## 📝 ADD YOUR OWN CONTENT

### Update About Page Content

```typescript
// In your database or admin panel:
UPDATE page_content 
SET hero_title = 'Your Mission Title',
    hero_subtitle = 'Your mission statement...',
    status = 'published'
WHERE slug = 'about';

// Add timeline events
INSERT INTO timeline_events (page_id, year, title, description)
VALUES ('{ABOUT_PAGE_ID}', 2021, 'Founded', 'Our journey began...');

// Add team members
INSERT INTO team_members (page_id, name, role, bio, expertise)
VALUES ('{ABOUT_PAGE_ID}', 'John Doe', 'Lead Expert', 'Bio...', '["Plants", "Herbs"]');
```

### Update Contact Form Settings

```typescript
// Set office hours
INSERT INTO office_hours (day_of_week, start_time, end_time, is_open)
VALUES 
  (1, '09:00', '17:00', true), -- Monday
  (2, '09:00', '17:00', true), -- Tuesday
  (3, '09:00', '17:00', true), -- Wednesday
  (4, '09:00', '17:00', true), -- Thursday
  (5, '09:00', '17:00', true); -- Friday

// Add FAQ items
INSERT INTO faq_items (page_id, question, answer, category, sort_order)
VALUES ('{CONTACT_PAGE_ID}', 'Question?', 'Answer...', 'General', 1);
```

---

## 🎨 CUSTOMIZE COLORS

All colors in `/lib/utils/page-utils.ts` use your Tailwind theme:

```javascript
// tailwind.config.ts
extend: {
  colors: {
    forest: '#2D5A27',      // Primary heading color
    sage: '#8E9775',        // Secondary color
    primary: colors.green,  // CTA buttons
    secondary: colors.amber // Accents
  }
}
```

Change Tailwind colors → all pages update automatically.

---

## 🔗 IMPORTANT FILES TO KNOW

### Data Layer
- `lib/types/pages.ts` - TypeScript interfaces
- `lib/queries.pages.ts` - Database fetching
- `lib/validations/pages.ts` - Form validation
- `app/admin/server-actions/pages.ts` - Form processing

### Pages
- `app/(site)/about/page.tsx` - About page server component
- `app/(site)/about/_components/AboutPageContent.tsx` - About client component
- `app/(site)/contact/page.tsx` - Contact page  
- `app/(site)/privacy/page.tsx` - Privacy page
- `app/(site)/affiliate/page.tsx` - Affiliate page

### Utilities
- `lib/utils/page-utils.ts` - Animations, schemas, helpers

---

## 🔌 CONNECT FORMS TO EMAIL

In `server-actions/pages.ts`, uncomment and implement:

```typescript
// Uncomment these:
// await sendContactConfirmationEmail(data.email, data.name);
// await notifyAdminOfNewContact(data);

// Then add your email service (SendGrid, Resend, etc.):
import { sendEmail } from '@/lib/email'; // your email service

async function sendContactConfirmationEmail(to: string, name: string) {
  await sendEmail({
    to,
    subject: 'Thank you for contacting us!',
    html: `Hello ${name}!...`
  });
}
```

---

## ✅ TESTING CONTACT FORM

1. Go to http://localhost:3000/contact
2. Fill in the form
3. Click through the 3 steps
4. Submit
5. Check browser DevTools → Network (should see form data)
6. Check logs for confirmation

Form submissions saved to `contact_form_submissions` table.

---

## 📱 RESPONSIVE TESTING

```bash
# Use Chrome DevTools
F12 → Toggle Device Toolbar (Ctrl+Shift+M)

# Test breakpoints:
# Mobile:    375px, 425px
# Tablet:    768px (md:)
# Desktop:   1024px (lg:)
```

---

## 🔍 SEO DEBUGGING

```bash
# Check metadata with Next.js metadata debugger
npm run inspect:metadata

# Validate JSON-LD at:
# https://validator.schema.org

# Check OpenGraph:
# https://www.opengraph.xyz
```

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module './_components/...'"
**Fix**: Make sure component files are created:
```bash
mkdir -p app/(site)/about/_components
touch app/(site)/about/_components/AboutPageContent.tsx
```

### Issue: "Database connection error"
**Fix**: Check `DATABASE_URL` in `.env.local`:
```env
DATABASE_URL=postgresql://user:pass@host/db
```

### Issue: "Form not submitting"
**Fix**: Check browser console for validation errors. Ensure database has `contact_form_submissions` table.

### Issue: "Animations not showing"
**Fix**: Verify Framer Motion is installed and viewport settings are correct:
```typescript
viewport={{ once: true }}
```

---

## 📊 MONITOR PERFORMANCE

```bash
# Run Lighthouse audit  
npm run lighthouse

# Check Core Web Vitals
# https://web.dev/vitals

# Monitor database queries
npm run db:analyze
```

---

## 🎯 NEXT FEATURES TO ADD

1. **Email Notifications** - Send confirmations
2. **CMS Admin Panel** - Edit pages without code
3. **Analytics Dashboard** - Track form submissions
4. **A/B Testing** - Test different versions
5. **Multilingual** - Support Arabic/English toggle
6. **Dark Mode** - Add theme switcher

---

## 📚 HELPFUL RESOURCES

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Zod Validation](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 💬 FEEL FREE TO...

- Modify animations for your brand
- Change colors and typography
- Add more form fields
- Create new page types
- Extend with admin features
- Integrate with third-party services

This is your foundation. Build on it! 🌱

---

**Questions?** Check `ENTERPRISE_PAGES_IMPLEMENTATION.md` for detailed docs.
