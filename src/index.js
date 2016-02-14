import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import AppMain from './containers/AppMain';
import configureStore from './store/configureStore';
import './styles/styles.scss'; //Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
import injectTapEventPlugin from 'react-tap-event-plugin';

const store = configureStore();
injectTapEventPlugin();

render(
  <Provider store={store}>
    <AppMain />
  </Provider>, document.getElementById('app')
);
