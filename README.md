---
**Étudiant :** Med Salah Tlili
**Séance :** 16-10-2026
**Établissement :** ISET Sidi Bouzid (ISET SBZ)
**Matière :** Développement multiplateforme avec React Native (Expo SDK 57), IAM2
**Dépôt GitHub :** https://github.com/DR-MST2017/iam2-rn-hamma-tlili
---

# Rapport des travaux réalisés

## 1. Résumé

| Élément | État |
| ------- | ---- |
| Lecture et synthèse des séances S00 à S04 | Fait (fichier `synthese-react-native-s00-s04.md`) |
| Mise à niveau de l'environnement (Node 24) | Fait |
| S04, étape 1 : projet `s4-taskboard` et connexion à Firebase | Fait et validé sur le téléphone |
| S04, étape 2 : connexion, inscription, porte d'entrée | Code écrit, tests sur le téléphone à confirmer |
| S04, étapes 3 à 6, défi, livrable | À faire |
| Publication sur GitHub (commit `34536cc`) | Fait pour `s4-taskboard` et `docs/` |
| S02 `s2-expenses` | À réparer avant publication |

## 2. Documentation du cours

Les cinq pages du cours ont été lues et résumées dans un seul fichier Markdown :

| Séance | Titre | Lien |
| ------ | ----- | ---- |
| Sommaire | Développement multiplateforme avec React Native (Expo) | https://waelbouazizii.github.io/rn-codelabs/index.html |
| S00 | Préparation de l'environnement | https://waelbouazizii.github.io/rn-codelabs/session-00.html |
| S01 | TypeScript, React et Expo Router | https://waelbouazizii.github.io/rn-codelabs/session-01.html#step-7 |
| S02 | Persistance locale avec SQLite | https://waelbouazizii.github.io/rn-codelabs/session-02.html#step-7 |
| S03 | Consommer une API REST avec TanStack Query | https://waelbouazizii.github.io/rn-codelabs/session-03.html#step-17 |
| S04 | Firebase : authentification et Firestore temps réel | https://waelbouazizii.github.io/rn-codelabs/session-04.html |

C'est à la séance 04 que Firebase s'utilise pour la première fois ; le projet Firebase est préparé à l'étape 6 de la séance 00.

## 3. Environnement

- Le terminal indiquait Node.js v20.19.6, alors que le cours exige Node 24 ou Node 22 (22.13 minimum).
- Installation de Node LTS avec `winget install OpenJS.NodeJS.LTS` (acceptation des conditions de la source `msstore`).
- Version vérifiée ensuite : **v24.20.0**.

## 4. Séance 04 : Shared Task Board (Firebase)

### Étape 1 : création du projet et branchement de Firebase

1. Création de l'application : `npx create-expo-app@latest s4-taskboard --template default@sdk-57`.
2. `npm run reset-project` : `src/app` ne contient plus que `index.tsx` et `_layout.tsx`.
3. Installation : `npx expo install firebase@12 @react-native-async-storage/async-storage` (AsyncStorage 2.2.0, Firebase 12).
4. Création de `.env.example` (six variables `EXPO_PUBLIC_FIREBASE_*` vides), de `src/lib/firebase.ts` et de `src/app/index.tsx`.
5. Ajout de `.env` au `.gitignore` ; vérification avec `git check-ignore -v` (le fichier est bien ignoré).
6. Dans la console Firebase : enregistrement d'une application Web et récupération de `firebaseConfig`.
7. Création de `.env` à partir de `.env.example` et collage des six valeurs.
8. Lancement : `npx expo start`. **Résultat validé** : Expo Go affiche « Projet Firebase : iam2-rn-tlili-24db6 ».

### Étape 2 : connexion, inscription et porte d'entrée

Fichiers créés ou remplacés :

| Fichier | Rôle |
| ------- | ---- |
| `src/features/auth/AuthContext.tsx` | Context alimenté par `onAuthStateChanged` ; expose `user`, `initializing`, `signIn`, `signUp`, `signOut` |
| `src/features/auth/authErrors.ts` | Messages d'erreur Firebase traduits en français |
| `src/app/_layout.tsx` | `AuthProvider` et `Stack.Protected` : le tableau n'est accessible qu'une fois connecté |
| `src/app/sign-in.tsx` | Écran de connexion et d'inscription |
| `src/app/index.tsx` | Tableau (compte connecté et bouton de déconnexion) |

Vérifications faites en ligne de commande avec `findstr` : `AuthContext.tsx`, `authErrors.ts`, `_layout.tsx` et `index.tsx` contiennent le bon code. `sign-in.tsx` était resté vide après `type nul` ; le code a été collé ensuite. **Tests sur le téléphone encore à confirmer** : écran « Connexion », messages d'erreur, création de compte, session conservée après redémarrage d'Expo Go.

### Reste à faire pour la séance 04

