import React from 'react';
import store from './store';
import RootApp from './container/screen config';
import {Provider} from 'react-redux';
const CafeApp = () => {
  return (
    <Provider store={store}>
      <RootApp />
    </Provider>
  );
};

export default CafeApp;
