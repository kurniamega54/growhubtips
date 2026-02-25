# 🌱 GrowHubTips Editor - Quick Reference Guide

## ✨ Delivered Features

### 1. **JSON-First Block Editor** ✅
- Full Tiptap editor with 13+ block types
- All content stored as structured JSON in PostgreSQL
- Auto-save every 20 seconds (debounced)
- Keyboard-first Notion-style UX

### 2. **Slash Command System** ✅
**Type `/` to see these blocks:**
- Paragraph, H1, H2, H3
- Bullet List, Numbered List, Quote
- Smart Image (drag-drop, SEO alt-text)
- Embed (YouTube, Instagram, X/Twitter)
- Table (advanced row/column editing)
- Plant Care Card (gardening-specific)
- Pro Tip Alert (expert callout)
- Growth Timeline (step-by-step guides)

### 3. **Editor Features** ✅
- **Formatting Toolbar**: Bold, Italic, Underline, Highlight, Link
- **Smart Image Block**: Drag-drop, caption, SEO alt-text
- **Auto-Embed**: Paste YouTube/Instagram/X URLs → auto-embeds
- **Distraction-Free**: Canvas-only interface, Plus Jakarta Sans font

### 4. **Live SEO Sidebar** ✅
```
- SEO Score: 0-100 meter (weighted algorithm)
- Focus Keyword: In title? H1? First paragraph?
- Word Count & Reading Time
- Internal/External Link Counter
- SERP Preview: Mobile & Desktop Google preview
- Auto-save Status: Timestamps + "Saving..." indicator
```

### 5. **Gardening-Specific Blocks** ✅
```
Plant Care Card:
├─ Scientific Name
├─ Sunlight Level
├─ Water Frequency
├─ Soil Type
└─ Pet Safety Info

Pro Tip Callout:
├─ 🍃 Icon
└─ Expert advice box

Growth Timeline:
├─ Multi-line steps
└─ Auto-numbered rendering
```

###  6. **JSON Renderer** ✅
- `ContentRenderer.tsx` converts JSON → semantic HTML5
- Supports all custom blocks
- `next/image` for WebP optimization
- Used on public blog pages

---

## 📁 Files Created/Modified

### Created:
```
lib/editor/extensions/
├─ SmartImage.tsx           (Drag-drop image block)
├─ EmbedBlock.tsx           (YouTube/Instagram/X)
├─ PlantCareCard.tsx        (Gardening card)
├─ GrowthTimeline.tsx       (Step-by-step)

app/admin/new-post/
├─ Editor.tsx               (Main Tiptap editor + slash commands)
├─ NewPostForm.tsx          (Form wrapper + auto-save)

app/components/
├─ ContentRenderer.tsx      (JSON → HTML renderer)

lib/validations/
└─ post.ts (updated)        (JSON schema added)

app/admin/
└─ actions.ts (updated)     (autoSavePostAction added)
```

### Modified:
```
app/layout.tsx              (Plus Jakarta Sans font)
app/globals.css             (Font setup + Tiptap styles)
app/blog/[slug]/page.tsx    (JSON rendering + fallback HTML)
package.json                (Tiptap dependencies)
```

---

## 🚀 Installation & Startup

### 1. Install Dependencies
```bash
npm install
# Or manually:
npm install @tiptap/core @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-link @tiptap/extension-highlight \
  @tiptap/extension-underline @tiptap/extension-placeholder \
  @tiptap/extension-table @tiptap/suggestion tippy.js
```

### 2. Run Development Server
```bash
npm run dev
# Opens on http://localhost:8000
```

### 3. Test the Editor
**Go to:** `http://localhost:8000/admin/new-post`
- Type title + slug
- Click in "Content" canvas
- Type `/` → see 13+ blocks
- Select "Smart Image" → drag-drop or paste URL
- Type `/yout` → see YouTube embed block
- Auto-saves every 20 seconds to drafts

---

## 🎯 SEO Sidebar Scoring Algorithm

```
Base Score: 40 points

+20: Focus keyword in post title
+15: Focus keyword in H1 heading
+10: Focus keyword in first paragraph
+10: Word count ≥ 300 words
+5:  Word count ≥ 700 words
+5:  Has internal links (/)
+5:  Has external links (http/https)

Maximum: 100 points
```

---

## 💾 Database Flow

### Create Post:
```
Form Submit
  ↓
contentJson (Tiptap state) → Parse + extract text
  ↓
Save to `posts` table:
  - content (plain text, for HTML fallback)
  - contentJson (structured JSON, for rendering)
  - readingTimeMinutes (auto-calculated)
  - status (draft/published)
  ↓
Save to `seoMetadata` table:
  - focusKeyword, seoTitle, metaDescription
  - All Rank-Math style fields
```

