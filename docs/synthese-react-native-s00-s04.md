---
**Étudiant :** Med Salah Tlili
**Séance :** 16-10-2026
**Établissement :** ISET Sidi Bouzid (ISET SBZ)
**Matière :** Développement multiplateforme avec React Native (Expo SDK 57)
---

# Synthèse des séances 00 à 04

Source : codelabs du cours IAM2 (Prof. Wael Bouaziz) — `waelbouazizii.github.io/rn-codelabs`

## Tous les liens

| Séance | Titre | Lien |
| ------ | ----- | ---- |
| Sommaire | Développement multiplateforme avec React Native (Expo) | https://waelbouazizii.github.io/rn-codelabs/index.html |
| S00 | Préparation de l'environnement | https://waelbouazizii.github.io/rn-codelabs/session-00.html |
| S01 | TypeScript, React et Expo Router | https://waelbouazizii.github.io/rn-codelabs/session-01.html#step-7 |
| S02 | Persistance locale avec SQLite | https://waelbouazizii.github.io/rn-codelabs/session-02.html#step-7 |
| S03 | Consommer une API REST avec TanStack Query | https://waelbouazizii.github.io/rn-codelabs/session-03.html#step-17 |
| S04 | Firebase : authentification et Firestore temps réel | https://waelbouazizii.github.io/rn-codelabs/session-04.html |

Les ancres (`#step-7`, `#step-17`) renvoient à l'étape indiquée : début de l'atelier pour S01 et S02, livrable (commit et tag `s3-submit`) pour S03.

## Vue d'ensemble

| Séance | Thème | Mini-application | Notion clé |
| ------ | ----- | ---------------- | ---------- |
| S00 | Préparation de l'environnement | `w0-hello` | Expo Go + Metro, Fast Refresh |
| S01 | TypeScript, React, Expo Router | `s1-profile-contacts` | Composants, hooks, routage par fichiers |
| S02 | Persistance locale SQLite | `s2-expenses` | Migrations, dépôt + hook, formulaires |
| S03 | API REST avec TanStack Query | `s3-mini-shop` | État serveur, cache, session sécurisée |
| S04 | Firebase : auth et Firestore temps réel | `s4-taskboard` | `onSnapshot`, règles de sécurité |

Fil conducteur : chaque séance part d'une application neuve (`create-expo-app --template default@sdk-57`) dans un dossier du même dépôt GitHub, remise par un **tag Git** (`s1-submit` à `s4-submit`). L'architecture reste la même : **Écran → Hook → Dépôt/Service → Source de données**. Seule la source change (mémoire, SQLite, API REST, Firestore).

---

## Séance 00 — Préparation de l'environnement

**Objectif :** avoir un PC et un téléphone prêts, avec une application affichée dans Expo Go.

**Ce qui a été mis en place :**
- Node.js 24 (ou 22) LTS, Git, VS Code (extensions Expo Tools, ESLint, Prettier), Expo Go sur le téléphone.
- Compte Expo, connecté avec le **même compte** sur le PC (`npx expo whoami`) et dans Expo Go.
- Dépôt GitHub privé `iam2-rn-prenom-nom`, collaborateur `waelbouazizii`, chemin de travail court sans espace ni accent (ex. `C:\dev`).
- Application `w0-hello`, modifiée pour afficher le nom de l'étudiant, avec observation de **Fast Refresh**.
- Projet Firebase créé à l'avance (Authentication e-mail/mot de passe, Firestore en mode production) pour la séance 04.

**À retenir :**
- Avec Expo Go, le PC ne compile aucun code natif : Metro assemble le JavaScript et Expo Go (déjà compilé) l'exécute.
- Si le QR code échoue : `npx expo start --tunnel`.
- Firestore en mode production refuse tout par défaut : c'est le bon point de départ.

---

## Séance 01 — TypeScript, React et Expo Router

**Application :** Profile & Contacts (deux onglets, liste de 8 contacts, fiche détail, favoris, défi de recherche).

**Concepts :**
- **TypeScript** : typage structurel, unions (`'student' | 'teacher' | 'staff'`), `?.` et `??`, génériques, mode strict. Les types n'existent pas à l'exécution : seule `npx tsc --noEmit` les vérifie (et elle doit passer avant chaque commit).
- **React** : un composant est une fonction de ses props et de son état ; `setState` demande un nouveau rendu (il ne modifie pas la variable du rendu en cours) ; les données descendent, les événements remontent (state hoisting).
- **`useEffect`** : synchronisation avec l'extérieur, tableau de dépendances, fonction de nettoyage. **Règles des hooks** : toujours au premier niveau, jamais après un `return` anticipé.
- **Expo Router** : un fichier = une route. `_layout.tsx` (pile ou onglets), groupe `(tabs)` absent de l'URL, route dynamique `contact/[id].tsx` lue avec `useLocalSearchParams`.
- **Expo Go vs development build** : une bibliothèque avec code natif propre ne fonctionne pas dans Expo Go.

