// data.ts

export type Link = {
  id: number;
  title: string;
  href: string;
};

export type FooterLink = {
  id: number;
  title: string;
};

export const links: Link[] = [
  { id: 0, title: "Home", href: "/" },
  { id: 1, title: "About", href: "/About" },
  { id: 2, title: "Carpets", href: "/Buy-art" },

];

export const footerLinks: FooterLink[] = [
  { id: 0, title: "email@exmaple.com" },
];
