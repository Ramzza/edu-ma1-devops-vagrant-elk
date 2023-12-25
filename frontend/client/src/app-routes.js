import { withNavigationWatcher } from './contexts/navigation';
import {
	HomePage,
	TasksPage,
	ProfilePage,
	CalendarPage,
	AboutPage,
} from './pages';

const routes = [
	{
		path: '/tasks',
		component: TasksPage,
	},
	{
		path: '/profile',
		component: ProfilePage,
	},
	{
		path: '/home',
		component: HomePage,
	},
	{
		path: '/calendar',
		component: CalendarPage,
	},
	{
		path: '/about',
		component: AboutPage,
	},
];

export default routes.map((route) => {
	return {
		...route,
		component: withNavigationWatcher(route.component),
	};
});
