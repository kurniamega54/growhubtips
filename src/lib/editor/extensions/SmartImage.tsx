import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, type ReactNodeViewProps } from "@tiptap/react";
import { MediaCard } from "@/src/app/admin/new-post/MediaCard";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    smartImage: {
      setSmartImage: (options: SmartImageAttrs) => ReturnType;
    };
  }
}

declare global {
  namespace ProseMirror {
    interface Plugins {}
  }
}

interface SmartImageAttrs {
  src: string;
  alt?: string;
  title?: string;
  caption?: string;
}

function SmartImageComponent(props: ReactNodeViewProps) {
  const { node, updateAttributes, deleteNode } = props;
  const attrs = node.attrs as SmartImageAttrs;
  const { src, alt = "", title, caption } = attrs;

  return (
    <div className="my-6 rounded-2xl overflow-hidden">
      <MediaCard
        src={src}
        alt={alt}
        title={title}
        caption={caption}
        onUpdate={(data) => updateAttributes(data)}
        onDelete={deleteNode}
      />
    </div>
  );
}

export const SmartImage = Node.create<SmartImageAttrs>({
  name: "smartImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("src") || "",
        renderHTML: (attributes) => ["img", { src: attributes.src }],
      },
      alt: {
        default: "",
        parseHTML: (element) => element.getAttribute("alt") || "",
        renderHTML: (attributes) => ["img", { alt: attributes.alt }],
      },
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("title") || "",
        renderHTML: (attributes) => (attributes.title ? ["img", { title: attributes.title }] : []),
      },
      caption: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-smart-image]",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const img = element.querySelector("img");
          return {
            src: img?.getAttribute("src"),
            alt: img?.getAttribute("alt"),
            title: img?.getAttribute("title"),
            caption: element.getAttribute("data-caption"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-smart-image": "" }, HTMLAttributes),
      ["img", { src: HTMLAttributes.src, alt: HTMLAttributes.alt, title: HTMLAttributes.title }],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SmartImageComponent);
  },

  addCommands() {
    return {
      setSmartImage:
        (options: SmartImageAttrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
