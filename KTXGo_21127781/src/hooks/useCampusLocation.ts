import { useState, useEffect, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';

// Tọa độ cổng KTX Đại học Công nghiệp TP.HCM (IUH)
export const CAMPUS_GATE = {
  latitude: 10.8222,
  longitude: 106.6875,
  name: 'Cổng KTX IUH (Nguyễn Văn Bảo, Gò Vấp)',
};

// Haversine formula to calculate distance in kilometers
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export function calculateShippingFee(distanceKm: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(distanceKm * 2000);
  } else {
    // Formula B
    return BASE_SHIP_FEE + Math.round(distanceKm * 1500) + 2000;
  }
}

export type PermissionStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'blocked';

export function useCampusLocation() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('idle');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [shippingFee, setShippingFee] = useState<number>(BASE_SHIP_FEE);
  const [isMock, setIsMock] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateLocationAndFee = useCallback((lat: number, lon: number, mock: boolean = false) => {
    setCurrentLocation({ latitude: lat, longitude: lon });
    setIsMock(mock);
    const dist = calculateHaversineDistance(lat, lon, CAMPUS_GATE.latitude, CAMPUS_GATE.longitude);
    setDistanceKm(dist);
    const fee = calculateShippingFee(dist);
    setShippingFee(fee);
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      setPermissionStatus('loading');
      setErrorMessage(null);

      // Check existing permission
      const { status: existingStatus, canAskAgain } = await Location.getForegroundPermissionsAsync();

      if (existingStatus === 'granted') {
        setPermissionStatus('granted');
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        updateLocationAndFee(loc.coords.latitude, loc.coords.longitude, false);
        return;
      }

      if (existingStatus === 'denied' && !canAskAgain) {
        setPermissionStatus('blocked');
        setErrorMessage('Quyền vị trí đã bị chặn. Vui lòng mở Cài đặt để cấp quyền.');
        return;
      }

      // Request foreground permission
      const { status: newStatus, canAskAgain: newCanAskAgain } = await Location.requestForegroundPermissionsAsync();

      if (newStatus === 'granted') {
        setPermissionStatus('granted');
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        updateLocationAndFee(loc.coords.latitude, loc.coords.longitude, false);
      } else if (!newCanAskAgain) {
        setPermissionStatus('blocked');
        setErrorMessage('Quyền vị trí đã bị chặn trong Cài đặt hệ thống.');
      } else {
        setPermissionStatus('denied');
        setErrorMessage('Bạn đã từ chối cấp quyền truy cập vị trí.');
      }
    } catch (err: any) {
      console.warn('Lỗi xin quyền vị trí:', err);
      // Fallback on simulator / web mock
      setPermissionStatus('denied');
      setErrorMessage(err?.message || 'Không thể truy cập dịch vụ vị trí.');
    }
  }, [updateLocationAndFee]);

  const mockCampusLocation = useCallback((customLat?: number, customLon?: number) => {
    // Default: vị trí cách KTX ~1.2 km (ví dụ Tòa nhà B hoặc Ký túc xá khu A)
    const lat = customLat ?? 10.8285;
    const lon = customLon ?? 106.6912;
    setPermissionStatus('granted');
    setErrorMessage(null);
    updateLocationAndFee(lat, lon, true);
  }, [updateLocationAndFee]);

  const openSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return {
    permissionStatus,
    currentLocation,
    distanceKm,
    shippingFee,
    isMock,
    errorMessage,
    requestPermission,
    mockCampusLocation,
    openSettings,
    campusGate: CAMPUS_GATE,
  };
}
