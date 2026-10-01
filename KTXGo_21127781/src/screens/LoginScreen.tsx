import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuthStore } from '@stores/authStore';
import { STUDENT, VARIANT, ROOM_LABEL, examStamp } from '@constants/student';
import { COLORS } from '@constants/theme';
import { Watermark } from '@components/Watermark';

export const LoginScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState(
    VARIANT.authField === 'phone' ? '0912345678' : `${STUDENT.mssv}@sv.iuh.edu.vn`
  );
  const [password, setPassword] = useState('123456');
  const login = useAuthStore(state => state.login);

  const handleLogin = () => {
    if (!identifier.trim()) {
      Alert.alert(
        'Lỗi',
        `Vui lòng nhập ${VARIANT.authField === 'phone' ? 'số điện thoại' : 'email'} của bạn.`
      );
      return;
    }
    login(identifier.trim());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.card}>
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>KTX</Text>
              <Text style={styles.logoSubText}>Go</Text>
            </View>
            <Text style={styles.appTitle}>KTXGo Delivery</Text>
            <Text style={styles.appSubtitle}>
              Dịch vụ giao đồ tận phòng · {ROOM_LABEL}
            </Text>
          </View>

          <View style={styles.examBanner}>
            <Text style={styles.examBannerTitle}>BÀI THI THỰC HÀNH 2</Text>
            <Text style={styles.examBannerText}>
              MSSV: {STUDENT.mssv} · {STUDENT.hoTen}
            </Text>
            <Text style={styles.examBannerStamp}>Mã đề: #{examStamp()}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>
              {VARIANT.authField === 'phone'
                ? 'Số điện thoại sinh viên'
                : 'Email sinh viên'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                VARIANT.authField === 'phone'
                  ? 'Nhập số điện thoại (vd: 0912345678)'
                  : 'Nhập email sinh viên'
              }
              placeholderTextColor={COLORS.textLight}
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType={VARIANT.authField === 'phone' ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Mật khẩu sinh viên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu (mặc định: 123456)"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Vào cửa hàng</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              • Ô đăng nhập: <Text style={styles.infoBold}>{VARIANT.authField.toUpperCase()}</Text>
            </Text>
            <Text style={styles.infoText}>
              • Thứ tự tab: <Text style={styles.infoBold}>{VARIANT.tabOrder}</Text>
            </Text>
            <Text style={styles.infoText}>
              • Công thức ship: <Text style={styles.infoBold}>Formula {VARIANT.shipFormula}</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  logoSubText: {
    color: COLORS.secondary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  appSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  examBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  examBannerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  examBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 2,
  },
  examBannerStamp: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  form: {
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.text,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  infoBox: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  infoText: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  infoBold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});
