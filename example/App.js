import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

import Provider, { ScriptComponent } from '@cawfree/react-jsx-provider';

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

// XXX: This file contains a package.json-esque JSON which
//      defines the dependencies of the JSX wished to embed
//      within the application..
const request = require('./assets/json/package.json');

export default class App extends React.Component {
  constructor(nextProps) {
    super(nextProps);
    this.__renderFailure = this.__renderFailure.bind(this);
  }
  // XXX: This is the fallback render method for when a <ScriptComponent/>
  //      fails to have its dependency requirements met.
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
  // XXX: Define the runtime implementations for each library dependency
  //      that you wish to expose to a <ScriptComponent/>.
  __getRuntime() {
    return {
      ...require('./package.json'),
      "config": {
        "react-native": {
          // XXX: Try commenting out some of the dependencies!
          View,
          Text,
          Image,
        },
      },
    };
  }
  render() {
    // XXX: The Provider is used to define the runtime implementation context
    //      for all of the child <ScriptComponent/>s. Use this at the root of
    //      your application, or nest multiple instances to define child-specific
    //      runtime dependencies.
    //
    //      The "script" prop is used to select which JSX string to render within
    //      the ScriptComponent. This is defined as part of the request package.json.
    //
    //      Try changing it to the name of a script that doesn't exist!
    return (
      <Provider
        renderFailure={this.__renderFailure}
        request={request}
        runtime={this.__getRuntime()}
      >
        <View
          style={styles.container}
        >
          <ScriptComponent
            script="<Welcome/>"
          />
        </View>
      </Provider>
    );
  }
}
