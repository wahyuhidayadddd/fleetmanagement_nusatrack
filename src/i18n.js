import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      login: "Log In",
      username: "Username",
      password: "Password",
      enableDarkMode: "Enable Dark Mode?",
      poweredBy: "Powered by NusaTekno",
      inputRequired: "Please fill in both username and password.",
      invalidUsername: "The username you entered is incorrect.",
      invalidPassword: "The password you entered is incorrect.",
      loginFailed: "Invalid username or password.",
      errorOccurred: "An unexpected error occurred. Please try again later.",
      pleaseLogin: "Please log in to your account",
    },
  },
  id: {
    translation: {
      welcome: "Selamat Datang",
      login: "Masuk",
      username: "Nama Pengguna",
      password: "Kata Sandi",
      enableDarkMode: "Aktifkan Mode Gelap?",
      poweredBy: "Dikembangkan oleh NusaTekno",
      inputRequired: "Silakan lengkapi nama pengguna dan kata sandi.",
      invalidUsername: "Nama pengguna yang Anda masukkan salah.",
      invalidPassword: "Kata sandi yang Anda masukkan salah.",
      loginFailed: "Nama pengguna atau kata sandi salah.",
      errorOccurred: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti.",
      pleaseLogin: "Silakan masuk ke akun Anda",
    },
  },
  ja: {
    translation: {
      welcome: "ようこそ",
      login: "ログイン",
      username: "ユーザー名",
      password: "パスワード",
      enableDarkMode: "ダークモードを有効にしますか？",
      poweredBy: "提供元: NusaTekno",
      inputRequired: "ユーザー名とパスワードの両方を入力してください。",
      invalidUsername: "入力されたユーザー名が正しくありません。",
      invalidPassword: "入力されたパスワードが正しくありません。",
      loginFailed: "無効なユーザー名またはパスワード。",
      errorOccurred: "予期しないエラーが発生しました。後でもう一度お試しください。",
      pleaseLogin: "アカウントにログインしてください",
    },
  },
  zh: {
    translation: {
      welcome: "欢迎",
      login: "登录",
      username: "用户名",
      password: "密码",
      enableDarkMode: "启用黑暗模式？",
      poweredBy: "由 NusaTekno 提供",
      inputRequired: "请填写用户名和密码。",
      invalidUsername: "您输入的用户名不正确。",
      invalidPassword: "您输入的密码不正确。",
      loginFailed: "无效的用户名或密码。",
      errorOccurred: "发生意外错误。请稍后再试。",
      pleaseLogin: "请登录您的账户",
    },
  },

};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
