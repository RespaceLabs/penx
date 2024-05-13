declare enum EventType {
    RenderList = "RenderList",
    RenderMarkdown = "RenderMarkdown"
}

type URL = string;
type Asset = string;
type Icon = string;
type ImageLike = URL | Asset | Icon;
type OpenInBrowser = {
    type: 'OpenInBrowser';
    title?: string;
    url: string;
};
type CopyToClipboard = {
    type: 'CopyToClipboard';
    title?: string;
    content: string;
};
type ListItemAction = OpenInBrowser | CopyToClipboard;
interface ListItem {
    id?: string;
    type?: 'command' | 'list-item' | (string & {});
    title: string | {
        value: string;
        tooltip?: string | null;
    };
    subtitle?: string | {
        value?: string | null;
        tooltip?: string | null;
    };
    icon?: ImageLike | {
        value: ImageLike | undefined | null;
        tooltip: string;
    };
    actions?: ListItemAction[];
    data?: any;
}

declare const clipboard: {
    writeText(text: string): Promise<void>;
};

declare function renderList(items: ListItem[]): void;

declare function renderMarkdown(text: string): void;

declare const input = "TODO";

export { type CopyToClipboard, EventType, type ImageLike, type ListItem, type ListItemAction, type OpenInBrowser, clipboard, input, renderList, renderMarkdown };
