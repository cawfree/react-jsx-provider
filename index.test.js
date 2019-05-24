const {
  satisfies,
  clean,
  minVersion,
  valid,
  parse,
  coerce,
} = require('semver');

it('should determine version compatibility', function() {
  const v1 = '~0.59.1';
  const v2 = '^0.59.1';
  expect(
    satisfies(
      minVersion(v1),
      v2,
      true,
    )
  )
    .toBeTruthy();
  const v3 = '^1.2.3';
  const v4 = '1.x || >=2.5.0 || 5.0.0 - 7.2.3';
  expect(
    satisfies(
      coerce(v3),
      v4,
    ),
  ).toBeTruthy();
});