**Réalisations techniques :** `FlatList` avec `keyExtractor`, composant `ContactRow` avec `type Props`, favoris dans un `useState<string[]>` (nouveau tableau à chaque modification, jamais `push`), `extraData` pour redessiner la liste.

**Pièges :** texte hors d'un composant `Text` ; `src/app/index.tsx` à supprimer quand on passe aux onglets ; dossier `example` à supprimer après `reset-project`.

---

## Séance 02 — Persistance locale avec SQLite

**Application :** Offline Expense Tracker (ajout, modification, suppression, filtre par catégorie, total, fonctionne sans réseau).

**Concepts :**
- **Où garder une donnée** : `useState` (mémoire, perdu à la fermeture), clé-valeur (réglages), SQLite (listes métier que l'on filtre et totalise).
- **async/await** : toutes les méthodes `...Async` d'`expo-sqlite` renvoient une `Promise`. `execAsync` (schéma), `runAsync` (écriture), `getAllAsync` / `getFirstAsync` (lecture), `withTransactionAsync` (écritures indivisibles : COMMIT ou ROLLBACK).
- **Requêtes paramétrées** : un `?` par valeur, jamais de gabarit de chaîne avec une saisie utilisateur.
- **Migrations versionnées** avec `PRAGMA user_version` : marches `if (version === 0)`, `if (version === 1)`, jamais modifier une marche publiée (`CREATE TABLE IF NOT EXISTS` ne met pas le schéma à jour).
- **Patron dépôt + hook** : `expenseRepo(db)` contient tout le SQL (équivalent d'un DAO Room) ; `useExpenses` joue le rôle du ViewModel ; aucun écran ne contient de SQL.
- **Formulaire contrôlé** : l'état garde la chaîne saisie, conversion en nombre à la validation (`12,5` → `12.5` avant `Number`), message d'erreur par champ.

**Réalisations techniques :** `SQLiteProvider` + `onInit`, `useIsFocused` pour relire la liste au retour, `SUM()` calculé par la base, `Promise.all` pour deux lectures indépendantes, union discriminée `ExpenseState`, composant générique `ChipGroup<T extends string>`, insertion de 3 exemples en une transaction, défi : migration v2 (colonne `note`).

**Pièges :** `parseFloat('12,5')` renvoie 12 sans erreur ; `SUM` renvoie `NULL` sans ligne ; un `await` oublié dans une boucle casse la transaction.

---

## Séance 03 — API REST avec TanStack Query

**Application :** Mini-Shop (DummyJSON) : catalogue à défilement infini, catégories, recherche, fiche produit, connexion, panier local.

**Concepts :**
- **Client fetch typé** `api<T>()` : URL de base unique, `ApiError` portant le code HTTP, en-tête `Authorization: Bearer`. `fetch` ne rejette **pas** sur un 404/500 : il faut tester `res.ok`. `as T` est une promesse au compilateur, pas une vérification.
- **État client vs état serveur** : l'état serveur est une copie, asynchrone, potentiellement périmée. `useEffect` + `fetch` ne gère pas les réponses dans le désordre, le cache, la déduplication, les nouveaux essais.
- **TanStack Query v5** : `QueryClient` unique créé hors composant, `QueryClientProvider` à la racine, `useQuery`, `queryKey` (toute variable de `queryFn` doit être dans la clé), `isPending` / `isError` / `isRefetching`.
- **Fraîcheur** : `staleTime` décide quand redemander, `gcTime` décide quand oublier (deux notions indépendantes).
- **`useInfiniteQuery`** (`limit` / `skip`, `getNextPageParam`) et **`useMutation`** + `invalidateQueries` (invalidation par préfixe de clé).
- **Session** : jeton dans `expo-secure-store` (chiffré, jamais AsyncStorage ni SQLite), partagé par un **React Context** (`AuthProvider`, `useAuth`, `isRestoring`) ; le profil `['me']` est un état serveur, `enabled` seulement si un jeton existe, retiré du cache à la déconnexion.

**Réalisations techniques :** composant `StateView` (chargement, erreur, vide, réessayer), `useDebouncedValue` (400 ms), route `product/[id]`, connexion `emilys` / `emilyspass`, panier SQLite (`ON CONFLICT ... DO UPDATE`) lu avec `useQuery` et écrit avec `useMutation`, compteur dans l'onglet, défi : ajout au panier distant avec mise à jour optimiste (`onMutate`, `onError`, `onSettled`).

**Pièges :** `No QueryClient set` (fournisseur manquant) ; passer `searchText` au lieu de la valeur retardée ; DummyJSON simule les écritures (rien n'est enregistré) ; le jeton ne va jamais dans une clé de requête.

---

## Séance 04 — Firebase : authentification et Firestore temps réel

**Application :** Shared Task Board (`s4-taskboard`) : tableau de tâches partagé, inscription et connexion par e-mail, synchronisation en temps réel entre deux téléphones, règles de sécurité.

**C'est la séance où l'on essaie Firebase.** Prérequis : le projet Firebase créé à la séance 00 (étape 6), avec Authentication e-mail/mot de passe activée et une base Firestore.

**Concepts :**
- **Backend as a service** : aucun code serveur ; SDK client + règles de sécurité. Seul le SDK JavaScript `firebase` (version 12) fonctionne dans Expo Go ; les paquets `@react-native-firebase/*` apportent du code natif et exigent un development build.
- **Configuration** : six valeurs de la config Web dans `.env` sous `EXPO_PUBLIC_*`. Elles sont copiées en clair dans le bundle : **ce n'est pas un secret**. `.env` n'est jamais commité, `.env.example` l'est. Après modification de `.env`, relancer `npx expo start`.
- **Authentification** : `initializeAuth` + `getReactNativePersistence(AsyncStorage)` pour garder la session. `onAuthStateChanged` est la seule source de vérité : `signIn` ne met pas à jour l'état, c'est l'écouteur qui le fait. Trois états : chargement (`initializing`), pas connecté, connecté.
- **Porte d'entrée** : `Stack.Protected guard={...}` dans le layout racine, sans `router.replace`.
- **Firestore** : collection `tasks`, documents (`title`, `done`, `ownerId`, `ownerEmail`, `createdAt`). `addDoc`, `updateDoc`, `deleteDoc`, `serverTimestamp`, `query` / `orderBy`. `onSnapshot` écoute en temps réel et renvoie une fonction de désabonnement à retourner depuis `useEffect`.
- **Compensation de latence** : l'écriture s'affiche tout de suite depuis le cache local (`hasPendingWrites`), puis le serveur confirme ou refuse (`permission-denied`) ; la promesse ne se résout qu'à la confirmation.
- **Règles de sécurité** (`firestore.rules`) : `request.auth`, `resource.data`, `request.resource.data`. Lecture pour les comptes connectés, création avec `ownerId == request.auth.uid`, modification et suppression par le propriétaire, titre de 1 à 80 caractères, `diff(...).affectedKeys().hasOnly(['done'])`. **Les règles sont la sécurité**, pas la configuration.

**Pièges :** `auth/invalid-api-key` (`.env` mal rempli ou Metro non relancé) ; écouteur sans désabonnement (consomme le quota de 50 000 lectures par jour du plan gratuit) ; base en mode test (ouverte à tous) ; masquer un bouton ne protège rien ; une modification faite dans la console n'est pas soumise aux règles.

**Défi :** assigner une tâche par e-mail (`assigneeEmail`), filtre « Mes tâches », règles avec `request.auth.token.email`.

**Livrable :** tag `s4-submit`, README avec deux captures, sortie d'`expo-doctor`, vérifier `git check-ignore .env` avant `git add`.

---

## Conclusion générale

1. **Une architecture stable** : écran → hook → dépôt/service → source de données. Les écrans ne contiennent ni `fetch`, ni SQL, ni SecureStore.
2. **TypeScript strict** comme filet de sécurité : `tsc --noEmit` sans erreur, sans `any` ni `@ts-ignore`, fait partie de la note.
3. **Chaque source de données a son outil** : `useState` pour l'éphémère, SQLite pour le local structuré, TanStack Query pour le serveur, SecureStore pour les secrets, Context pour partager un petit état rare.
4. **Toujours gérer les quatre états** d'un écran asynchrone : chargement, erreur, vide, données.
5. **Rigueur de remise** : vérifier `tsc` et `expo-doctor`, README avec capture d'écran, commit, puis tag `sN-submit` posé *après* le dernier commit. Le correcteur clone au tag et part d'une installation neuve.

## Aide-mémoire des commandes

```bash
npx create-expo-app@latest sN-nom --template default@sdk-57
npm run reset-project
npx expo install <paquet>
npx expo start            # ou: npx expo start --tunnel
npx tsc --noEmit
npx expo-doctor@latest
git add . && git commit -m "Add sN-nom" && git push
git tag sN-submit && git push origin sN-submit
```

## Prochaines séances (annoncées)

- S05 : offline-first, cache local et notifications
- S06 : IoT via MQTT (ESP32 / Wokwi)
- S07 : architecture et préparation à l'examen
