# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.4.3](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.4.2...@4bitlabs/sci0@2.4.3) (2024-04-09)

**Note:** Version bump only for package @4bitlabs/sci0

## [2.4.2](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.4.1...@4bitlabs/sci0@2.4.2) (2024-04-09)

**Note:** Version bump only for package @4bitlabs/sci0

## [2.4.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.4.0...@4bitlabs/sci0@2.4.1) (2024-04-09)

**Note:** Version bump only for package @4bitlabs/sci0

# [2.3.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.2.0...@4bitlabs/sci0@2.3.0) (2024-04-06)

### Chore

- updating README files ([095d19a](https://github.com/32bitkid/sci.js/commit/095d19af411d091c4315da129312e1d063bd2e39))

### Fixed

- handle fills on visual layers with white dithers. ([f1892e0](https://github.com/32bitkid/sci.js/commit/f1892e053a0c235af7e7f4a53639e29f0094807b))

### Internal

- Moved 4-bit color packing into setPixel ([8522afd](https://github.com/32bitkid/sci.js/commit/8522afdca9c3fd18331f103e65ddd85388d96f2c))

### New

- added alpha channel to PIC RenderResult. ([eb93ee9](https://github.com/32bitkid/sci.js/commit/eb93ee96438fb9a50423278cbc0a3ae2c9427b76))

# [2.2.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.1.1...@4bitlabs/sci0@2.2.0) (2024-04-05)

### Changed

- bounds is now record, rather than unkeyed tuple ([3859ffc](https://github.com/32bitkid/sci.js/commit/3859ffcda5c9b42ba4c8dfc0a9891205c03146e8))

### Chore

- enable no-shadow rule ([2ea836a](https://github.com/32bitkid/sci.js/commit/2ea836add49b0a30810a2241d400ca38e0b0b1ed))
- reformatting code ([2942981](https://github.com/32bitkid/sci.js/commit/29429811ee671073c78b54bd27873c4b9db4a781))
- rely on lerna/nx for build asset better caching ([ae1ae1e](https://github.com/32bitkid/sci.js/commit/ae1ae1eb4ead8e89a4d53ea0bcfcbc8e107b1488))

### Fixed

- Rendering control and priority layers now works as intended ([cdfaead](https://github.com/32bitkid/sci.js/commit/cdfaead13f4ca2835454ff8dc2a5e218d06e244a))
- resolve some rendering issues rendering control/priority layers. ([6825fb0](https://github.com/32bitkid/sci.js/commit/6825fb0020a2e5dc0314642d35f6b91a09ea41d1))

### New

- added view render command to scibud ([3f114fc](https://github.com/32bitkid/sci.js/commit/3f114fcaf66f524ef41ff0149ee9cb9a820f2508))

## [2.1.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.1.0...@4bitlabs/sci0@2.1.1) (2024-03-31)

### Fixed

- better error message when compression method is not supported. ([5e1c7f3](https://github.com/32bitkid/sci.js/commit/5e1c7f39c06d1ff250fde377e1cd82deabbb51a5))

# [2.1.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.0.2...@4bitlabs/sci0@2.1.0) (2024-03-27)

### Changed

- Loop calculates bounds on parse ([5f48037](https://github.com/32bitkid/sci.js/commit/5f480376ecf0f4460f6e60645f04e948d0a3c62d))

### New

- add loopRenderFilter() for processing loop cels into stable images ([0252bca](https://github.com/32bitkid/sci.js/commit/0252bcad27ff43d0450b18d5db4b2d6009bf472f))

## [2.0.2](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.0.1...@4bitlabs/sci0@2.0.2) (2024-03-25)

### Changed

- deprecate top-level Pic, View, Cursor, Font objects in sci0 ([82b2b0d](https://github.com/32bitkid/sci.js/commit/82b2b0dfe4e53dfa8ef13139a4f137401cdef90a))
- ViewGroup is now Loop; closer alignment with Sci0 engine ([33d62d9](https://github.com/32bitkid/sci.js/commit/33d62d936f051141c00dca7cf0f848a918ad1d25))

## [2.0.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.0.0...@4bitlabs/sci0@2.0.1) (2024-03-23)

### Update

- @4bitlabs/sci0 readme updated ([fe66b69](https://github.com/32bitkid/sci.js/commit/fe66b69651c2a7335c8995aab0d8d385a38df3c0))

## 2.0.0 (2024-03-23)

- Breaking: refactor image and render methods (#18) ([75ba7ed](https://github.com/32bitkid/sci.js/commit/75ba7ed)), closes [#18](https://github.com/32bitkid/sci.js/issues/18)

## <small>1.4.1 (2024-03-22)</small>

- Chore: update repo and bugs properties in package.json ([d426943](https://github.com/32bitkid/sci.js/commit/d426943))

## <small>1.2.1 (2024-03-14)</small>

- Chore: add "clean:wipe" script ([016a33f](https://github.com/32bitkid/sci.js/commit/016a33f))
- Chore: add a comment about weird content of XOP02 in CB demo source. ([f8f5962](https://github.com/32bitkid/sci.js/commit/f8f5962))
- removing debug logging ([e2dc6fc](https://github.com/32bitkid/sci.js/commit/e2dc6fc))
