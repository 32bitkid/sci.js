# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@5.0.0...@4bitlabs/sci0@5.0.1) (2024-07-30)

### Fix

- removing anomalous stderr write ([ca3d813](https://github.com/32bitkid/sci.js/commit/ca3d813e44adf6fc8713233cf71abd233e6ef3f7))

# [5.0.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@4.0.1...@4bitlabs/sci0@5.0.0) (2024-07-30)

### Breaking

- Attach DrawMode predicates to DrawMode namespace ([4e72e1c](https://github.com/32bitkid/sci.js/commit/4e72e1c10ef7963747ff7481d09d7ed2fd99eb98))
- consolidate all dithers into Dithers namespace. ([1251153](https://github.com/32bitkid/sci.js/commit/12511538589ff675a93ddea71b4f8dac3ee6c3e7))
- Move DrawCommands into Namespace ([8592ac0](https://github.com/32bitkid/sci.js/commit/8592ac0f1e823015e34773119e688fa6c0ea1240))
- move resource-id getters to Resource namespace ([317e425](https://github.com/32bitkid/sci.js/commit/317e425b65e2bc7cfb08aec6120f2a86d4bf1882))
- remove deprecated aliases ([86de09c](https://github.com/32bitkid/sci.js/commit/86de09c0aca5506e68c42d1d9f9766b9400085ee))
- Remove getPayloadLength helper in favor of parseHeaderWithPayload ([47bf809](https://github.com/32bitkid/sci.js/commit/47bf8099fbe09ad86be751ec361e383bbef5247b))
- Remove resource predicates ([d328996](https://github.com/32bitkid/sci.js/commit/d3289960a9b978ae6eeb163746e5f90b768d018b))
- renaming sci0-filters to sci0-renderer ([801d168](https://github.com/32bitkid/sci.js/commit/801d1685e8bd2e63bb1b32910f6e3138be22b8f6))
- simplify parseAllMappings and don't export consume ([11c161d](https://github.com/32bitkid/sci.js/commit/11c161d75d46422840d1d1339c0e7fad6ee59289))

### Changed

- interals refactor draw-commands ([426f80d](https://github.com/32bitkid/sci.js/commit/426f80d44bbfb0756b5dc4e227657e6bac0c6848))
- mark other DrawMode values as hidden ([fcdb7be](https://github.com/32bitkid/sci.js/commit/fcdb7be84faee04be0f8e5bdb35e78ebffa05881))
- match variable name to other parsers ([51f62ef](https://github.com/32bitkid/sci.js/commit/51f62efe6ee9698cac2f6d1b7734ac18ce5aa1b7))
- refactor ResourceTypes ([cbada7b](https://github.com/32bitkid/sci.js/commit/cbada7b4c52f2c7d5fcc0bca157d8de2c54edd35))
- simplify top-level import/exports ([73e09c9](https://github.com/32bitkid/sci.js/commit/73e09c9bbc0503076f4f8023da67e79b784fdb7b))

### Chore

- cleanup 4bitlabs package imports ([2c6f3d6](https://github.com/32bitkid/sci.js/commit/2c6f3d60ef70e5f849a52d93acd76bcda29e7dbe))
- enable isolatedDeclarations ([0111b3e](https://github.com/32bitkid/sci.js/commit/0111b3e36c6b6a2f6c4ed6d1a44a13a9b32e55f8))
- fixed tests ([c33fe67](https://github.com/32bitkid/sci.js/commit/c33fe67c3fe751a1acbdc92b5b434611f070583a))

### Docs

- add documentation to decompress ([a21027c](https://github.com/32bitkid/sci.js/commit/a21027cca8fc789fb2b78ead1048c44ffd69f916))
- adding docs for sci0 ([83d4c53](https://github.com/32bitkid/sci.js/commit/83d4c530fc2d89c5bf272c920ea05fdd064ac819))
- adding the remaining library packages. ([46b4445](https://github.com/32bitkid/sci.js/commit/46b444506659e4837e535d01cc8dbda056d6b58b))
- updating README.md ([092f3c7](https://github.com/32bitkid/sci.js/commit/092f3c722a4b0ea04de0d0b4aad05acfdd511381))

### New

- Creat sci0-filters package to home sci0 specific image processing filters ([6990987](https://github.com/32bitkid/sci.js/commit/699098752c89c1d608fc920316f835f383c5e3df))

### Update

- interal updates for vec2 ([34ddf1d](https://github.com/32bitkid/sci.js/commit/34ddf1d9b4ebbe7bfbac453b7f810dcddbd53ab8))

## [4.0.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@4.0.0...@4bitlabs/sci0@4.0.1) (2024-07-04)

### Fixed

- renderPic always returns a result, even if commands is empty ([0af8b75](https://github.com/32bitkid/sci.js/commit/0af8b75161d62e0c587744a146ec25c99c6fea5b))

# [4.0.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@3.1.3...@4bitlabs/sci0@4.0.0) (2024-07-03)

### Breaking

- Introducing generatePic generator to iterate on intermediary pic resources ([22b6229](https://github.com/32bitkid/sci.js/commit/22b6229b7519c4341ac0b24c721569dfc157a159))

## [3.1.3](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@3.1.2...@4bitlabs/sci0@3.1.3) (2024-06-16)

### Fixed

- unit tests for flood-fill edge case ([a20780e](https://github.com/32bitkid/sci.js/commit/a20780e572e742da76ff80e4c9bd14cd556700e2))

## [3.1.2](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@3.1.1...@4bitlabs/sci0@3.1.2) (2024-06-16)

### Chore

- Cleaning up package.json repo links ([787872b](https://github.com/32bitkid/sci.js/commit/787872b5c232e9e14112ab3dfe09cde059987b75))

### Fixed

- Dither ordering was incorrect when checking flood-fills ([930b14d](https://github.com/32bitkid/sci.js/commit/930b14d850fdeaadb5da19861d78c0fc98e2c2d6))

## [3.1.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@3.1.0...@4bitlabs/sci0@3.1.1) (2024-06-09)

### Chore

- Fixing render-pic unit-tests ([63ef3ee](https://github.com/32bitkid/sci.js/commit/63ef3eeb415ef8510ca21e564e175e3770e7d8b5))

# [3.1.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@3.0.1...@4bitlabs/sci0@3.1.0) (2024-06-04)

### Changed

- export the RenderResult interface ([9c6e2e8](https://github.com/32bitkid/sci.js/commit/9c6e2e8b768fdaaccd970b52e216721789af2bfa))
- fill in permutations of DrawMode ([8c5ba22](https://github.com/32bitkid/sci.js/commit/8c5ba2206ee3a8d7744f4bdd164f91bf47cdf760))

### New

- Create onAfterStep() hook to inspect that buffers between steps ([5308974](https://github.com/32bitkid/sci.js/commit/5308974412cc1b4fb98f812cdd0ec6ae5534a9fe))
- tBuffer to render result, maps pixels to the command responsible ([f1254b9](https://github.com/32bitkid/sci.js/commit/f1254b9a4d98b4468334b147fb484c28eb62eea2))

## [3.0.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@3.0.0...@4bitlabs/sci0@3.0.1) (2024-05-30)

**Note:** Version bump only for package @4bitlabs/sci0

# [3.0.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.7.0...@4bitlabs/sci0@3.0.0) (2024-05-30)

### Breaking

- Changed structure of internal draw-command representation ([cc85c5d](https://github.com/32bitkid/sci.js/commit/cc85c5d7cbd3042502b8843a13460b7dd2107e16))

# [2.7.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.6.0...@4bitlabs/sci0@2.7.0) (2024-05-30)

### New

- exporting drawMode predicates ([b50abce](https://github.com/32bitkid/sci.js/commit/b50abceb5551237e1d5bec49eb6f77eb17f5f169))

### Upgrade

- Use @4bitlabs/vec2 ([13b1ecb](https://github.com/32bitkid/sci.js/commit/13b1ecb17d4bb277b53780892893e6dcd18116d7))

# [2.6.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.5.1...@4bitlabs/sci0@2.6.0) (2024-05-28)

### Changed

- SET_PALETTE draw command now serializes as an array. ([684a01d](https://github.com/32bitkid/sci.js/commit/684a01d4bd9c95e35e1a3713c4829ff2d677a662))

### Chore

- Adjust internal CodeHandlerContext to only support adding commands via push ([803d7ba](https://github.com/32bitkid/sci.js/commit/803d7babfb3e416fb395b9016b220574202fc997))
- Code-formatting ([e209540](https://github.com/32bitkid/sci.js/commit/e20954075368b2f53b8cfb7f17896f51bad47baa))
- remove internal StaticVec2 in favor of method args with Readonly ([bbafffb](https://github.com/32bitkid/sci.js/commit/bbafffb6c6197cd3a4c362f83db9fff8177dfe4f))

### Fixed

- Clip plot to screen-space. ([0e21974](https://github.com/32bitkid/sci.js/commit/0e219749112bc2a0a4e040562c8f7695adb15c88))

### New

- renerPic() now allows alternative base canvas sizes. ([2a496a0](https://github.com/32bitkid/sci.js/commit/2a496a0b7a2c1a19ada0b16193cbb98d17b6f5b6))

## [2.5.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.5.0...@4bitlabs/sci0@2.5.1) (2024-05-13)

### Chore

- Better type-safe DrawMode flag checking. ([6c202d9](https://github.com/32bitkid/sci.js/commit/6c202d94450446b15d74ee1098cc58e554706e5e))
- Ensure numbers are properly stringified before emitting ([3a007ad](https://github.com/32bitkid/sci.js/commit/3a007ad7a200d9b2c11fa50b7287ecf28a81f7b4))
- Update eslint to strict typescript checking ([7d26412](https://github.com/32bitkid/sci.js/commit/7d264129a014322df1b0e126c149d3a0ee262625))
- Use exhaustive helper ([d9091bc](https://github.com/32bitkid/sci.js/commit/d9091bcc886305db538776150adb646801ab66f2))
- Wrap void predicates in code-blocks ([3a35456](https://github.com/32bitkid/sci.js/commit/3a35456d383e1287e709f86e50b85f76b7bbbc13))

# [2.5.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.4.6...@4bitlabs/sci0@2.5.0) (2024-05-08)

### New

- Added FontFace type export to sci0 ([24f2ab0](https://github.com/32bitkid/sci.js/commit/24f2ab066c1f39dc5bbb7d730bc534850eaddaa7))
- adding support for sci01 compression-type "2" ([2011422](https://github.com/32bitkid/sci.js/commit/20114220677673b3a675555a0cb0b0b558623585))

## [2.4.6](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.4.5...@4bitlabs/sci0@2.4.6) (2024-04-16)

### Chore

- Removing "size" badge. Not a very good metric/representation. ([a5fc9f8](https://github.com/32bitkid/sci.js/commit/a5fc9f8a9d65a64a8ce9330c620e359cf2b17ac7))

### Fixed

- Resolved unintended flood-fill escape. ([0d945df](https://github.com/32bitkid/sci.js/commit/0d945df41296edff0d2b39925cf64b5b2484e115))

## [2.4.5](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.4.4...@4bitlabs/sci0@2.4.5) (2024-04-16)

### Chore

- Added a more complex flood-fill test to verify behavior ([83d7ea6](https://github.com/32bitkid/sci.js/commit/83d7ea678fe4859ef3773e8cdaf88ae0e648e605))
- Refactor screen tools and testing. ([140ec2e](https://github.com/32bitkid/sci.js/commit/140ec2e68a0cbc8485e3aeae8a629f140866d65a))

### Fixed

- Flood-fill tweaks and tests ([390b009](https://github.com/32bitkid/sci.js/commit/390b0091012ab3301e97fae293cc3e6047419b82))
- Resolved palette updates ([582e526](https://github.com/32bitkid/sci.js/commit/582e52686d7e645ccb89a66fef60e619bf61fc3a))

### Perf

- More performance improvements to flood-fill algorithm ([4c06126](https://github.com/32bitkid/sci.js/commit/4c06126ac7c7218ac4c54163e018d16191817c8d))
- Slight improvement of flood-fill algorithm ([ea34102](https://github.com/32bitkid/sci.js/commit/ea3410251becb6efa381892613214ffcbaa67b0d))

## [2.4.4](https://github.com/32bitkid/sci.js/compare/@4bitlabs/sci0@2.4.3...@4bitlabs/sci0@2.4.4) (2024-04-13)

**Note:** Version bump only for package @4bitlabs/sci0

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
