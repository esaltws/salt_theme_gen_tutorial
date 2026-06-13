---
title: salt-theme-gen with React Native — No CSS Variables, Just JS Objects
published: false
description: React Native doesn't support CSS custom properties. Use GeneratedThemeMode objects directly with useContext and useMemo for performant StyleSheet creation.
tags: reactnative, javascript, typescript, mobile
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

React Native has no CSS cascade, no `var()`, no `:root`. Design tokens in React Native mean JavaScript objects passed through context. `salt-theme-gen` outputs exactly that — a typed `GeneratedThemeMode` object your StyleSheets can consume directly.

## The key difference from web

On web: inject CSS variables into `<head>`, reference with `var(--color-primary)`.

On React Native: pass the mode object through context, read `mode.colors.primary` directly.

```ts
// Web
<div style={{ color: 'var(--color-primary)' }}>

// React Native
<Text style={{ color: mode.colors.primary }}>
```

Same token values — different consumption pattern.

## Install

```bash
npm install salt-theme-gen @react-native-async-storage/async-storage
```

## Theme setup

```ts
// src/theme/index.ts
import { generateTheme } from 'salt-theme-gen';

export const theme = generateTheme({
  preset:   'ocean',
  spacing:  'default',
  radius:   'default',
  fontSize: 'default',
});

export type ThemeMode = typeof theme.light;
```

## ThemeContext with AsyncStorage persistence

```tsx
// src/theme/ThemeContext.tsx
import React, {
  createContext, useContext, useState, useEffect, ReactNode
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './index';

type Preference = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode:       typeof theme.light;
  isDark:     boolean;
  preference: Preference;
  setPreference: (p: Preference) => void;
}

const Ctx = createContext<ThemeContextValue>({
  mode:          theme.light,
  isDark:        false,
  preference:    'system',
  setPreference: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPref] = useState<Preference>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@theme').then(saved => {
      if (saved === 'light' || saved === 'dark' || saved === 'system')
        setPref(saved);
      setLoaded(true);
    });
  }, []);

  async function setPreference(p: Preference) {
    setPref(p);
    await AsyncStorage.setItem('@theme', p);
  }

  const isDark =
    preference === 'dark' ||
    (preference === 'system' && systemScheme === 'dark');

  if (!loaded) return null; // Prevents flash before preference loads

  return (
    <Ctx.Provider value={{ mode: isDark ? theme.dark : theme.light, isDark, preference, setPreference }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
```

## Using tokens with useMemo

Always wrap `StyleSheet.create` in `useMemo([mode])` — the mode object reference changes on theme toggle, and without `useMemo`, StyleSheet gets recreated on every render:

```tsx
// src/screens/HomeScreen.tsx
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '../theme/ThemeContext';

export default function HomeScreen() {
  const { mode } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: mode.colors.background,
    },
    heading: {
      fontSize:      mode.fontSizes['3xl'],
      fontWeight:    '800',
      color:         mode.colors.text,
      marginBottom:  mode.spacing.sm,
    },
    muted: {
      fontSize:  mode.fontSizes.lg,
      color:     mode.colors.muted,
      lineHeight: mode.fontSizes.lg * 1.6,
    },
    card: {
      backgroundColor: mode.surfaceElevation.card,
      borderWidth:  1,
      borderColor:  mode.colors.border,
      borderRadius: mode.radius.lg,
      padding:      mode.spacing.xl,
      marginBottom: mode.spacing.md,
    },
  }), [mode]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: mode.spacing.xl }}>
        <Text style={styles.heading}>Home</Text>
        <Text style={styles.muted}>
          Styled with salt-theme-gen tokens.
        </Text>
        <View style={styles.card}>
          <Text style={{ color: mode.colors.text, fontSize: mode.fontSizes.md }}>
            Card content
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
```

## Button with intent variants

```tsx
import type { IntentName } from 'salt-theme-gen';

interface ButtonProps {
  label:   string;
  intent?: IntentName;
  onPress: () => void;
}

export function Button({ label, intent = 'primary', onPress }: ButtonProps) {
  const { mode } = useTheme();

  const bg  = mode.colors[intent];
  const fg  = mode.colors[`on${intent.charAt(0).toUpperCase()}${intent.slice(1)}` as keyof typeof mode.colors];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? mode.states[intent as keyof typeof mode.states]?.pressed ?? bg : bg,
        borderRadius:    mode.radius.md,
        padding:         mode.spacing.sm,
        paddingHorizontal: mode.spacing.lg,
        alignItems:      'center',
        opacity:         pressed ? 0.9 : 1,
      })}
    >
      <Text style={{ color: fg, fontWeight: '600', fontSize: mode.fontSizes.md }}>
        {label}
      </Text>
    </Pressable>
  );
}
```

## Settings screen with preference picker

```tsx
export function SettingsScreen() {
  const { preference, setPreference, mode } = useTheme();

  return (
    <View style={{ backgroundColor: mode.colors.background, flex: 1, padding: mode.spacing.xl }}>
      {(['light', 'dark', 'system'] as const).map(p => (
        <Pressable
          key={p}
          onPress={() => setPreference(p)}
          style={{
            flexDirection:    'row',
            justifyContent:   'space-between',
            paddingVertical:  mode.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: mode.colors.border,
          }}
        >
          <Text style={{ color: mode.colors.text, fontSize: mode.fontSizes.md, textTransform: 'capitalize' }}>
            {p}
          </Text>
          {preference === p && (
            <Text style={{ color: mode.colors.primary, fontWeight: '700' }}>✓</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}
```

Full guide: [learn.esalt.net/salt-theme-gen/integrations/react-native/](https://learn.esalt.net/salt-theme-gen/integrations/react-native/)
