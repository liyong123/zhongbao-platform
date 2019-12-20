import get from 'lodash.get';
import { readFile, writeFile, exists } from './lib/fs';

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (build) folder.
 */
const setRoute = (router, type, value) => {
  router = router.replace(
    new RegExp(`// import routes from '([^']*)'; // ${type}`),
    ($0, $1) => `import routes from '${$1}'; // ${type}`,
  );

  if (!value) {
    router = router.replace(
      new RegExp(`import routes from '([^']*)'; // ${type}`),
      ($0, $1) => `// import routes from '${$1}'; // ${type}`,
    );
  }
  return router;
};

async function route() {
  const args = process.argv.splice(2);
  let routeValue;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const matches = arg.match(/--route=(.*)/);
    if (matches) {
      routeValue = get(matches, '[1]', 'production');
      break;
    }
  }

  if (routeValue) {
    if (routeValue === 'dev') {
      const path = 'src/routes/index.dev.js';
      if (!await exists(path)) {
        const content = await readFile('tools/devTemplate.txt');
        await writeFile(path, content);
      } else {
        let content = await readFile(path);
        if (/- www\.react\w*\.com/.test(content)) {
          content = content.replace(/- www.react\w*.com/g, '');
          await writeFile(path, content);
        }
      }
    }
    const url = 'src/router.js';
    let router = await readFile(url);
    router = setRoute(router, 'production', routeValue === 'production');
    router = setRoute(router, 'dev', routeValue === 'dev');
    router = setRoute(router, 'api', routeValue === 'api');
    await writeFile(url, router);
  }
}

export default route;
