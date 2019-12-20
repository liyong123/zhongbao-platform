import Router from 'universal-router';
import get from 'lodash.get';
import { setRuntimeVariable } from './actions/runtime';
// import routes from './routes/index'; // production
import routes from './routes/index.dev'; // development
import { checkLogin } from './actions/login';
// 11
export default async () =>
  new Router(routes, {
    async resolveRoute(context, params) {
      setRuntimeVariable({
        name: 'route',
        value: context.route,
      });

      if (
        typeof context.route.load === 'function' ||
        context.route.loadMobile
      ) {
        if (context.route.needLogin) {
          let user = get(context, 'user');
          if (user) user = JSON.parse(user);
          const login = await checkLogin(context.token, get(user, 'id'))(
            context.store.dispatch,
            context.store.getState,
            {
              fetch: context.fetch,
            },
          );
          if (!login) {
            return {
              redirect: `/login?path=${encodeURIComponent(
                context.originalUrl,
              )}`,
            };
          }
        }
        return (context.isMobile && context.route.loadMobile
          ? context.route.loadMobile()
          : context.route.load()
        ).then(action => action.default(context, params));
      }
      if (typeof context.route.action === 'function') {
        return context.route.action(context, params);
      }
      return null;
    },
  });
