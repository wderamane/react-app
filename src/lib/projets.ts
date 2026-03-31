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
    id: 4,
    type: 'projet',
    nom: "CLI Dev Tools",
    description: "Un outil en ligne de commande Node.js pour automatiser la création de projets : génère la structure de dossiers, initialise Git et installe les dépendances en une seule commande.",
    screenshot: "/screenshots/cli.png",
    github: "https://github.com/toi/cli-dev-tools",
    couleur: "#84cc16",
    symbolePath: "M15 20 L30 35 L15 50 M35 50 L55 50",
  },
  {
    id: 5,
    type: 'projet',
    nom: "Portfolio v1",
    description: "Premier portfolio personnel en HTML/CSS/JS vanilla. Animations CSS custom, mode sombre, formulaire de contact fonctionnel.",
    screenshot: "/screenshots/portfolio-v1.png",
    github: "https://github.com/toi/portfolio-v1",
    demo: "https://portfolio-v1.vercel.app",
    couleur: "#e879f9",
    symbolePath: "M35 10 C50 10 60 20 60 35 C60 50 50 60 35 60 C20 60 10 50 10 35 C10 20 20 10 35 10 Z M35 22 L35 48 M22 35 L48 35",
  },
  {
    id: 6,
    type: 'projet',
    nom: "Weather App",
    description: "Application météo React qui consomme l'API OpenWeatherMap. Affiche les prévisions sur 7 jours avec des icônes animées selon les conditions.",
    screenshot: "/screenshots/weather.png",
    github: "https://github.com/toi/weather-app",
    demo: "https://weather-app.vercel.app",
    couleur: "#38bdf8",
    symbolePath: "M20 35 C20 25 28 18 38 20 C40 14 48 10 54 15 C62 15 66 25 62 32 L20 35 Z M28 35 L28 48 M35 35 L35 50 M42 35 L42 46",
  },
  {
    id: 7,
    type: 'projet',
    nom: "Chat Temps Réel",
    description: "Application de chat avec Socket.io et Express. Salons multiples, messages privés, indicateur de frappe en temps réel.",
    screenshot: "/screenshots/chat.png",
    github: "https://github.com/toi/chat-realtime",
    couleur: "#fb7185",
    symbolePath: "M15 15 L55 15 L55 45 L35 45 L25 55 L25 45 L15 45 Z",
  },
  {
    id: 8,
    type: 'projet',
    nom: "Scraper Python",
    description: "Script Python avec BeautifulSoup et Selenium pour extraire des données de sites web et les exporter en CSV ou JSON automatiquement.",
    screenshot: "/screenshots/scraper.png",
    github: "https://github.com/toi/scraper-python",
    couleur: "#fbbf24",
    symbolePath: "M20 25 C20 18 26 13 35 13 C44 13 50 18 50 25 C55 27 58 33 55 38 L15 38 C12 33 15 27 20 25 Z M28 38 L28 55 L42 55 L42 38",
  },
  {
    id: 9,
    type: 'projet',
    nom: "Auth JWT",
    description: "Système d'authentification complet avec Node.js : inscription, connexion, refresh token, middleware de protection des routes et gestion des sessions.",
    screenshot: "/screenshots/auth.png",
    github: "https://github.com/toi/auth-jwt",
    couleur: "#a78bfa",
    symbolePath: "M35 10 L50 18 L50 35 C50 45 43 53 35 56 C27 53 20 45 20 35 L20 18 Z M30 35 L33 38 L40 30",
  },
  {
    id: 10,
    type: 'projet',
    nom: "Dashboard Admin",
    description: "Interface d'administration React avec graphiques Recharts, tableau de données filtrable, gestion des utilisateurs et export PDF.",
    screenshot: "/screenshots/dashboard.png",
    github: "https://github.com/toi/dashboard-admin",
    demo: "https://dashboard-admin.vercel.app",
    couleur: "#34d399",
    symbolePath: "M12 48 L12 35 L22 35 L22 48 Z M26 48 L26 25 L36 25 L36 48 Z M40 48 L40 30 L50 30 L50 48 Z M54 48 L54 18 L58 18 L58 48 Z",
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