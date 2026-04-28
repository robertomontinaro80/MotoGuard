/**
 * ScreenShell — layout base condiviso da tutte le schermate.
 * Gestisce SafeArea, header opzionale e scroll automatico.
 */

import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ViewStyle, StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppNavigation } from '@hooks/useAppNavigation';
import { Colors, Spacing, Typography } from '@theme/index';

interface ScreenShellProps {
  children: React.ReactNode;
  title?: string;
  /** Mostra freccia indietro */
  showBack?: boolean;
  /** Azione opzionale in alto a destra */
  headerRight?: React.ReactNode;
  /** Se true, avvolge i children in uno ScrollView */
  scrollable?: boolean;
  /** Padding bottom aggiuntivo per evitare che il contenuto finisca sotto la tab bar */
  bottomPadding?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ScreenShell({
  children,
  title,
  showBack = false,
  headerRight,
  scrollable = false,
  bottomPadding = true,
  style,
  testID,
}: ScreenShellProps) {
  const insets = useSafeAreaInsets();
  const nav = useAppNavigation();

  const Content = scrollable ? ScrollView : View;
  const contentProps = scrollable
    ? { contentContainerStyle: styles.scrollContent, showsVerticalScrollIndicator: false }
    : { style: [styles.fill, style] };

  return (
    <View
      testID={testID ?? 'screen-shell'}
      style={[styles.root, { paddingTop: insets.top }]}
    >
      {/* Header */}
      {(title || showBack || headerRight) && (
        <View style={styles.header} testID="screen-header">
          <View style={styles.headerLeft}>
            {showBack && (
              <TouchableOpacity
                onPress={() => nav.goBack()}
                style={styles.backBtn}
                testID="back-button"
                accessibilityLabel="Torna indietro"
                accessibilityRole="button"
              >
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
            )}
            {title && (
              <Text style={styles.title} testID="screen-title" numberOfLines={1}>
                {title}
              </Text>
            )}
          </View>
          {headerRight && (
            <View testID="header-right">{headerRight}</View>
          )}
        </View>
      )}

      {/* Body */}
      <Content {...(contentProps as object)}>
        {children}
        {bottomPadding && <View style={{ height: Spacing.xl }} />}
      </Content>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  backBtn: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  backArrow: {
    fontSize: 22,
    color: Colors.accent.primary,
    fontWeight: '600',
  },
  title: {
    ...(Typography.h3 as object),
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
});
