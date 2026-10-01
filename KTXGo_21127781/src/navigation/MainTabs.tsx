import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShopStack } from '@navigation/ShopStack';
import { CartScreen } from '@screens/CartScreen';
import { MeScreen } from '@screens/MeScreen';
import { useCartStore } from '@stores/cartStore';
import { VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export type MainTabsParamList = {
  ShopTab: undefined;
  CartTab: undefined;
  MeTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs: React.FC = () => {
  const totalQuantity = useCartStore(state => state.getTotalQuantity());

  const shopTabScreen = (
    <Tab.Screen
      key="ShopTab"
      name="ShopTab"
      component={ShopStack}
      options={{
        title: 'Cửa hàng',
        headerShown: false,
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🏪</Text>,
      }}
    />
  );

  const cartTabScreen = (
    <Tab.Screen
      key="CartTab"
      name="CartTab"
      component={CartScreen}
      options={{
        title: 'Giỏ hàng',
        headerShown: false,
        tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        tabBarBadgeStyle: {
          backgroundColor: COLORS.secondary,
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: '700',
        },
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🛒</Text>,
      }}
    />
  );

  const meTabScreen = (
    <Tab.Screen
      key="MeTab"
      name="MeTab"
      component={MeScreen}
      options={{
        title: 'Tôi',
        headerShown: false,
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>👤</Text>,
      }}
    />
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      {VARIANT.tabOrder === 'shopFirst' ? (
        <>
          {shopTabScreen}
          {cartTabScreen}
          {meTabScreen}
        </>
      ) : (
        <>
          {cartTabScreen}
          {shopTabScreen}
          {meTabScreen}
        </>
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});
