# @cawfree/react-jsx-provider
A React `<Provider/>` used to reliably rendering dependency-aware JSX. Compatible with both `react` and `react-native`.

## 🤔 About
This library is built on top of the _awesome_ [`react-jsx-parser`](https://www.npmjs.com/package/react-jsx-parser), which is used to take a raw JSX string and render it as part of the React DOM, and adds a couple of utilities to enhance the _scalability_ and _portability_  of the JSX. This is done by defining a `package.json`-esque string which defines not only the content to render, but the necessary data dependencies of the runtime environment.

If all of the dependencies are met by the runtime, the JSX string can be injected and rendered within the DOM; otherwise, it falls back to a `renderFailure` method, which allows your app to continue as normal. Since it is backed by a [`React.createContext`](https://reactjs.org/docs/context.html) `<Provider/>`, these runtime dependencies can be referenced or overriden throughout the nested hierarchy.

## 🚀 Getting Started
Using [npm](https://www.npmjs.com/package/@cawfree/react-jsx-provider)
```
npm install --save @cawfree/react-jsx-provider
```
Using [yarn](https://www.npmjs.com/package/@cawfree/react-jsx-provider)
```
yarn add @cawfree/react-jsx-provider
```

## ✍️ Example
```javascript
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
            script="Welcome"
          />
        </View>
      </Provider>
    );
  }
}
```

Check out the [React Native](https://facebook.github.io/react-native/) app in the examples folder for more info.

## 🙏 Acknowledgements
[react-jsx-parser](https://www.npmjs.com/package/react-jsx-parser)

[semver](https://www.npmjs.com/package/semver)

## ✌️ License
[MIT](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="https://www.buymeacoffee.com/cawfree">
    <img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy @cawfree a coffee" width="232" height="50" />
  </a>
</p>
