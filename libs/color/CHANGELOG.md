# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@2.1.5...@4bitlabs/color@3.0.0) (2024-07-30)

### Breaking

- consolidate all dithers into Dithers namespace. ([1251153](https://github.com/32bitkid/sci.js/commit/12511538589ff675a93ddea71b4f8dac3ee6c3e7))
- removing deprecated aliases. ([144ee3f](https://github.com/32bitkid/sci.js/commit/144ee3f7dd2754f75884864040a12688ab8ef7b3))

### Chore

- enable isolatedDeclarations ([b2b0a8f](https://github.com/32bitkid/sci.js/commit/b2b0a8fbcf7c01a7d56df657c5989cd61f80baf0))

### Docs

- adding documentation @4bitlabs/codecs ([2af3073](https://github.com/32bitkid/sci.js/commit/2af30739b37a8bf23d0ce9117264af1bb5979e94))
- adding documentation for @4bitlabs/color ([e28c94e](https://github.com/32bitkid/sci.js/commit/e28c94ef3969ab8534d55f4510fc7603a0c3a8b1))
- small tweak to dithers docs ([e3957ba](https://github.com/32bitkid/sci.js/commit/e3957ba6428838cba9cfde5ef6002125f98fb2cd))
- update readme documentation links ([7e0dd51](https://github.com/32bitkid/sci.js/commit/7e0dd51f78faf9f216b69c604484d7ead20b8176))

### New

- adding module exports for dithers and mixers ([efa4e1d](https://github.com/32bitkid/sci.js/commit/efa4e1d356a67736c962df390d983a3a75d20323))

## [2.1.5](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@2.1.4...@4bitlabs/color@2.1.5) (2024-06-16)

### Chore

- Cleaning up package.json repo links ([787872b](https://github.com/32bitkid/sci.js/commit/787872b5c232e9e14112ab3dfe09cde059987b75))

## [2.1.4](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@2.1.3...@4bitlabs/color@2.1.4) (2024-05-28)

### Chore

- Code-formatting ([e209540](https://github.com/32bitkid/sci.js/commit/e20954075368b2f53b8cfb7f17896f51bad47baa))

## [2.1.3](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@2.1.2...@4bitlabs/color@2.1.3) (2024-05-13)

### Chore

- Wrap void predicates in code-blocks ([3a35456](https://github.com/32bitkid/sci.js/commit/3a35456d383e1287e709f86e50b85f76b7bbbc13))

### Fixed

- renamed --dimmer to --contrast ([a08c73c](https://github.com/32bitkid/sci.js/commit/a08c73c4c6df4b501938190f94709196c4ddb738))

## [2.1.2](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@2.1.1...@4bitlabs/color@2.1.2) (2024-05-08)

### Fixed

- Increase the maximum contrast setting for IBM 5153 contrast knob ([a4b1082](https://github.com/32bitkid/sci.js/commit/a4b10827777d175383bf68ccf27908e686f72d55))

## [2.1.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@2.1.0...@4bitlabs/color@2.1.1) (2024-04-16)

### Chore

- Removing "size" badge. Not a very good metric/representation. ([a5fc9f8](https://github.com/32bitkid/sci.js/commit/a5fc9f8a9d65a64a8ce9330c620e359cf2b17ac7))

### Fixed

- Don't mutate source palette. ([d423735](https://github.com/32bitkid/sci.js/commit/d423735e0d223fc7e1b1fedf04972d3e1fb61d06))

# [2.1.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@2.0.3...@4bitlabs/color@2.1.0) (2024-04-13)

### New

- "linear-rgb" color mixing option for mixBy()/softMixer() ([8300d1c](https://github.com/32bitkid/sci.js/commit/8300d1cb3734786a71ebb5f6a07a91e1b94e387e))

## [2.0.3](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@2.0.2...@4bitlabs/color@2.0.3) (2024-04-09)

### Changed

- default identifier for CIELAB colors is now "CIELAB" ([46f258e](https://github.com/32bitkid/sci.js/commit/46f258e8fd326dfd17559223519a01f964e3d1d3))

## [2.0.2](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@2.0.1...@4bitlabs/color@2.0.2) (2024-04-09)

**Note:** Version bump only for package @4bitlabs/color

## [2.0.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@2.0.0...@4bitlabs/color@2.0.1) (2024-04-09)

### Fixed

- Added dependency to @4bitlabs/color-space ([1c6678b](https://github.com/32bitkid/sci.js/commit/1c6678b5f19212de52007c6c56b8557d2f083554))

## [1.2.2](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@1.2.1...@4bitlabs/color@1.2.2) (2024-04-05)

### Chore

- rely on lerna/nx for build asset better caching ([ae1ae1e](https://github.com/32bitkid/sci.js/commit/ae1ae1eb4ead8e89a4d53ea0bcfcbc8e107b1488))

## [1.2.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@1.2.0...@4bitlabs/color@1.2.1) (2024-03-25)

### Update

- clarify README files ([995d516](https://github.com/32bitkid/sci.js/commit/995d5161d2a84f1db9890e03c6c2a79d17dd4b1f))

# [1.2.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/color@1.1.3...@4bitlabs/color@1.2.0) (2024-03-23)

### New

- reorganizing @4bitlabs/color exports ([c55d881](https://github.com/32bitkid/sci.js/commit/c55d881bdcdf5588f85daa6b8ef6f862afe58802))

## <small>1.1.3 (2024-03-22)</small>

- Chore: remove outdated test ([f5f22ec](https://github.com/32bitkid/sci.js/commit/f5f22ec))
- Chore: update repo and bugs properties in package.json ([d426943](https://github.com/32bitkid/sci.js/commit/d426943))

## <small>1.1.1 (2024-03-14)</small>

- Chore: add "clean:wipe" script ([016a33f](https://github.com/32bitkid/sci.js/commit/016a33f))
