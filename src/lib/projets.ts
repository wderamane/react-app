export type EntreeType = 'projet' | 'profil' | 'langages';

export interface Projet {
  id: number;
  type: EntreeType;
  nom: string;
  description: string;
  screenshot?: string;
  github?: string;
  demo?: string;
  couleur: string;
  symbolePath: string;
}

export const projets: Projet[] = [
  {
    id: 1,
    type: 'projet',
    nom: "Projet Alpha",
    description: "Une app de gestion de tâches temps réel.",
    screenshot: "/screenshots/alpha.png",
    github: "https://github.com/toi/alpha",
    demo: "https://alpha.vercel.app",
    couleur: "#f97316",
    symbolePath: "M35 10 L55 30 L55 50 L35 60 L15 50 L15 30 Z",
  },
  {
    id: 2,
    type: 'projet',
    nom: "Bot Discord Beta",
    description: "C'est un bot pour gérer les rôles et les messages en plus de pouvoir lancer des musiques et de pouvoir discuter sur Discord.",
    screenshot: "/screenshots/beta.png",
    github: "https://github.com/toi/beta",
    demo: "https://beta.vercel.app",
    couleur: "#06b6d4",
    symbolePath: "M35 8 L58 22 L58 48 L35 62 L12 48 L12 22 Z",
  },
  {
    id: 3,
    type: 'projet',
    nom: "Projet Gamma",
    description: "API REST Node.js avec auth JWT.",
    screenshot: "/screenshots/gamma.png",
    github: "https://github.com/toi/gamma",
    couleur: "#22c55e",
    symbolePath: "M35 15 L55 25 L55 45 L35 55 L15 45 L15 25 Z",
  },
  {
    id: 98,
    type: 'profil',
    nom: "Profil",
    description: "",
    couleur: "#c084fc",
    symbolePath: "M35 14 C42 14 48 20 48 27 C48 34 42 40 35 40 C28 40 22 34 22 27 C22 20 28 14 35 14 Z M18 56 C18 46 26 40 35 40 C44 40 52 46 52 56",
  },
  {
    id: 99,
    type: 'langages',
    nom: "Stack",
    description: "",
    couleur: "#f59e0b",
    symbolePath: "M20 20 L50 20 L50 26 L20 26 Z M20 32 L45 32 L45 38 L20 38 Z M20 44 L38 44 L38 50 L20 50 Z",
  },
];