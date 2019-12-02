import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import CafeApp from './src/CafeApp';
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];

AppRegistry.registerComponent(appName, () => CafeApp);
