type URL = string;
type Asset = string;
type Icon = string;
export type ImageLike = URL | Asset | Icon;
export interface Item {
    id?: string;
    type?: 'command' | (string & {});
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
    data?: any;
}
export {};
