import {
  Heading1,
  Heading2,
  Heading3,
  Type,
  List,
  ListOrdered,
  Image,
  Play,
  Table,
  Leaf,
  Lightbulb,
  MapPin,
  Quote,
  LucideIcon,
} from "lucide-react";

export interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  searchText: string;
  command: (props: any) => boolean;
}

export const COMMAND_ITEMS: CommandItem[] = [
  {
    id: "heading1",
    label: "Heading 1",
    description: "Large section heading",
    icon: Heading1,
    searchText: "heading 1 h1 title",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 1 })
        .run();
      return true;
    },
  },
  {
    id: "heading2",
    label: "Heading 2",
    description: "Medium section heading",
    icon: Heading2,
    searchText: "heading 2 h2 subtitle",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 2 })
        .run();
      return true;
    },
  },
  {
    id: "heading3",
    label: "Heading 3",
    description: "Small section heading",
    icon: Heading3,
    searchText: "heading 3 h3",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 3 })
        .run();
      return true;
    },
  },
  {
    id: "paragraph",
    label: "Paragraph",
    description: "Regular text block",
    icon: Type,
    searchText: "paragraph text body",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
      return true;
    },
  },
  {
    id: "bulletList",
    label: "Bullet List",
    description: "Unordered list",
    icon: List,
    searchText: "bullet list unordered dots",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .run();
      return true;
    },
  },
  {
    id: "numberedList",
    label: "Numbered List",
    description: "Ordered list",
    icon: ListOrdered,
    searchText: "numbered list ordered order",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleOrderedList()
        .run();
      return true;
    },
  },
  {
    id: "image",
    label: "Image",
    description: "Add image with SEO metadata",
    icon: Image,
    searchText: "image photo picture smart",
    command: ({ editor, range }) => {
      // Image insertion handled by file upload
      editor.chain().focus().deleteRange(range).run();
      return true;
    },
  },
  {
    id: "youtube",
    label: "YouTube",
    description: "Embed video from YouTube",
    icon: Play,
    searchText: "youtube video embed play",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // URL entry prompt handled by EmbedBlock
      return true;
    },
  },
  {
    id: "table",
    label: "Table",
    description: "Create data table",
    icon: Table,
    searchText: "table grid spreadsheet rows columns",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
      return true;
    },
  },
  {
    id: "plantCareCard",
    label: "Plant Care Card",
    description: "Care guide with light, water, soil, pet safety",
    icon: Leaf,
    searchText: "plant care card botanical guide watering light",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setPlantCareCard().run();
      return true;
    },
  },
  {
    id: "proTipCallout",
    label: "Pro Tip",
    description: "Expert gardening advice callout",
    icon: Lightbulb,
    searchText: "pro tip expert advice callout insight",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setProTipCallout().run();
      return true;
    },
  },
  {
    id: "growthTimeline",
    label: "Growth Timeline",
    description: "Step-by-step growth guide with dashed vine",
    icon: MapPin,
    searchText: "growth timeline steps stage milestone cycle",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setGrowthTimeline().run();
      return true;
    },
  },
  {
    id: "quote",
    label: "Quote",
    description: "Blockquote for emphasis",
    icon: Quote,
    searchText: "quote blockquote citation",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBlockquote()
        .run();
      return true;
    },
  },
];
