import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchProducts, Product } from '@services/productApi';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { ProductCard } from '@components/ProductCard';
import { Watermark } from '@components/Watermark';
import { STUDENT, ROOM_LABEL, DEBOUNCE_MS, STALE_TIME_MS, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import { ShopStackParamList } from '@navigation/ShopStack';

type HomeScreenNavProp = NativeStackNavigationProp<ShopStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavProp>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, DEBOUNCE_MS);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => fetchProducts(12),
    staleTime: STALE_TIME_MS,
  });

  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return products;
    }
    const lower = debouncedSearchTerm.toLowerCase();
    return products.filter(
      p =>
        p.title.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }, [products, debouncedSearchTerm]);

  const handleProductPress = (id: number) => {
    navigation.navigate('Detail', { id: String(id) });
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    return <ProductCard product={item} onPress={handleProductPress} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header (A) */}
      <View style={styles.header}>
        <View>
          <View style={styles.brandRow}>
            <Text style={styles.headerTitle}>KTX</Text>
            <Text style={styles.headerTitleOrange}>GO</Text>
          </View>
          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryBadgeIcon}>📍</Text>
            <Text style={styles.deliveryBadgeText}>Giao tận {ROOM_LABEL}</Text>
          </View>
        </View>

        <View style={styles.studentBadge}>
          <Text style={styles.studentBadgeMssv}>{STUDENT.mssv}</Text>
          <Text style={styles.studentBadgeName}>{STUDENT.hoTen}</Text>
        </View>
      </View>

      {/* Search Bar (B) */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm món ăn, đồ uống, văn phòng phẩm..."
          placeholderTextColor={COLORS.textLight}
          value={searchTerm}
          onChangeText={setSearchTerm}
          clearButtonMode="while-editing"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content (C) - 3 Network States */}
      <View style={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Đang tải danh sách món KTXGo...</Text>
            <Text style={styles.subLoadingText}>staleTime: {STALE_TIME_MS}ms · MSSV: {STUDENT.mssv}</Text>
          </View>
        ) : isError ? (
          <View style={styles.centerContainer}>
            <View style={styles.errorIconBox}>
              <Text style={styles.errorIcon}>⚠️</Text>
            </View>
            <Text style={styles.errorTitle}>Lỗi kết nối dữ liệu</Text>
            <Text style={styles.errorMessage}>
              Không thể tải danh sách sản phẩm.
            </Text>
            <Text style={styles.errorSubMessage}>
              Mã lỗi: {error?.message || 'Network Error'} · [MSSV: {STUDENT.mssv}]
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Thử lại ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlashList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
            numColumns={2}
            estimatedItemSize={220}
            contentContainerStyle={styles.listContent}
            refreshing={isRefetching}
            onRefresh={refetch}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyText}>Không tìm thấy món "{debouncedSearchTerm}"</Text>
                <Text style={styles.emptySubText}>Thử tìm kiếm với từ khóa khác</Text>
              </View>
            }
          />
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  headerTitleOrange: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  deliveryBadgeIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  deliveryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  studentBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-end',
  },
  studentBadgeMssv: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  studentBadgeName: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 16,
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
  subLoadingText: {
    marginTop: 4,
    fontSize: 11,
    color: COLORS.textLight,
  },
  errorIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorIcon: {
    fontSize: 30,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.error,
  },
  errorMessage: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  errorSubMessage: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'center',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySubText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
});
