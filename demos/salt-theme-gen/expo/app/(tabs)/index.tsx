import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useColorScheme, StyleSheet } from 'react-native';
import { LightTheme, DarkTheme } from '../../constants/Theme';

export default function HomeScreen() {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);
  const mode = override ?? systemScheme ?? 'light';
  const t = mode === 'dark' ? DarkTheme : LightTheme;

  const colors = Object.entries(t.colors);
  const spacing = Object.entries(t.spacing);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.background }}>
      <View style={{ padding: t.spacing.xl }}>
        <Text style={{ fontSize: t.fontSizes.xl, fontWeight: 'bold', color: t.colors.text, marginBottom: t.spacing.sm }}>
          salt-theme-gen — Expo
        </Text>
        <Text style={{ fontSize: t.fontSizes.sm, color: t.colors.muted, marginBottom: t.spacing.lg }}>
          Preset: ocean · {mode} mode
        </Text>

        <TouchableOpacity
          onPress={() => setOverride(mode === 'light' ? 'dark' : 'light')}
          style={{ backgroundColor: t.colors.primary, padding: t.spacing.sm, borderRadius: t.radius.md, alignSelf: 'flex-start', marginBottom: t.spacing.xl }}
        >
          <Text style={{ color: t.colors.onPrimary, fontSize: t.fontSizes.sm }}>Toggle dark mode</Text>
        </TouchableOpacity>

        <View style={{ backgroundColor: t.colors.surface, borderWidth: 1, borderColor: t.colors.border, borderRadius: t.radius.lg, padding: t.spacing.lg, marginBottom: t.spacing.lg }}>
          <Text style={{ fontSize: t.fontSizes.md, fontWeight: '600', color: t.colors.text, marginBottom: t.spacing.md }}>
            Color palette ({colors.length} colors)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm }}>
            {colors.map(([name, value]) => (
              <View
                key={name}
                style={{ width: 40, height: 40, borderRadius: t.radius.sm, backgroundColor: value, borderWidth: 1, borderColor: t.colors.border }}
              />
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: t.colors.surface, borderWidth: 1, borderColor: t.colors.border, borderRadius: t.radius.lg, padding: t.spacing.lg }}>
          <Text style={{ fontSize: t.fontSizes.md, fontWeight: '600', color: t.colors.text, marginBottom: t.spacing.md }}>
            Spacing scale
          </Text>
          {spacing.map(([k, v]) => (
            <View key={k} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ width: 40, fontSize: 12, color: t.colors.muted }}>{k}</Text>
              <View style={{ height: 4, backgroundColor: t.colors.primary, width: (v as number) * 1.5 }} />
              <Text style={{ fontSize: 12, color: t.colors.muted, marginLeft: 8 }}>{v}px</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