### Render Blog Post:
```
GET /blog/[slug]
  ↓
Query posts + seoMetadata
  ↓
Has contentJson?
  ├─ YES → <ContentRenderer content={json} />
  └─ NO  → <div dangerouslySetInnerHTML={htmlContent} />
  ↓
Render semantic HTML5 with WebP images
```

---

## 📊 Auto-Save Flow

```
User types in editor (Client)
  ↓
State updates in React
  ↓
20-second debounce interval fires
  ↓
autoSavePostAction(postId, contentJson, ...)
  (Server Action)
  ↓
DB Operations:
  - If postId: UPDATE posts + seoMetadata
  - Else: INSERT new draft post + seoMetadata
  ↓
Return { postId, lastSavedAt }
  ↓
Display timestamp in SEO sidebar
  ✅ Draft saved!
```

---

## 🛠️ Customizing the Editor

### Add a New Block Type:

```typescript
// lib/editor/extensions/MyBlock.tsx
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

function MyComponent({ node, updateAttributes }) {
  return (
    <NodeViewWrapper>
      <input
        value={node.attrs.title}
        onChange={(e) => updateAttributes({ title: e.target.value })}
      />
    </NodeViewWrapper>
  );
}

export const MyBlock = Node.create({
  name: "myBlock",
  group: "block",
  atom: true,
  addAttributes() {
    return { title: { default: "" } };
  },
  parseHTML() { return [{ tag: "div[data-type=my-block]" }]; },
  renderHTML(({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-type": "my-block" }, HTMLAttributes)];
  },
  addNodeView() { return ReactNodeViewRenderer(MyComponent); },
});
```

Then add to Editor.tsx extensions array:

```typescript
extensions: [
  // ... existing
  MyBlock,
  createSlashCommand(slashItems), // Must be last
]
```

And add to slash items:

```typescript
{
  title: "My Block",
  description: "Custom description",
  search: "my block custom",
  command: ({ editor, range }) =>
    editor?.chain().focus().deleteRange(range).insertContent({ type: "myBlock" }).run(),
}
```

---

## 🎨 Styling & Theming

### Colors Used:
```
--color-primary-500: #2D5A27        (Forest green)
--color-secondary-500: #7a8a67      (Sage)
--color-accent-500: #D96C32         (Terracotta)
--color-neutral-500: #4E342E        (Earthy brown)
```

### Fonts:
```
Heading: Playfair Display (serif)
Body: Plus Jakarta Sans (sans-serif, high readability)
```

### Border Radius (Organic):
```css
border-radius: 1.1rem 1.7rem 1.3rem 1.5rem / 1.5rem 1.2rem 1.7rem 1.1rem;
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "/" not showing menu | Check `createSlashCommand` is last in extensions array; restart dev server |
| Images not loading | Verify `next/image` domain config in `next.config.ts` |
| Auto-save not working | Check browser console; verify `autoSavePostAction` is exported as `"use server"` |
| Editor styles missing | Run `npm run build` to test production build; check `app/globals.css` imports |
| SEO sidebar frozen | Check `contentJson` is valid JSON; verify form state updates |

---

## 📚 Complete File Manifest

### Core Editor Files:
- [app/admin/new-post/Editor.tsx](app/admin/new-post/Editor.tsx) - Tiptap editor + slash commands
- [app/admin/new-post/NewPostForm.tsx](app/admin/new-post/NewPostForm.tsx) - Form wrapper + auto-save
- [app/admin/actions.ts](app/admin/actions.ts) - autoSavePostAction

### Custom Blocks:
- [lib/editor/extensions/SmartImage.tsx](lib/editor/extensions/SmartImage.tsx)
- [lib/editor/extensions/EmbedBlock.tsx](lib/editor/extensions/EmbedBlock.tsx)
- [lib/editor/extensions/PlantCareCard.tsx](lib/editor/extensions/PlantCareCard.tsx)
- [lib/editor/extensions/GrowthTimeline.tsx](lib/editor/extensions/GrowthTimeline.tsx)
- [lib/editor/extensions/ProTipCallout.tsx](lib/editor/extensions/ProTipCallout.tsx)

### Public Rendering:
- [app/components/ContentRenderer.tsx](app/components/ContentRenderer.tsx) - JSON renderer
- [app/blog/[slug]/page.tsx](app/blog/[slug]/page.tsx) - Blog post page

### SEO:
- [app/admin/new-post/SeoSidebar.tsx](app/admin/new-post/SeoSidebar.tsx) - Live SEO analytics

---

## 🎓 Learning Resources

- **Tiptap Docs**: https://tiptap.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **Next.js 14**: https://nextjs.org/docs

---

**Ready to use! 🚀 Next: `npm install && npm run dev`**
