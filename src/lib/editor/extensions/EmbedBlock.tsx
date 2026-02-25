import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { EmbedComponent } from "@/src/app/admin/new-post/EmbedComponent";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    embedBlock: {
      setEmbed: (url: string) => ReturnType;
    };
  }
}

const URL_REGEX =
  /https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be|instagram\.com|twitter\.com|x\.com|(?:[a-z0-9-]+\.))+[a-z0-9-]+(?:\/[^\s]*)?/gi;

export const EmbedBlock = Node.create({
  name: "embedBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      url: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-embed]",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          return {
            url: element.getAttribute("data-url") || "",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-embed": "" }, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedComponent);
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("embedBlock"),
        props: {
          handleTextInput: (view, from, to, text) => {
            if (text !== "\n" && text !== " ") return false;

            const $from = view.state.doc.resolve(from - 1);
            const line = $from.parent;

            if (line.type.name !== "paragraph") return false;

            const lineText = line.textContent.trim();
            const urlMatch = lineText.match(URL_REGEX);

            if (!urlMatch) return false;

            const urlMatch2 = line.textContent.match(URL_REGEX);
            if (!urlMatch2) return false;

            const url = urlMatch2[0];

            // Replace the entire paragraph with an embed block
            const tr = view.state.tr;
            const start = $from.before($from.depth);
            tr.replaceRangeWith(
              start,
              to,
              view.state.schema.nodes.embedBlock.create({ url })
            );
            view.dispatch(tr);

            return true;
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      setEmbed:
        (url: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { url },
          });
        },
    };
  },
});
