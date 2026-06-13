---
title: salt-theme-gen with Expo — Expo Router, expo-system-ui, AsyncStorage
published: false
description: Wire salt-theme-gen into an Expo app: root layout ThemeProvider, native background color sync, AsyncStorage persistence, Expo Go compatible.
tags: expo, reactnative, javascript, mobile
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

Expo adds a few things on top of bare React Native that matter for theming: `expo-system-ui` for the native background color (visible during app launch), `AsyncStorage` from the Expo SDK, and Expo Router's `_layout.tsx` as the provider entry point.

This article is Expo-specific. If you use bare React Native without Expo, the [React Native article](https://dev.to/) covers the same patterns with a slightly different setup.

## Install

```bash
npx expo install salt-theme-gen @react-native-async-storage/async-storage
```

Always use `npx expo install` — it resolves the version compatible with your Expo SDK.

## Theme file

```ts
// src/theme/index.ts
import { generateTheme } from 'salt-theme-gen';

export const theme = generateTheme({
  preset:   'ocean',
  spacing:  'default',
  radius:   'default',
  fontSize: 'default',
});
```

## ThemeProvider with AsyncStorage

The `loaded` gate prevents rendering until the persisted preference is read. Without it, there's a flash where the app renders in the wrong mode.

```tsx
// src/theme/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GeneratedThemeMode } from 'salt-theme-gen';
import { theme } from './index';

type Preference = 'light' | 'dark' | 'system';

interface ThemeCtx {
  mode:          GeneratedThemeMode;
  isDark:        boolean;
  preference:    Preference;
  setPreference: (p: Preference) => Promise<void>;
}

const Ctx = createContext<ThemeCtx>({
  mode:          theme.light,
  isDark:        false,
  preference:    'system',
  setPreference: async () => {},
});

const KEY = '@app/theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [pref, setPref] = useState<Preference>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(s => {
      if (s === 'light' || s === 'dark' || s === 'system') setPref(s);
      setLoaded(true);
    });
  }, []);

  async function setPreference(p: Preference) {
    setPref(p);
    await AsyncStorage.setItem(KEY, p);
  }

  const isDark = pref === 'dark' || (pref === 'system' && system === 'dark');

  if (!loaded) return null;

  return (
    <Ctx.Provider value={{ mode: isDark ? theme.dark : theme.light, isDark, pref, setPreference }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
```

## Expo Router root layout

```tsx
// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';

function RootNav() {
  const { mode, isDark } = useTheme();

  // Sync native background color — visible during launch, behind keyboard
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(mode.colors.background);
  }, [isDark, mode.colors.background]);

  return (
    <Stack
      screenOptions={{
        headerStyle:      { backgroundColor: mode.colors.surface },
        headerTintColor:  mode.colors.primary,
        headerTitleStyle: { color: mode.colors.text, fontWeight: '700' },
        contentStyle:     { backgroundColor: mode.colors.background },
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNav />
    </ThemeProvider>
  );
}
```

`expo-system-ui` sets the native background color shown during app launch and behind the software keyboard. Without it, you get a white flash even when your app background is dark.

## app.json

```json
{
  "expo": {
    "backgroundColor": "#F5F7FF",
    "userInterfaceStyle": "automatic",
    "ios": {
      "userInterfaceStyle": "automatic"
    },
    "android": {
      "softwareKeyboardLayoutMode": "pan"
    }
  }
}
```

`userInterfaceStyle: "automatic"` passes the OS dark/light preference to `useColorScheme()`.

## Using tokens in screens

```tsx
// app/index.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '../src/theme/ThemeContext';

export default function HomeScreen() {
  const { mode } = useTheme();

  const s = useMemo(() => StyleSheet.create({
    screen: { flex: 1, backgroundColor: mode.colors.background, padding: mode.spacing.xl },
    h1:     { fontSize: mode.fontSizes['3xl'], fontWeight: '800', color: mode.colors.text },
    card:   {
      backgroundColor: mode.surfaceElevation.card,
      borderWidth: 1, borderColor: mode.colors.border,
      borderRadius: mode.radius.lg, padding: mode.spacing.xl,
      marginTop: mode.spacing.md,
    },
  }), [mode]);

  return (
    <View style={s.screen}>
      <Text style={s.h1}>Home</Text>
      <View style={s.card}>
        <Text style={{ color: mode.colors.text }}>Card styled with tokens</Text>
      </View>
    </View>
  );
}
```

## Expo Go compatibility

`salt-theme-gen` is pure JavaScript with zero native modules. It works in Expo Go without a custom development client:

```bash
npx expo start
```

Scan the QR code — the theme is active immediately.

## EAS Build

No additional config. `salt-theme-gen` has no native dependencies.

```bash
eas build --platform all --profile preview
```

Full guide: [learn.esalt.net/salt-theme-gen/integrations/expo/](https://learn.esalt.net/salt-theme-gen/integrations/expo/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 13 of 24*

[← 12. With React Native](./12-react-native.md) &nbsp;·&nbsp; [14. With Astro →](./14-astro.md)
