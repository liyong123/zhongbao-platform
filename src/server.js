import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import nodeFetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import { readFile } from 'fs';
import get from 'lodash.get';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';
import router from './router';
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import config from './config';

let dynamicConfig;
try {
  readFile('_version.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      dynamicConfig = JSON.parse(data);
    }
  });
} catch (err) {
  // nothing
}

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  // send entire app down. Process manager will restart it
  process.exit(1);
});

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

const app = express();

//
// If you are using proxy from external machine, you can set TRUST_PROXY env
// Default is to trust proxy headers only from loopback interface.
// -----------------------------------------------------------------------------
app.set('trust proxy', config.trustProxy);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, 'logs')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  }),
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    // get user-agent
    const ua = req.headers['user-agent'].toLowerCase();
    // check user-agent
    const isWX = /MicroMessenger/i.test(ua);
    const isIOS = /(iPhone|iPad|iPod|iOS)/i.test(ua);
    const isAndroid = /(android|nexus)/i.test(ua);
    const isWindows = /(Windows Phone|windows[\s+]phone)/i.test(ua);
    const isBlackBerry = /BlackBerry/i.test(ua);
    const isMobile = isWX || isIOS || isAndroid || isWindows || isBlackBerry;

    const css = new Set();

    // Enables critical path CSS rendering
    const insertCss = (...styles) => {
      styles.forEach(style => {
        // 解决后端渲染less样式问题
        if (
          style._getContent().toString.toString() ===
          'function toString() { [native code] }'
        ) {
          style._getContent().toString = function() {
            return this.map(item => item[1]).join('');
          };
        }
        return style._getCss && css.add(style._getCss());
      });
    };

    // Universal HTTP client
    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
    });

    const initialState = {
      user: req.user || null,
    };

    const store = configureStore(initialState, {
      cookie: req.headers.cookie,
      fetch,
      // I should not use `history` on server.. but how I do redirection? follow universal-router
    });

    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now(),
      }),
    );

    store.dispatch(
      setRuntimeVariable({
        name: 'isMobile',
        value: isMobile,
      }),
    );

    store.dispatch(
      setRuntimeVariable({
        name: 'version',
        value: get(dynamicConfig, 'version', 'NA'),
      }),
    );

    store.dispatch(
      setRuntimeVariable({
        name: 'config',
        value: {
          exitUrl: config.api.exitUrl,
          apiUrl: config.api.clientUrl,
          oldOpUrl: config.api.oldOpUrl,
        },
      }),
    );

    // Global (context) variables that can be easily accessed from any React component
    const context = {
      insertCss,
      fetch,
      // The twins below are wild, be careful!
      pathname: req.path,
      query: req.query,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
    };

    const router1 = await router();
    const route = await router1.resolve({
      ...context,
      path: req.path,
      originalUrl: req.originalUrl,
      query: req.query,
      // locale,
      token: req.cookies.token,
      user: req.cookies.user,
      res,
      req,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    store.dispatch(
      setRuntimeVariable({
        name: 'route',
        value: {
          path: req.path,
          query: req.query,
          title: route.title,
        },
      }),
    );

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      <App context={context}>{route.component}</App>,
    );
    data.styles = [{ id: 'css', cssText: [...css].join('') }];

    const scripts = new Set();
    const addChunk = chunk => {
      if (chunks[chunk]) {
        chunks[chunk].forEach(asset => scripts.add(asset));
      } else if (__DEV__) {
        throw new Error(`Chunk with name '${chunk}' cannot be found`);
      }
    };
    addChunk('client');
    if (route.chunk) addChunk(route.chunk);
    if (route.chunks) route.chunks.forEach(addChunk);

    data.scripts = Array.from(scripts);
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
    };
    data.isMobile = isMobile;

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
