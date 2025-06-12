import HomePage from '@/components/pages/HomePage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: HomePage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '/404',
    component: NotFoundPage
  }
};

export const routeArray = Object.values(routes);