import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useCartStore } from '@stores/cartStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { calculateProductPrice, formatCurrency } from '@services/productApi';
import { Watermark } from '@components/Watermark';
import { STUDENT, ROOM_LABEL, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export const CartScreen: React.FC = () => {
  const {
    items,
    changeQuantity,
    removeFromCart,
    clearCart,
    getTotalAmount,
    getTotalQuantity,
  } = useCartStore();

  const {
    permissionStatus,
    distanceKm,
    shippingFee,
  } = useCampusLocation();

  const subTotal = getTotalAmount();
  const totalQty = getTotalQuantity();
  const effectiveShipFee = totalQty > 0 ? shippingFee : 0;
  const grandTotal = subTotal + effectiveShipFee;

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống.');
      return;
    }

    Alert.alert(
      'Xác nhận đặt đơn KTXGo',
      `Đơn hàng giao đến: ${ROOM_LABEL}\nSố lượng món: ${totalQty}\nTổng thanh toán: ${formatCurrency(
        grandTotal
      )}\n\n[Sinh viên: ${STUDENT.hoTen} - ${STUDENT.mssv}]`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận đặt',
          onPress: () => {
            clearCart();
            Alert.alert(
              'Đặt hàng thành công!',
              `Shipper nội khu đang chuẩn bị mang đồ lên ${ROOM_LABEL}.\nCảm ơn bạn đã sử dụng KTXGo!`
            );
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    Alert.alert('Xóa giỏ hàng', 'Bạn có chắc chắn muốn xóa toàn bộ món trong giỏ?', [
      { text: 'Không', style: 'cancel' },
      { text: 'Xóa tất cả', style: 'destructive', onPress: clearCart },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Giỏ hàng KTXGo</Text>
          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryBadgeText}>📍 Giao tận {ROOM_LABEL}</Text>
          </View>
        </View>

        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearAllButton}>
            <Text style={styles.clearAllText}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
          <Text style={styles.emptySubTitle}>
            Hãy quay lại tab Cửa hàng và chọn những món yêu thích giao đến {ROOM_LABEL}!
          </Text>
          <View style={styles.persistNote}>
            <Text style={styles.persistNoteText}>
              Dữ liệu giỏ được lưu trữ qua Zustand Persist
            </Text>
            <Text style={styles.persistKeyText}>Key: ktxgo-cart-{STUDENT.mssv}</Text>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Item List */}
          <View style={styles.itemList}>
            {items.map(item => {
              const unitPrice = calculateProductPrice(item.product.price);
              const itemTotal = unitPrice * item.quantity;

              return (
                <View key={`${STUDENT.mssv}-${item.product.id}`} style={styles.cartCard}>
                  <Image
                    source={{ uri: item.product.image }}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {item.product.title}
                    </Text>
                    <Text style={styles.itemUnitPrice}>{formatCurrency(unitPrice)}</Text>

                    <View style={styles.itemRow}>
                      <View style={styles.qtyControls}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() =>
                            changeQuantity(item.product.id, item.quantity - 1)
                          }
                        >
                          <Text style={styles.qtyBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() =>
                            changeQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.itemTotalPrice}>{formatCurrency(itemTotal)}</Text>

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => removeFromCart(item.product.id)}
                      >
                        <Text style={styles.deleteBtnText}>🗑</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Bill summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Chi tiết thanh toán</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính ({totalQty} món):</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subTotal)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Phí giao hàng KTX:</Text>
                <Text style={styles.shippingNote}>
                  {permissionStatus === 'granted' && distanceKm !== null
                    ? `Khoảng cách: ${distanceKm} km (Công thức ${VARIANT.shipFormula})`
                    : 'Phí tiêu chuẩn KTX'}
                </Text>
              </View>
              <Text style={styles.shippingValue}>{formatCurrency(effectiveShipFee)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.grandTotalLabel}>Tổng cộng:</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(grandTotal)}</Text>
            </View>

            <View style={styles.destBox}>
              <Text style={styles.destLabel}>Địa điểm nhận hàng:</Text>
              <Text style={styles.destValue}>Ký túc xá IUH · {ROOM_LABEL}</Text>
              <Text style={styles.destStudent}>
                Sinh viên: {STUDENT.hoTen} - MSSV: {STUDENT.mssv}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Footer / Checkout */}
      {items.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomTotalCol}>
            <Text style={styles.bottomTotalLabel}>Tổng tiền ({totalQty} món):</Text>
            <Text style={styles.bottomTotalValue}>{formatCurrency(grandTotal)}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            activeOpacity={0.8}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Đặt giao tận phòng</Text>
          </TouchableOpacity>
        </View>
      )}

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  deliveryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  deliveryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  clearAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearAllText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 20,
  },
  itemList: {
    marginBottom: 12,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 17,
  },
  itemUnitPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qtyBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  qtyValue: {
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  itemTotalPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteBtnText: {
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.text,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  shippingNote: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  shippingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  destBox: {
    marginTop: 12,
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  destLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  destValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 1,
  },
  destStudent: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  bottomTotalCol: {
    flex: 1,
  },
  bottomTotalLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  bottomTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySubTitle: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
  persistNote: {
    marginTop: 24,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  persistNoteText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  persistKeyText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
});
