import { create } from 'zustand';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  identifier: string | null;
  login: (identifier: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  identifier: null,
  login: (identifier: string) => {
    const fakeToken = `ktxgo-${STUDENT.mssv}-${examStamp()}`;
    set({
      token: fakeToken,
      identifier,
    });
  },
  logout: () => {
    set({
      token: null,
      identifier: null,
    });
  },
}));
