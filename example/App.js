import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';

import ScriptComponent, { Provider } from './src';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  error: {
    flex: 1,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default class App extends React.Component {
  constructor(nextProps) {
    super(nextProps);
    this.__renderFailure = this.__renderFailure.bind(this);
  }
  __renderFailure(resolutionErrors) {
    return (
      <View
        style={styles.error}
      >
        <Text
          style={styles.errorText}
        >
          {'?'}
        </Text>
      </View>
    );
  }
  __getRuntime() {
    return {
      ...require('./package.json'),
      "config": {
        "react-native": {
          View,
          Text,
        },
      },
    };
  }
  render() {
    return (
      <Provider
        renderFailure={this.__renderFailure}
        request={require('./assets/json/package.json')}
        runtime={this.__getRuntime()}
      >
        <View
          style={styles.container}
        >
          <ScriptComponent
            script=""
          />
        </View>
      </Provider>
    );
  }
}
