import styled from 'styled-components';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Menu } from './layouts/Menu/Menu';
import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';
import { SuspenseLoader } from './suspense/SuspenseLoader';
import FontMedium from './fonts/font-medium.woff2';

const Home = lazy(() => import('./containers/Home/Home').then(module => ({ default: module.Home })));
const Login = lazy(() => import('./containers/Login/Login').then(module => ({ default: module.Login })));
const Logout = lazy(() => import('./containers/Logout/Logout').then(module => ({ default: module.Logout })));
const Protected = lazy(() => import('./containers/Protected/Protected').then(module => ({ default: module.Protected })));
const AdminProtected = lazy(() => import('./containers/Protected/AdminProtected').then(module => ({ default: module.AdminProtected })));
const Register = lazy(() => import('./containers/Register/Register').then(module => ({ default: module.Register })));
const Profile = lazy(() => import('./containers/Profile/Profile').then(module => ({ default: module.Profile })));
const ShowSpecific = lazy(() => import('./containers/Trash/ShowSpecific').then(module => ({ default: module.ShowSpecific })));
const ListTrash = lazy(() => import('./containers/Trash/List').then(module => ({ default: module.Trashs })));
const ShowManifestation = lazy(() => import('./containers/Manifestation/Show').then(module => ({ default: module.Manifestation })));
const ListManifestation = lazy(() => import('./containers/Manifestation/List').then(module => ({ default: module.Manifestations })));

const Dashboard = lazy(() => import('./containers/Admin/Dashboard').then(module => ({ default: module.Dashboard })));

const StyledApp = styled.div`
  margin-top: constant(safe-area-inset-top); // for ios 11.1
  margin-top: env(safe-area-inset-top); // for ios 11.2 and onwards
  margin-bottom: env(safe-area-inset-bottom);
  height: calc(100% - constant(safe-area-inset-top));
  height: calc(100% - env(safe-area-inset-top) - env(safe-area-inset-bottom));
`;


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'FontMedium',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'FontMedium';
          src: local('FontMedium'), local('FontMedium-Regular'), url(${FontMedium}) format('woff2');
        }
      `,
    },
  },
});

const adminTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: 'FontMedium',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'FontMedium';
          src: local('FontMedium'), local('FontMedium-Regular'), url(${FontMedium}) format('woff2');
        }
      `,
    },
  },
});


export function App() {
  return (
    <StyledApp>
      <SuspenseLoader>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Menu />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Protected><Profile/></Protected>} />
            <Route path="/posting" element={<Protected><ListTrash/></Protected>} />
            <Route path="/posting/:id" element={<Protected><ShowSpecific/></Protected>} />
            <Route path="/trash" element={<Protected><ListTrash/></Protected>} />
            <Route path="/manifestation" element={<Protected><ListManifestation/></Protected>} />
            <Route path="/manifestation/:id" element={<Protected><ShowManifestation/></Protected>} />
            <Route path="*" element={<div>404</div>} />

            <Route path="/dashboard" element={<AdminProtected><Dashboard/></AdminProtected>} />
          </Routes>
        </ThemeProvider>
      </SuspenseLoader>
    </StyledApp>
  );
}

export default App;
