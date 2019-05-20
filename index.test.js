const {
  satisfies,
  clean,
  minVersion,
  valid,
  parse,
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
});
