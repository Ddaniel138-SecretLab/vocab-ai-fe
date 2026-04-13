import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Inter } from 'next/font/google';

// 1. Khởi tạo font Inter từ Google Fonts thông qua Next.js
// Lưu ý: Thêm subset 'vietnamese' để không bị lỗi dấu tiếng Việt
export const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'], // Khai báo các độ dày chữ sẽ dùng
  display: 'swap',
});

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#6A4BFF',
      light: '#8E75FF',
      dark: '#4B34B2',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#737373',
    },
  },
  typography: {
    // 2. Gán trực tiếp fontFamily của Inter vào Material UI
    fontFamily: inter.style.fontFamily,
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
};

const theme = createTheme(themeOptions);

export default theme;