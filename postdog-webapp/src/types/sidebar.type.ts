export interface SubNavItem {
  name: string;
  path: string;
  icon?: React.ReactElement;
  roles?: string[];
}

export type NavItem = {
  name: string;
  icon: React.ReactElement;
  path: string;
  subItems?: never;
  roles?: string[];
} | {
  name: string;
  icon: React.ReactElement;
  subItems: SubNavItem[];
  path?: never;
  roles?: string[];
};