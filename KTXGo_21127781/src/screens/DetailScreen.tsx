import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { fetchProductById, Product, calculateProductPrice, formatCurrency } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import { Watermark } from '@components/Watermark';
import { STUDENT, ROOM_LABEL, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import { ShopStackParamList } from '@navigation/ShopStack';

type DetailScreenRouteProp = RouteProp<ShopStackParamList, 'Detail'>;

export const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const productId = route.params.id;
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(state => state.addToCart);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
  });

  const handleAddToCart = async () => {
    if (!product) return;

    addToCart(product, quantity);

    // Haptic feedback according to student variant
    try {
      if (VARIANT.hapticOnAdd === 'selection') {
        await Haptics.selectionAsync();
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch {
      // safe fallback on emulator
    }

    Alert.alert(
      'Thêm vào giỏ thành công!',
      `Đã thêm ${quantity}x "${product.title}" vào giỏ hàng giao đến ${ROOM_LABEL}.\n\n[MSSV: ${STUDENT.mssv} - ${STUDENT.hoTen}]`,
      [{ text: 'Đồng ý' }]
    );
  };

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {VARIANT.watermarkAtTop && <Watermark />}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải chi tiết món...</Text>
        </View>
        {!VARIANT.watermarkAtTop && <Watermark />}
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {VARIANT.watermarkAtTop && <Watermark />}
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Lỗi tải thông tin sản phẩm: {error?.message || 'Không tìm thấy'}
          </Text>
          <Text style={styles.errorSubText}>MSSV: {STUDENT.mssv}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
        {!VARIANT.watermarkAtTop && <Watermark />}
      </SafeAreaView>
    );
  }

  const calculatedUnitPrice = calculateProductPrice(product.price);
  const totalPrice = calculatedUnitPrice * quantity;

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingText}>
                {product.rating?.rate || '4.5'} ({product.rating?.count || 120} đánh giá)
              </Text>
            </View>

            <View style={styles.roomTag}>
              <Text style={styles.roomTagText}>Giao tận {ROOM_LABEL}</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.priceLabel}>Đơn giá sinh viên</Text>
              <Text style={styles.priceText}>{formatCurrency(calculatedUnitPrice)}</Text>
            </View>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={handleDecrease}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyNumber}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={handleIncrease}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionHeader}>Mô tả món</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.examNoteBox}>
            <Text style={styles.examNoteTitle}>Thông tin kiểm tra TH2</Text>
            <Text style={styles.examNoteText}>
              • MSSV: {STUDENT.mssv} · {STUDENT.hoTen}
            </Text>
            <Text style={styles.examNoteText}>
              • Detail Presentation: {VARIANT.detailPresentation.toUpperCase()}
            </Text>
            <Text style={styles.examNoteText}>
              • Haptic on Add: {VARIANT.hapticOnAdd}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceLabel}>Tổng tạm tính ({quantity} món):</Text>
          <Text style={styles.bottomPriceValue}>{formatCurrency(totalPrice)}</Text>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          activeOpacity={0.8}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>

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
    paddingBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 260,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 20,
  },
  image: {
    width: '85%',
    height: '85%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(29, 78, 216, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    padding: 20,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingStar: {
    color: '#D97706',
    fontSize: 13,
    marginRight: 4,
  },
  ratingText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  roomTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roomTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  qtyNumber: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  examNoteBox: {
    marginTop: 20,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  examNoteTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  examNoteText: {
    fontSize: 11,
    color: COLORS.text,
    lineHeight: 16,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomPriceCol: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  bottomPriceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 12,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
