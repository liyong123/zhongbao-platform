/* @flow */
import merge from 'lodash.merge';

type Fetch = (url: string, options: ?any) => Promise<any>;

type Options = {
  baseUrl: string,
  cookie?: string,
};

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
function createFetch(fetch: Fetch, { baseUrl, cookie }: Options) {
  // NOTE: Tweak the default options to suite your application needs
  const defaults = {
    method: 'POST',
    mode: 'cors', // baseUrl ? 'cors' : 'same-origin',
    credentials: 'include', // baseUrl ? 'include' : 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : null),
    },
  };

  return async (url: string, optionsp: any, req) => {
    if (process.env.BROWSER) {
      url = url.replace(/\{ *apiUrl *\}/, baseUrl);
    } else {
      // nothing
    }

    const options = merge(
      {},
      defaults,
      typeof optionsp === 'function' ? optionsp() : optionsp,
      req ? { headers: { Cookie: req.headers.cookie } } : {},
    );

    if (options.headers && options.headers['Content-Type'] == null) {
      delete options.headers['Content-Type'];
    }

    if (options.data) {
      options.body = options.data;
      delete options.data;
      if (options.method.toUpperCase() === 'GET') {
        const parameters = [];
        Object.keys(options.body).forEach(p => {
          if (options.body[p] !== undefined) {
            if (url.indexOf(`${p}=`) > -1) {
              url = url.replace(
                new RegExp(`([?&])${p}=[^?&]*`),
                ($0, $1) => `${$1}${p}=${encodeURIComponent(options.body[p])}`,
              );
            } else {
              parameters.push(`${p}=${encodeURIComponent(options.body[p])}`);
            }
          }
        });
        if (parameters.length) {
          url += url.indexOf('?') > -1 ? '&' : '?';
          url += parameters.join('&');
        }
        delete options.body;
      } else if (options.method.toUpperCase() === 'POST') {
        if (typeof options.body === 'object') {
          if (
            options.headers['Content-Type'] ===
            'application/x-www-form-urlencoded'
          ) {
            if (!options.body.append) {
              const ps = [];
              Object.keys(options.body).forEach(p => {
                ps.push(`${p}=${encodeURIComponent(options.body[p])}`);
              });
              if (ps.length > 0) {
                options.body = ps.join('&');
              } else {
                delete options.body;
              }
            }
          } else if (options.headers['Content-Type'] === 'application/json') {
            if (Object.keys(options.body).length > 0) {
              options.body = JSON.stringify(options.body);
            } else {
              delete options.body;
            }
          }
        }
      }
    }

    return fetch(url, options);

    /* return url.startsWith('/api')
      ? fetch(`${baseUrl}${url}`, {
          ...defaults,
          ...options,
          headers: {
            ...defaults.headers,
            ...(options && options.headers),
          },
        })
      : fetch(url, options); */
  };
}

export default createFetch;
