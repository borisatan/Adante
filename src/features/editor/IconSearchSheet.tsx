import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ALL_ICONS } from '@/icons/allIcons';
import { theme } from '@/theme/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (slug: string) => void;
}

const NUM_COLUMNS = 6;

export function IconSearchSheet({ visible, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ICONS;
    return ALL_ICONS.filter((i) => i.slug.includes(q));
  }, [query]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            style={styles.search}
            placeholder="Search icons…"
            placeholderTextColor={theme.colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          <Pressable hitSlop={8} onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.slug}
          numColumns={NUM_COLUMNS}
          initialNumToRender={10}
          windowSize={7}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.cell}
              onPress={() => {
                onSelect(item.slug);
                setQuery('');
                onClose();
              }}
            >
              <item.Icon size={24} color={theme.colors.textPrimary} />
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  search: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.control,
    borderWidth: theme.border.width,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontSize: theme.font.body,
  },
  cancel: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.body,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: `${100 / NUM_COLUMNS}%`,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
