import React from 'react';
import PropTypes from 'prop-types';
import JsxParser from 'react-jsx-parser';

const {
  valid,
  satisfies,
} = require('semver');

const DynamicJsx = React.createContext(null);

const uniteWithError = (components, resolutionErrors, error) => ({
  components,
  resolutionErrors: [
    ...resolutionErrors,
    error,
  ],
});

const extrapolate = (components, resolutionErrors, dependency, req = {}, pkg = {}) => {
  return Object.entries(((req.config || {})[dependency]) || {})
    .reduce(
      ({ components, resolutionErrors }, [Component, opts]) => {
        const impl = ((pkg.config || {})[dependency] || {})[Component];
        // TODO: Support refined options/props implementation.
        if (!!opts && !!impl) {
          return {
            components: {
              ...components,
              [Component]: impl,
            },
            resolutionErrors,
          };
        }
        return uniteWithError(
          components,
          resolutionErrors,
          new ReferenceError(
            `Failed to resolve a runtime implementation for "<${Component}/>".`,
          ),
        );
      },
      {
        components,
        resolutionErrors,
      },
    );
};

function unite(req = {}, pkg = {}) {
  const {
    dependencies,
    config,
    scripts,
  } = req;
  const { 
    components,
    resolutionErrors,
  } = Object.entries(dependencies || {})
    .reduce(
      ({ components, resolutionErrors }, [dependency, reqVersion]) => {
        if (valid(reqVersion)) {
          const pkgVersion = ((pkg.dependencies) || {})[dependency];
          if (valid(pkgVersion)) {
            if (satisfies(reqVersion, pkgVersion)) {
              const {
                components: extrapolatedComponents,
                resolutionErrors: extrapolatedResolutionErrors,
              } = extrapolate(components, resolutionErrors, dependency, req, pkg);
              return {
                components: {
                  ...components,
                  ...extrapolatedComponents,
                },
                resolutionErrors: [
                  ...resolutionErrors,
                  ...extrapolatedResolutionErrors,
                ],
              };
            }
          }
        }
        return uniteWithError(
          components,
          resolutionErrors,
          new SyntaxError(
            `Failed to instantiate "${dependency}" at request version "${reqVersion}".`,
          ),
        );
      },
      {
        resolutionErrors: [],
        components: {},
      },
    );
  return {
    components,
    resolutionErrors,
    scripts,
  };
}

export const Provider = ({ request, runtime, renderFailure, children, ...extraProps }) => (
  <DynamicJsx.Provider
    value={{
      ...unite(
        request,
        runtime,
      ),
      renderFailure,
    }}
  >
    {children}
  </DynamicJsx.Provider>
);

export const withDynamicJsx = Consumer => class ThemeConsumer extends React.Component {
  static contextType = DynamicJsx;
  render() {
    const {
      components,
      scripts,
      renderFailure,
      resolutionErrors,
    } = this.context;
    return (
      <Consumer
        components={components}
        scripts={scripts}
        resolutionErrors={resolutionErrors}
        renderFailure={renderFailure}
        {...this.props}
      />
    );
  }
};

export default withDynamicJsx(
  ({ script, components, renderFailure, resolutionErrors, scripts, ...extraProps }) => {
    const jsx = scripts[script];
    const resolvedErrors = [
      ...resolutionErrors,
      (!jsx) && new ReferenceError(
        `Failed to resolve script "${script}".`,
      ),
    ]
      .filter(e => !!e);
    if (resolvedErrors.length === 0) {
      return (
        <JsxParser
          components={components}
          renderInWrapper={false}
          jsx={jsx}
          {...extraProps}
        />
      );
    }
    if (renderFailure) {
      return renderFailure(
        resolvedErrors,
      );
    }
    return null;
  },
);
