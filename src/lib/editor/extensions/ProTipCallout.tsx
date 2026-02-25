import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ProTipCalloutComponent } from "@/src/app/admin/new-post/ProTipCalloutComponent";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    proTipCallout: {
      setProTipCallout: (content?: string) => ReturnType;
    };
  }
}

export const ProTipCallout = Node.create({
  name: "proTipCallout",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      content: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-pro-tip]",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          return {
            content: element.getAttribute("data-content") || "",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-pro-tip": "", "data-content": HTMLAttributes.content },
        HTMLAttributes
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ProTipCalloutComponent);
  },

  addCommands() {
    return {
      setProTipCallout:
        (content?: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { content: content || "" },
          }),
    };
  },
});
