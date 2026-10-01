import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

interface WatermarkProps {
  forcePosition?: 'top' | 'bottom';
}

export const Watermark: React.FC<WatermarkProps> = ({ forcePosition }) => {
  const stamp = examStamp();
  const displayText = `TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${stamp}`;

  const isTop = forcePosition ? forcePosition === 'top' : VARIANT.watermarkAtTop;

  return (
    <View style={[styles.container, isTop ? styles.topContainer : styles.bottomContainer]}>
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="middle">
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 999,
  },
  topContainer: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginHorizontal: 12,
    marginBottom: 4,
  },
  bottomContainer: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
});
