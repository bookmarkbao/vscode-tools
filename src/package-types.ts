export type PkgType from '../package.json'
export interface Activitybar {
    id: string;
    title: string;
    icon: string;
}

export interface CommandPalette {
    command: string;
    when: string;
}

export interface Commands {
    command: string;
    title: string;
    icon?: Icon;
}

export interface Configuration {
    type: string;
    title: string;
    properties: any;
}





export interface Icon {
    light: string;
    dark: string;
}

export interface Keybindings {
    command: string;
    key: string;
    when?: string;
}

export interface Menus {
    commandPalette?: CommandPalette[];
    "explorer/context"?: ExplorerContext[];
    "view/item/context"?: ViewItemContext[];
    "view/title"?: ExplorerContext[];
    "editor/title/run"?: ExplorerContext[];
    "editor/title"?: ExplorerContext[];
    [propName: string]: any
}

export interface Contributes {
    commands?: Commands[];
    menus?: Menus;
    viewsContainers?: ViewsContainers;
    views?: Views;
    keybindings?: Keybindings[];
    configuration?: Configuration;
}