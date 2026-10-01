import React from 'react';
import { useAuthStore } from '@stores/authStore';
import { AuthStack } from '@navigation/AuthStack';
import { MainTabs } from '@navigation/MainTabs';

export const RootNavigator: React.FC = () => {
  const token = useAuthStore(state => state.token);

  return token ? <MainTabs /> : <AuthStack />;
};
