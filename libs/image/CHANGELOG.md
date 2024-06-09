# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.10](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.3.9...@4bitlabs/image@3.3.10) (2024-06-09)

### Changed

- Remove magic symbol in IndexedPixelData ([4c7ae15](https://github.com/32bitkid/sci.js/commit/4c7ae152dfca085558c6e35406f50f43d8b51ac8))

## [3.3.9](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.3.8...@4bitlabs/image@3.3.9) (2024-05-28)

**Note:** Version bump only for package @4bitlabs/image

## [3.3.8](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.3.7...@4bitlabs/image@3.3.8) (2024-05-13)

**Note:** Version bump only for package @4bitlabs/image

## [3.3.7](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.3.6...@4bitlabs/image@3.3.7) (2024-05-08)

**Note:** Version bump only for package @4bitlabs/image

## [3.3.6](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.3.5...@4bitlabs/image@3.3.6) (2024-04-16)

### Chore

- Removing "size" badge. Not a very good metric/representation. ([a5fc9f8](https://github.com/32bitkid/sci.js/commit/a5fc9f8a9d65a64a8ce9330c620e359cf2b17ac7))

## [3.3.5](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.3.4...@4bitlabs/image@3.3.5) (2024-04-13)

**Note:** Version bump only for package @4bitlabs/image

## [3.3.4](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.3.3...@4bitlabs/image@3.3.4) (2024-04-09)

**Note:** Version bump only for package @4bitlabs/image

## [3.3.3](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.3.2...@4bitlabs/image@3.3.3) (2024-04-09)

**Note:** Version bump only for package @4bitlabs/image

## [3.3.2](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.3.1...@4bitlabs/image@3.3.2) (2024-04-09)

**Note:** Version bump only for package @4bitlabs/image

# [3.3.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.2.0...@4bitlabs/image@3.3.0) (2024-04-06)

### Chore

- updating README files ([095d19a](https://github.com/32bitkid/sci.js/commit/095d19af411d091c4315da129312e1d063bd2e39))

### Internal

- src is always 8-bit, no need to mask ([60adb22](https://github.com/32bitkid/sci.js/commit/60adb2234f2b127c5d8a184a616de012aa006348))

### New

- added alpha channel to PIC RenderResult. ([eb93ee9](https://github.com/32bitkid/sci.js/commit/eb93ee96438fb9a50423278cbc0a3ae2c9427b76))

# [3.2.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.1.1...@4bitlabs/image@3.2.0) (2024-04-05)

### Changed

- bounds is now record, rather than unkeyed tuple ([3859ffc](https://github.com/32bitkid/sci.js/commit/3859ffcda5c9b42ba4c8dfc0a9891205c03146e8))

### Chore

- clean up GenericFilter arguments ([8cf6448](https://github.com/32bitkid/sci.js/commit/8cf6448c67b2a2fb50117644fc13b0b2ff528ab8))
- cleaning up some unused imports ([ba23240](https://github.com/32bitkid/sci.js/commit/ba232401c61ff76189af5b9e35ca72593d008877))
- rely on lerna/nx for build asset better caching ([ae1ae1e](https://github.com/32bitkid/sci.js/commit/ae1ae1eb4ead8e89a4d53ea0bcfcbc8e107b1488))
- remove outdated TODO ([1eed762](https://github.com/32bitkid/sci.js/commit/1eed762a31460c7aabec4563c24144aa5c9eac19))

### New

- added view render command to scibud ([3f114fc](https://github.com/32bitkid/sci.js/commit/3f114fcaf66f524ef41ff0149ee9cb9a820f2508))
- adding explicit padImageFilter and padPixelFilter ([f1d15f5](https://github.com/32bitkid/sci.js/commit/f1d15f5e71cb5dc0dbaccbd5577008354a0ba353))

### Updated

- fill() can be used instead of pixel copy with subarray()/set() ([1dd077f](https://github.com/32bitkid/sci.js/commit/1dd077f392b87c47cdf83c8a3afe3e2a9d085d3a))
- make createIndexedPixelData keyColor initialization clearer ([640743c](https://github.com/32bitkid/sci.js/commit/640743c42c7a76e8d7a4f6d48ecc7e586e74da11))

## [3.1.1](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.1.0...@4bitlabs/image@3.1.1) (2024-03-31)

### Fixed

- resize-filters forward source keyColor for indexed pixel data ([794bf79](https://github.com/32bitkid/sci.js/commit/794bf79e98dc0644bf41c5be1ceb65b15ab6ff92))

### Updated

- small performance improvements ([8626e71](https://github.com/32bitkid/sci.js/commit/8626e710c44f4be25a31c882d43d11e9b3546895))

# [3.1.0](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.0.3...@4bitlabs/image@3.1.0) (2024-03-27)

### Changed

- Loop calculates bounds on parse ([5f48037](https://github.com/32bitkid/sci.js/commit/5f480376ecf0f4460f6e60645f04e948d0a3c62d))

### New

- add padFilter() for adding padding during render pipeline ([28d00f9](https://github.com/32bitkid/sci.js/commit/28d00f93d4fe3daca561baa6aac0d426497f3b7d))

## [3.0.3](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.0.2...@4bitlabs/image@3.0.3) (2024-03-25)

### Update

- clarify README files ([995d516](https://github.com/32bitkid/sci.js/commit/995d5161d2a84f1db9890e03c6c2a79d17dd4b1f))

## [3.0.2](https://github.com/32bitkid/sci.js/compare/@4bitlabs/image@3.0.0...@4bitlabs/image@3.0.2) (2024-03-23)

### Chore

- bump @4bitlabs/image ([628a7f5](https://github.com/32bitkid/sci.js/commit/628a7f54dcdcc40930604f0d1ae7383791920e74))

### Update

- @4bitlabs/image readme updated ([148070a](https://github.com/32bitkid/sci.js/commit/148070af15591ad57b26b18e7db2e05aa161dd34))

## 3.0.0 (2024-03-23)

- Breaking: refactor image and render methods (#18) ([75ba7ed](https://github.com/32bitkid/sci.js/commit/75ba7ed)), closes [#18](https://github.com/32bitkid/sci.js/issues/18)

## <small>2.2.4 (2024-03-22)</small>

- Chore: update repo and bugs properties in package.json ([d426943](https://github.com/32bitkid/sci.js/commit/d426943))

## <small>2.1.1 (2024-03-14)</small>

- Chore: add "clean:wipe" script ([016a33f](https://github.com/32bitkid/sci.js/commit/016a33f))
