import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { Provider as ReduxProvider } from 'react-redux';
import { setRuntimeVariable } from '../actions/runtime';

const ContextType = {
  // Enables critical path CSS rendering
  insertCss: PropTypes.func.isRequired,
  // Universal HTTP client
  fetch: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  query: PropTypes.object,
  // client size
  scrollWidth: PropTypes.number,
  scrollHeight: PropTypes.number,
  // Integrate Redux
  ...ReduxProvider.childContextTypes,
};

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends React.PureComponent {
  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  };

  static childContextTypes = ContextType;

  getChildContext() {
    return this.props.context;
  }
  componentDidMount() {
    window.addEventListener(
      'resize',
      throttle(() => {
        global.store.dispatch(
          setRuntimeVariable({
            name: 'browserMsg',
            value: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
          }),
        );
      }, 300),
    );
  }
  render() {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return React.Children.only(this.props.children);
  }
}

export default App;
