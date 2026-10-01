import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuthStore } from '@stores/authStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { formatCurrency } from '@services/productApi';
import { Watermark } from '@components/Watermark';
import {
  STUDENT,
  ROOM_LABEL,
  VARIANT,
  examStamp,
  DEBOUNCE_MS,
  STALE_TIME_MS,
  PRICE_MULTIPLIER,
  BASE_SHIP_FEE,
  STUDENT_SEED,
  LAST_DIGIT,
} from '@constants/student';
import { COLORS } from '@constants/theme';

export const MeScreen: React.FC = () => {
  const logout = useAuthStore(state => state.logout);
  const identifier = useAuthStore(state => state.identifier);

  const {
    permissionStatus,
    currentLocation,
    distanceKm,
    shippingFee,
    isMock,
    errorMessage,
    requestPermission,
    mockCampusLocation,
    openSettings,
    campusGate,
  } = useCampusLocation();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi KTXGo?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>{STUDENT.hoTen.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{STUDENT.hoTen}</Text>
            <Text style={styles.userMssv}>MSSV: {STUDENT.mssv}</Text>
            <View style={styles.roomBadge}>
              <Text style={styles.roomBadgeText}>📍 Phòng {ROOM_LABEL}</Text>
            </View>
          </View>
        </View>

        {/* Exam Identification Badge */}
        <View style={styles.examCard}>
          <Text style={styles.examCardTitle}>THÔNG TIN BÀI THI TH2</Text>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Exam Stamp</Text>
              <Text style={styles.gridValue}>#{examStamp()}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Số cuối / Seed</Text>
              <Text style={styles.gridValue}>{LAST_DIGIT} / {STUDENT_SEED}</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Debounce</Text>
              <Text style={styles.gridValue}>{DEBOUNCE_MS} ms</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Stale Time</Text>
              <Text style={styles.gridValue}>{STALE_TIME_MS / 1000} s</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Hệ số giá</Text>
              <Text style={styles.gridValue}>{PRICE_MULTIPLIER.toLocaleString('vi-VN')}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Phí ship gốc</Text>
              <Text style={styles.gridValue}>{formatCurrency(BASE_SHIP_FEE)}</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Công thức ship</Text>
              <Text style={styles.gridValueHighlight}>Công thức {VARIANT.shipFormula}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Haptic Add</Text>
              <Text style={styles.gridValueHighlight}>{VARIANT.hapticOnAdd}</Text>
            </View>
          </View>
        </View>

        {/* Location & Shipping Section (Chương 7) */}
        <View style={styles.locationCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Định vị & Phí giao hàng KTX</Text>
            <View
              style={[
                styles.statusBadge,
                permissionStatus === 'granted'
                  ? styles.statusGranted
                  : permissionStatus === 'blocked'
                  ? styles.statusBlocked
                  : styles.statusDenied,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  permissionStatus === 'granted'
                    ? styles.statusTextGranted
                    : styles.statusTextDenied,
                ]}
              >
                {permissionStatus.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* 3 Permission Branches */}
          {permissionStatus === 'granted' ? (
            <View style={styles.locationDetails}>
              <View style={styles.locRow}>
                <Text style={styles.locLabel}>Tọa độ hiện tại:</Text>
                <Text style={styles.locValue}>
                  {currentLocation?.latitude.toFixed(4)}, {currentLocation?.longitude.toFixed(4)}
                  {isMock ? ' (Mock)' : ' (GPS)'}
                </Text>
              </View>

              <View style={styles.locRow}>
                <Text style={styles.locLabel}>Cổng KTX IUH:</Text>
                <Text style={styles.locValue}>
                  {campusGate.latitude}, {campusGate.longitude}
                </Text>
              </View>

              <View style={styles.locRow}>
                <Text style={styles.locLabel}>Khoảng cách Haversine:</Text>
                <Text style={styles.locValueBold}>{distanceKm} km</Text>
              </View>

              <View style={styles.formulaBox}>
                <Text style={styles.formulaText}>
                  Công thức {VARIANT.shipFormula}: {BASE_SHIP_FEE} + ({distanceKm} × 1500) + 2000
                </Text>
                <Text style={styles.calculatedFee}>
                  Phí ship tính được: {formatCurrency(shippingFee)}
                </Text>
              </View>
            </View>
          ) : permissionStatus === 'blocked' ? (
            <View style={styles.blockedBox}>
              <Text style={styles.blockedTitle}>⚠️ Quyền vị trí đã bị chặn</Text>
              <Text style={styles.blockedText}>
                Ứng dụng cần quyền vị trí để ước tính khoảng cách giao hàng đến {ROOM_LABEL}.
              </Text>
              <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
                <Text style={styles.settingsButtonText}>Mở Cài đặt hệ thống (Settings)</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.deniedBox}>
              <Text style={styles.deniedTitle}>Chưa cấp quyền vị trí</Text>
              <Text style={styles.deniedText}>
                {errorMessage || 'Nhấn nút bên dưới để xin quyền truy cập vị trí.'}
              </Text>
              <TouchableOpacity
                style={styles.requestButton}
                onPress={requestPermission}
              >
                <Text style={styles.requestButtonText}>Xin cấp quyền vị trí</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Test / Mock GPS Buttons */}
          <View style={styles.mockActions}>
            <Text style={styles.mockTitle}>Mô phỏng tọa độ kiểm thử (Máy ảo):</Text>
            <View style={styles.mockBtnRow}>
              <TouchableOpacity
                style={styles.mockBtn}
                onPress={() => mockCampusLocation(10.8285, 106.6912)}
              >
                <Text style={styles.mockBtnText}>Khu KTX (~1.2 km)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mockBtn}
                onPress={() => mockCampusLocation(10.8350, 106.7020)}
              >
                <Text style={styles.mockBtnText}>Ngoại trú (~2.5 km)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mockBtn}
                onPress={() => mockCampusLocation(10.8235, 106.6885)}
              >
                <Text style={styles.mockBtnText}>Cổng phụ (~0.3 km)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Account & Logout */}
        <View style={styles.accountCard}>
          <Text style={styles.sectionTitle}>Tài khoản KTXGo</Text>
          <Text style={styles.accountText}>
            Đang đăng nhập: <Text style={styles.accountTextBold}>{identifier || STUDENT.mssv}</Text>
          </Text>

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Đăng xuất khỏi ứng dụng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  userMssv: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
    fontWeight: '600',
  },
  roomBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roomBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  examCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  examCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gridItem: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 1,
  },
  gridValueHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
    marginTop: 1,
  },
  locationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusGranted: {
    backgroundColor: '#DCFCE7',
  },
  statusDenied: {
    backgroundColor: '#FEF3C7',
  },
  statusBlocked: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextGranted: {
    color: COLORS.success,
  },
  statusTextDenied: {
    color: COLORS.error,
  },
  locationDetails: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  locLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  locValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  locValueBold: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  formulaBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  formulaText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  calculatedFee: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
    marginTop: 2,
  },
  blockedBox: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  blockedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.error,
  },
  blockedText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    lineHeight: 16,
  },
  settingsButton: {
    marginTop: 10,
    backgroundColor: COLORS.error,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  deniedBox: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  deniedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  deniedText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  requestButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  mockActions: {
    marginTop: 12,
  },
  mockTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 6,
  },
  mockBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mockBtn: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  mockBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  accountCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  accountText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    marginBottom: 12,
  },
  accountTextBold: {
    color: COLORS.text,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 13,
  },
});
