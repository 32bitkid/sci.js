# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color-space@1.2.3...@4bitlabs/color-space@2.0.0) (2024-07-30)

### Breaking

- removing fromUint24. Replaced with options to fromUint32 ([656a5bb](https://github.com/32bitkid/sci.js/commit/656a5bbe7a789f15d8ffbbb1ff91280cc3f97080))

### Changed

- toUint32 also supports big-endian encoding. ([3b2757f](https://github.com/32bitkid/sci.js/commit/3b2757f624d791f487d3ad899aa00099c5b17a15))

### Chore

- enable isolatedDeclarations ([74a172d](https://github.com/32bitkid/sci.js/commit/74a172decd614b7d0f46a82b5f7de651a7ca4ec5))
- restructuring `@4bitlabs/color-space` internals ([c23ba51](https://github.com/32bitkid/sci.js/commit/c23ba519f16fd7f89487a57902226637e5be5776))

### Docs

- adding docs for vec2 and color-space modules ([7257357](https://github.com/32bitkid/sci.js/commit/725735778032c1ac41275ce16a6ad3592b4e7a07))
- adding documentation for @4bitlabs/color ([e28c94e](https://github.com/32bitkid/sci.js/commit/e28c94ef3969ab8534d55f4510fc7603a0c3a8b1))
- update readme documentation links ([7e0dd51](https://github.com/32bitkid/sci.js/commit/7e0dd51f78faf9f216b69c604484d7ead20b8176))

## [1.2.3](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color-space@1.2.2...@4bitlabs/color-space@1.2.3) (2024-06-16)

### Chore

- Cleaning up package.json repo links ([787872b](https://github.com/32bitkid/sci.js/commit/787872b5c232e9e14112ab3dfe09cde059987b75))

## [1.2.2](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color-space@1.2.1...@4bitlabs/color-space@1.2.2) (2024-05-13)

### Chore

- Removing "size" badge. Not a very good metric/representation. ([a5fc9f8](https://github.com/32bitkid/sci.js/commit/a5fc9f8a9d65a64a8ce9330c620e359cf2b17ac7))
- Safer array deconstruction ([d80494c](https://github.com/32bitkid/sci.js/commit/d80494cf9d2a842d7a6b6a71b42f530fe193b532))

## [1.2.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color-space@1.2.0...@4bitlabs/color-space@1.2.1) (2024-04-13)

### Fixed

- adjusting D65 white-point ([db2f2d0](https://github.com/32bitkid/sci.js/commit/db2f2d0e08d5e5dd33b60eb9d813ec91eb5ba078))
- lab color-space conversions are now done from xyz-D50 (not D65) ([a411fc1](https://github.com/32bitkid/sci.js/commit/a411fc16866b84af0459c1ce73375e9a441390cb))

# [1.2.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color-space@1.1.0...@4bitlabs/color-space@1.2.0) (2024-04-09)

### Changed

- default identifier for CIELAB colors is now "CIELAB" ([46f258e](https://github.com/32bitkid/sci.js/commit/46f258e8fd326dfd17559223519a01f964e3d1d3))

### Chore

- added unit test coverage for isSRGBTuple() ([7a93813](https://github.com/32bitkid/sci.js/commit/7a938139687f83efeefcee1037207a97c05a94d1))
- readme improvements ([804a4c6](https://github.com/32bitkid/sci.js/commit/804a4c6b701342f594e78b5e492f390b1bd058ff))

### Fixed

- mixed up toString() implementation for sRGB and linear-RGB ([3757131](https://github.com/32bitkid/sci.js/commit/37571319658eb1f112a173a7c82d827b3e1fc4a3))
- re-exported missing mix function ([0e2b54b](https://github.com/32bitkid/sci.js/commit/0e2b54b4a3f025de9fdaf1420f5ba76f112e45a6))

### New

- make linear-rgb available as named export ([5de06f5](https://github.com/32bitkid/sci.js/commit/5de06f550e7a2017449ccb5b39b10e79c93ed42a))
- type predicates to verify/check for supported color tuples ([9315eb8](https://github.com/32bitkid/sci.js/commit/9315eb8a4b7f2ae2120d1da470a42af7fcc17bf3))

# [1.1.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color-space@1.0.0...@4bitlabs/color-space@1.1.0) (2024-04-09)

### Chore

- removing faux test case ([1133342](https://github.com/32bitkid/sci.js/commit/113334279132a3c549ec4fbc5301d629d14aba21))

### New

- linear-RGB color-space ([fbfa5c9](https://github.com/32bitkid/sci.js/commit/fbfa5c920ad4b41b177b023f6e2165582f1e5466))