- Étape 3 : `tasksRepo.ts`, `useTasks.ts`, `firestoreErrors.ts`, `TaskRow.tsx`, publication de `firestore.rules`.
- Étape 4 : ajout de tâches (`addDoc`, `serverTimestamp`), test en mode avion.
- Étape 5 : boutons « Terminer » et « Supprimer », test avec un second compte.
- Étape 6 : synchronisation sur deux appareils, règles de validation (titre de 1 à 80 caractères).
- Défi : assignation par e-mail et filtre « Mes tâches ».
- Livrable : `npx tsc --noEmit`, `npx expo-doctor@latest`, README avec deux captures, tag `s4-submit`.

## 5. Problèmes rencontrés et solutions

| Problème | Cause | Solution |
| -------- | ------- | -------- |
| `Cannot find module ...\scripts\reset-project.js`, nom `w0-hello` affiché | `npm run reset-project` lancé depuis le mauvais dossier, npm a utilisé le `package.json` de la racine | Vérification de l'arborescence : le projet n'était pas imbriqué ; relance depuis `s4-taskboard` (nom `s4-taskboard` confirmé) |
| Node v20 au lieu de v24 | Version non conforme au cours | Mise à jour avec winget |
| `ENOTFOUND registry.npmjs.org` | Coupure réseau passagère | `ping` et `nslookup` corrects, puis installation relancée avec succès |
| `Rpc failed due to xhr error ... CreateWebApp` dans la console Firebase | Requête bloquée côté navigateur ou réseau | Rechargement de la page, vérification de la liste des applications, nouvel essai |
| Ancien écran affiché après la création des fichiers | Fichiers `_layout.tsx` et `index.tsx` non remplacés ou non enregistrés ; commande mal tapée | Collage du code, Ctrl+S, `npx expo start -c` |
| `sign-in.tsx` vide | Fichier créé avec `type nul`, code non collé | Code collé et enregistré |
| `findstr` sans résultat sur un mot accentué ou en minuscules | `findstr /c:` distingue la casse et gère mal les accents | Recherche sans accent ou avec l'option `/i` |

## 6. Publication sur GitHub

1. Le dossier de travail `iam2-rn-hamma-tlili-main` provenait d'un téléchargement (pas de dépôt Git).
2. Clonage de `https://github.com/DR-MST2017/iam2-rn-hamma-tlili.git`.
3. Copie du travail avec `robocopy ... /E /XO /XD node_modules .git .expo /XF .env` (aucune configuration secrète copiée).
4. Contrôle avant envoi : `.env` ignoré, aucun `node_modules` dans `git status`.
5. Ajout du résumé dans `docs/synthese-react-native-s00-s04.md`.
6. Commit **`34536cc`** « Add s4-taskboard (Firebase auth) and synthese S00-S04 », envoyé sur `origin/main`.

Ne sont pas encore publiés : le dossier `s2-expenses` et le doublon `src/db` à la racine.

## 7. Problème en attente : séance 02 (`s2-expenses`)

Constat après comparaison de fichiers (`fc`) :

- `s2-expenses/src/app/index.tsx`, `sign-in.tsx` et `_layout.tsx` sont **identiques** à ceux de `s4-taskboard` : le code de la séance 04 a été collé dans le dossier de la séance 02.
- Ce qui reste de la vraie séance 02 : la dépendance `expo-sqlite` et `src/db/migrations.ts` (migration avec `PRAGMA user_version`).
- Il manque le dépôt de dépenses, le hook et les écrans de la séance 02.
- Le sous-dossier `s2-expenses/s2-expenses` est un projet Expo neuf créé par erreur.
- `src/db/migrations.ts` à la racine du dépôt est un doublon de celui de `s2-expenses` (supprimable avec `rmdir /s /q src\db`).

Décision à prendre : refaire la séance 02 proprement, ou la publier plus tard. Elle ne doit pas être poussée dans son état actuel.

## 8. Règles de sécurité et bonnes pratiques retenues

- Le fichier `.env` n'est jamais commité ; `.env.example` (sans valeurs) l'est.
- La configuration Web de Firebase n'est pas un secret : ce sont les **règles de sécurité Firestore** qui protègent les données.
- Après chaque modification de `.env`, arrêter Metro (Ctrl+C) et relancer `npx expo start`.
- Le tag `s4-submit` se pose uniquement quand la séance est terminée (après le commit final).
- Jamais de `git push --force`, pas de `npm audit fix --force`.

## 9. Prochaines actions

1. Confirmer sur le téléphone les tests de l'étape 2.
2. Dérouler les étapes 3 à 6, le défi, puis le livrable de la séance 04.
3. Décider du sort de `s2-expenses` et le réparer.
4. Compléter le `README.md` de `s4-taskboard` (deux captures et sortie d'`expo-doctor`).
5. Poser le tag `s4-submit` et l'envoyer : `git tag s4-submit` puis `git push origin s4-submit`.
