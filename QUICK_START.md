# ⚡ QUICK START - GrowHubTips Editor

## 🎯 Get Running in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

**What installs:**
- Tiptap core + 8 extensions
- tippy.js (popovers)
- Framer Motion (animations)
- All other dependencies

**Time:** ~2-3 minutes

### Step 2: Start Dev Server
```bash
npm run dev
```

**Output:**
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:8000
  - Environments: .env.local
```

### Step 3: Open Editor
```
📝 Open Browser:
   http://localhost:8000/admin/new-post
```

---

## 🎨 Your First Post (5 Minutes)

### In the Editor:

1. **Title**
   ```
   "Complete Guide to Growing Monstera Deliciosa"
   ```
   → Slug auto-fills: `complete-guide-to-growing-monstera-deliciosa`

2. **Excerpt**
   ```
   "Learn everything about caring for your Monstera plant, from watering to propagation."
   ```

3. **Click in Content Canvas**
   → Type `/` → See command menu popup

4. **Add Heading**
   → Type `/h1` → Select "Heading 1"
   → Type: "Watering Your Monstera"

5. **Add Plant Care Card**
   → Type `/plant` → Select "Plant Care Card"
   → Fill in:
     - Scientific Name: `Rhaphidophora tetrasperma`
     - Sunlight: `Bright indirect light`
     - Water Frequency: `Every 1-2 weeks`
     - Soil Type: `Well-draining potting mix`
     - Pet Safety: `Toxic to cats and dogs`

6. **Add Pro Tip**
   → Type `/protip` → Select "Pro Tip Alert"
   → Type: "Let the top inch of soil dry before watering!"

7. **Add Smart Image**
   → Type `/image` → Select "Smart Image"
   → Drag & drop image OR paste URL
   → Fill Alt Text: "Close-up of Monstera leaf"
   → Fill Caption: "Monstera leaves develop fenestrations as they mature"

8. **SEO Sidebar**
   → Focus Keyword: `monstera care guide`
   → Watch SEO score update live
   → Target: 85+

9. **Save**
   → Click "Save Draft" button
   → Post saved with JSON content
   → Auto-saves every 20 seconds

---

## 🌳 Slash Command Cheat Sheet

```
Type this inside editor:

/para       → Regular paragraph
/h1         → Heading 1
/h2         → Heading 2
/h3         → Heading 3
/bullet     → Bullet list
/ordered    → Numbered list
/quote      → Pull quote
/image      → Smart image (drag & drop)
/embed      → YouTube/Instagram/X embed
/table      → Advanced table
/plant      → Plant care card
/protip     → Pro tip alert
/timeline   → Growth timeline
```

---

## ✨ Editor Features (Live)

### Text Formatting
```
Select text → Toolbar appears with:
- B   Bold
- I   Italic
- U   Underline
- H   Highlight (yellow)
- Link  Add hyperlink
```

### Smart Image
- Drag & drop images onto canvas
- Paste URLs directly
- SEO alt-text input
- Optional caption
- Auto WebP optimization

### Embeds
- Paste YouTube URL → auto-embeds
- Paste Instagram post link → auto-embeds
- Paste X/Twitter URL → auto-embeds

### Auto-Save
```
⏱️  Every 20 seconds:
  ✅ Content saved to database
  ✅ Timestamp shown in SEO sidebar
  ✅ No manual saves needed
```

### SEO Sidebar
```
Live SEO Score (0-100):
□ Focus keyword in title?
□ Focus keyword in H1?
□ Focus keyword in first paragraph?
□ Word count ≥ 300?
□ Word count ≥ 700?
□ Internal links present?
□ External links present?

SERP Preview:
📱 Desktop view (Google search result)
📱 Mobile view (mobile search result)
```

---

## 🧪 Test Workflow

### Full Workflow (10 min):

1. Create new post with all block types
2. Watch auto-save timestamps
3. See SEO score update
4. Check SERP preview
5. Click "Save Draft"
6. Go to `/blog/{slug}` to see rendering
7. The ContentRenderer displays your content beautifully

### Test Each Block:

```markdown
# Heading 1
Testing the Tiptap editor

## Heading 2
More content

### Heading 3
Even more

- Bullet point
- Another point

1. First step
2. Second step

> Block quote text

[Linked text](https://example.com)

[Smart Image - drag or paste](image url)

[YouTube - paste link](https://youtube.com/...)

[Plant Care Card with all fields]

[Pro Tip - Expert advice]

[Growth Timeline - step by step]

| Table | Header |
|-------|--------|
| Cell  | Data   |
```

---

## 📊 Database Verification

### Check Saved Data:

```sql
-- View saved post with JSON
SELECT id, title, slug, contentJson, readingTimeMinutes
FROM posts
ORDER BY created_at DESC
LIMIT 1;

-- View SEO metadata
SELECT postId, focusKeyword, seoTitle, metaDescription
FROM seoMetadata
WHERE postId = (SELECT id FROM posts ORDER BY created_at DESC LIMIT 1);
```

---

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| "/" not showing menu | Restart dev server; hard refresh browser |
| Images not displaying | Check `next.config.ts` images domain config |
| Auto-save not working | Check browser console for errors; verify postId set |
| SEO sidebar blank | Ensure contentJson is valid JSON |
| Editor won't load | Check `npm install` completed successfully |
| Port 8000 in use | `lsof -i :8000` → `kill -9 <PID>` |

---

## 📁 Key Files to Know

```
app/admin/new-post/
├─ page.tsx              ← Page layout
├─ Editor.tsx            ← Main editor component
├─ NewPostForm.tsx       ← Form wrapper
└─ SeoSidebar.tsx        ← SEO analytics

app/blog/[slug]/
└─ page.tsx              ← Public blog post page (renders JSON)

app/components/
└─ ContentRenderer.tsx   ← Converts JSON to HTML

app/admin/
└─ actions.ts            ← autoSavePostAction
```

---

## 🎓 Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Visit `http://localhost:8000/admin/new-post`
4. ✅ Create your first post
5. 📖 Read `EDITOR_ARCHITECTURE.md` for advanced customization
6. 🔧 Read `EDITOR_QUICK_REFERENCE.md` for developer guide

---

## 💡 Pro Tips

- **Auto-save:** Don't click "Save Draft" manually - it saves every 20 seconds
- **SEO Score:** Focus on getting keyword in title, H1, and first paragraph for +45 points
- **Reading Time:** Auto-calculated from word count (200 words/minute)
- **Embeds:** Paste full YouTube/Instagram/X URLs - they auto-detect
- **Images:** Drag entire images or paste URLs - both work
- **Keyboard:** Press `/` anytime to see all 13 block options
- **Formatting:** Select text, use toolbar buttons or keyboard shortcuts

---

**You're all set! 🚀**

```bash
npm install && npm run dev
# → Editor ready at http://localhost:8000/admin/new-post
```

Happy writing! 🌱
