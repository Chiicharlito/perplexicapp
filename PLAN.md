# Plan de mise à jour des librairies — PerplexicApp

## Contexte

Le projet est sur **Expo SDK 51** (React 18.2, React Native 0.74.5, expo-router 3.x, React Navigation v6).
La dernière version stable est **Expo SDK 54** (54.0.33 — React 19.1, React Native 0.81, expo-router 4.x, React Navigation v7).
SDK 55 est en preview (55.0.0-preview.11 sur npm, tag `next`). La beta a démarré le 22 janvier 2026, la sortie stable est imminente mais pas encore publiée au 17 février 2026.

**Cible du plan** : SDK 54 (stable). Une fois SDK 55 sorti en stable, une Phase 4bis pourra être ajoutée pour monter de 54 à 55. SDK 55 supprime définitivement le support de l'ancienne architecture et inclut React Native 0.83 + React 19.2.

L'app est relativement légère : routing file-based, quelques packages Expo, AsyncStorage, lucide-react-native, et react-native-web. Pas de Firebase, pas d'expo-av, pas d'expo-file-system. Le chemin de migration devrait être propre.

## Stratégie : migration incrémentale

Expo recommande explicitement de **monter version par version** (51→52→53→54). Sauter des versions accumule les breaking changes et rend le debug impossible. Chaque étape sera commitée séparément pour pouvoir isoler les régressions.

---

## Phase 1 — SDK 51 → SDK 52

**Versions cibles** : Expo 52, React Native 0.77, React 18.3.1, expo-router ~4.0

### Étapes
1. `npx expo install expo@^52.0.0 && npx expo install --fix`
2. Mettre à jour les packages non-Expo si nécessaire (lucide-react-native, etc.)
3. **React Navigation v7** : expo-router 4.x l'adopte automatiquement
   - Vérifier les imports `@react-navigation/native` et `@react-navigation/stack` (passage à v7)
   - Comportement de `navigate` changé (agit comme `push` en v7) — vérifier les flux de navigation de l'app
4. Vérifier `app.json` : le champ `splash` legacy est déprécié en faveur de `splash.image` dans la config des plateformes
5. Supprimer les overrides metro/metro-resolver si présents
6. Tester : `npx expo start`, navigation, build web
7. Commit

### Points d'attention
- Expo Go SDK 52+ ne supporte que la New Architecture, mais on peut rester sur l'ancienne via dev builds
- Pas de migration React 19 à cette étape (SDK 52 reste sur React 18.x)

---

## Phase 2 — SDK 52 → SDK 53

**Versions cibles** : Expo 53, React Native 0.79, React 19.0.0

### Étapes
1. Vérifier Node.js >= 20 (Node 18 est EOL). Actuellement Node 22.22.0 — OK.
2. `npx expo install expo@^53.0.0 && npx expo install --fix`
3. **Migration React 19** — changements impactants potentiels :
   - `ref` est passé comme prop (plus de `forwardRef` nécessaire)
   - `useContext` → peut utiliser `use(Context)`
   - Vérifier les composants custom (ThemedText, ThemedView, BottomInput, etc.)
4. New Architecture activée par défaut — vérifier la compatibilité des packages tiers :
   - `@react-native-async-storage/async-storage` — supporte New Arch
   - `lucide-react-native` — vérifier compatibilité
   - `react-native-gesture-handler`, `react-native-reanimated` — supportent New Arch
5. `package.json` exports activés par défaut — vérifier les imports internes si existants
6. Tester : `npx expo start`, tous les écrans, fonctionnalité de recherche
7. Commit

### Points d'attention
- C'est la phase la plus risquée (React 19 + New Architecture)
- Si des problèmes apparaissent, on peut temporairement désactiver la New Architecture via `newArchEnabled: false` dans `app.json`

---

## Phase 3 — SDK 53 → SDK 54

**Versions cibles** : Expo 54, React Native 0.81, React 19.1.0

### Étapes
1. `npx expo install expo@^54.0.0 && npx expo install --fix`
2. Vérifier `app.json` : le champ `statusBar` n'est plus supporté à la racine/android config — le supprimer si présent
3. Vérifier que les icônes sont carrées (nouvelle validation stricte)
4. TypeScript Strict API typings activés par défaut — corriger les erreurs de typage éventuelles
5. SDK 54 est le **dernier à supporter l'ancienne architecture** — s'assurer que la New Architecture fonctionne bien
6. Mettre à jour `react-native-web` vers la version compatible
7. Tester : build complet, navigation, fonctionnalités
8. Commit

---

## Phase 4 — Mise à jour des dépendances non-Expo

Après avoir stabilisé le SDK, mettre à jour les packages restants :

| Package | Actuel | Action |
|---------|--------|--------|
| `lucide-react-native` | 0.453.0 | Mettre à jour vers latest |
| `prettier` | 3.3.3 | Mettre à jour vers latest |
| `@babel/core` | ^7.20.0 | Mettre à jour vers latest |
| `typescript` | ~5.3.3 | Mettre à jour vers ~5.6+ (compatible SDK 54) |
| `@types/react` | ~18.2.45 | Sera mis à jour automatiquement pour React 19 |

---

## Phase 5 — Nettoyage et validation finale

1. Supprimer `node_modules` et `package-lock.json`, réinstaller proprement
2. Lancer `npx expo-doctor` pour vérifier la cohérence des versions
3. Lancer le linter : `npm run lint`
4. Lancer les tests : `npm run test`
5. Tester manuellement : démarrage, navigation entre tabs, recherche, modals
6. Nettoyer les dépréciations restantes
7. Commit final

---

## Risques identifiés

| Risque | Impact | Mitigation |
|--------|--------|------------|
| React 19 breaking changes (Phase 2) | Moyen | App simple, peu de composants custom |
| React Navigation v7 / navigate behavior (Phase 1) | Faible | Vérifier les flux de navigation |
| New Architecture + packages tiers (Phase 2) | Moyen | Opt-out possible via `newArchEnabled: false` |
| lucide-react-native incompatible New Arch | Faible | Fallback vers @expo/vector-icons si nécessaire |

## Recommandation

Vu la taille du projet (app légère, ~15 fichiers de code, pas de native modules custom), la migration devrait être relativement fluide. La phase la plus délicate est la Phase 2 (React 19 + New Architecture). Je recommande de procéder dans l'ordre et de valider chaque phase avant de passer à la suivante.
