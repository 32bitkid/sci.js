# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.2.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/scibud@1.1.6...@4bitlabs/scibud@1.2.0) (2024-05-08)

### Changed

- --dimmer replaces --contrast option ([e2a418d](https://github.com/32bitkid/sci.js/commit/e2a418d1d18a16a6cc2aeaa7d5d8e4f4aa05df8e))

### Chore

- Add 'ls' alias as 'list' ([4a5d789](https://github.com/32bitkid/sci.js/commit/4a5d78972c019ac75014f66987a25e40d18fde10))
- Represent the ffmpeg filter as a graph rather than string blob ([694f75d](https://github.com/32bitkid/sci.js/commit/694f75dcc821aecc1f6497c722fa9d261484dd2a))

### New

- Added options parameter to crtFilterGraph() ([f329aa4](https://github.com/32bitkid/sci.js/commit/f329aa47a98f201dfd53ae9f108b6deba3727a67))
- Added title area to video frame rendering. ([0ecd89e](https://github.com/32bitkid/sci.js/commit/0ecd89ed84cb6bf22371cc59324b4befb0788c2e))
- pic video command ([3d93337](https://github.com/32bitkid/sci.js/commit/3d933371b1de67e7f5e69d34b37ef19a07acb539))

## [1.1.6](https://github.com/32bitkid/sci.js/compare/@4bitlabs/scibud@1.1.5...@4bitlabs/scibud@1.1.6) (2024-04-16)

**Note:** Version bump only for package @4bitlabs/scibud

## [1.1.5](https://github.com/32bitkid/sci.js/compare/@4bitlabs/scibud@1.1.4...@4bitlabs/scibud@1.1.5) (2024-04-16)

### Chore

- Add LICENSE.txt for scibud ([9b045b4](https://github.com/32bitkid/sci.js/commit/9b045b45614553747e7b1562a55420215582071d))

## [1.1.4](https://github.com/32bitkid/sci.js/compare/@4bitlabs/scibud@1.1.3...@4bitlabs/scibud@1.1.4) (2024-04-13)

### Changed

- Set the default palette mixing mode to CIE-XYZ color-space ([b4c1f51](https://github.com/32bitkid/sci.js/commit/b4c1f51a89932751c2765b33d846f2f5d92dd7f8))

## [1.1.3](https://github.com/32bitkid/sci.js/compare/@4bitlabs/scibud@1.1.2...@4bitlabs/scibud@1.1.3) (2024-04-09)

**Note:** Version bump only for package @4bitlabs/scibud

## [1.1.2](https://github.com/32bitkid/sci.js/compare/@4bitlabs/scibud@1.1.1...@4bitlabs/scibud@1.1.2) (2024-04-09)

### Chore

- cleanup import/commented out code ([1eb7bd7](https://github.com/32bitkid/sci.js/commit/1eb7bd77e19d6f953660bedd854ee45071a548f3))

## [1.1.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/scibud@1.1.0...@4bitlabs/scibud@1.1.1) (2024-04-09)

**Note:** Version bump only for package @4bitlabs/scibud

## [1.0.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/scibud@1.0.0...@4bitlabs/scibud@1.0.1) (2024-04-06)

### Chore

- updating README files ([095d19a](https://github.com/32bitkid/sci.js/commit/095d19af411d091c4315da129312e1d063bd2e39))

### Fixed

- adding loop part to default outfile name ([f868089](https://github.com/32bitkid/sci.js/commit/f8680890c345d9cd43bc2f14948070b9b40388dd))

# 1.0.0 (2024-04-05)

### Added

- refactor scibud pic render command ([ad54bd7](https://github.com/32bitkid/sci.js/commit/ad54bd7abfc4560d4ebef4f7a6cc151951ae7d34))

### Breaking

- refactor image and render methods (#18) ([75ba7ed](https://github.com/32bitkid/sci.js/commit/75ba7ed56f5e01cd52f19b58792a4ac525bdce10)), closes [#18](https://github.com/32bitkid/sci.js/issues/18)

### Changed

- deprecate top-level Pic, View, Cursor, Font objects in sci0 ([82b2b0d](https://github.com/32bitkid/sci.js/commit/82b2b0dfe4e53dfa8ef13139a4f137401cdef90a))

### Chore

- add "clean:wipe" script ([016a33f](https://github.com/32bitkid/sci.js/commit/016a33ff30a32120df72031e9095684b54330f70))
- adding prebuild step to run tests ([43c703e](https://github.com/32bitkid/sci.js/commit/43c703e0ce11310ed3cfb98459facde36bd153c0))
- refactor scibud command structure ([4823be7](https://github.com/32bitkid/sci.js/commit/4823be7fb912992b6874322c9c98c43187f532aa))
- reformatting code ([2942981](https://github.com/32bitkid/sci.js/commit/29429811ee671073c78b54bd27873c4b9db4a781))
- rely on lerna/nx for build asset better caching ([ae1ae1e](https://github.com/32bitkid/sci.js/commit/ae1ae1eb4ead8e89a4d53ea0bcfcbc8e107b1488))
- remove CLI script from scibud ([62b5d69](https://github.com/32bitkid/sci.js/commit/62b5d69a084fb817ae3f0ea5456ff992cda87688))
- updated eslint import/order rules ([8a829ff](https://github.com/32bitkid/sci.js/commit/8a829ff835bffab874698d05e68767583427734f))

### Fix

- default pic layer ([853368a](https://github.com/32bitkid/sci.js/commit/853368ad7bcc27a089b43aa46e981fd616447092))

### Fixed

- display error when using --animated with another extension than gif ([59bdfb7](https://github.com/32bitkid/sci.js/commit/59bdfb7f996eaef64b4aa9b5d74710eea589c937))

### New

- add --decompress option for pic decode command ([f65b38d](https://github.com/32bitkid/sci.js/commit/f65b38d6bb097fd026258a1ad624ad5c8528f3ea))
- added render support for pic priority and control layers ([93287e4](https://github.com/32bitkid/sci.js/commit/93287e417c78150d332d3f8abb841ce6c7a74f68))
- added view render command to scibud ([3f114fc](https://github.com/32bitkid/sci.js/commit/3f114fcaf66f524ef41ff0149ee9cb9a820f2508))
- adding --engine option for selecting between sci0 and sci01 ([ad6087a](https://github.com/32bitkid/sci.js/commit/ad6087a32560471f4f5e5609a118ab3f842d6252))
- pic info display compression ration ([1021c9c](https://github.com/32bitkid/sci.js/commit/1021c9c7bf650ba172bffa189a4e5f52830bd5e9))
- reorganizing @4bitlabs/color exports ([c55d881](https://github.com/32bitkid/sci.js/commit/c55d881bdcdf5588f85daa6b8ef6f862afe58802))
- scibud view render command and list commands for all types ([a8318ca](https://github.com/32bitkid/sci.js/commit/a8318ca0f2a83b239be5ee5861a75c371a260c32))
- view info command for scibud ([5618015](https://github.com/32bitkid/sci.js/commit/5618015ff7ea083af091c098fcbf2eefe3ab151d))

### Publishing

- initial release ([d5e4d45](https://github.com/32bitkid/sci.js/commit/d5e4d453be22c9ce24a2fbc343e53a982dc6e1e9))

### update

- small tweaks to scibud ([66054c1](https://github.com/32bitkid/sci.js/commit/66054c17ff929a5c2bac4ed239156ddaeec20ce9))

### Update

- replace pngjs with sharp for more options in image progressing ([a5c8fad](https://github.com/32bitkid/sci.js/commit/a5c8fad1353a002e7bc7596b5d53f361ff762946))
