#!/bin/bash
# GrowHubTips Editor Setup Script

echo "🌱 Installing Tiptap and dependencies..."
npm install @tiptap/core @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-underline @tiptap/extension-highlight @tiptap/extension-table @tiptap/suggestion tippy.js --save

echo "✅ Dependencies installed!"
echo ""
echo "🚀 Next steps:"
echo "1. Start development server: npm run dev"
echo "2. Navigate to http://localhost:8000/admin/new-post"
echo "3. Test the editor:"
echo "   - Type '/' to see slash commands"
echo "   - Select any block (Paragraph, Heading, Smart Image, etc)"
echo "   - Content auto-saves every 20 seconds"
echo ""
echo "📖 Documentation:"
echo "   - See EDITOR_ARCHITECTURE.md for full architecture details"
echo "   - Check app/admin/new-post/Editor.tsx for slash command config"
echo ""
