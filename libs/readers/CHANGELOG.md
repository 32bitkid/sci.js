# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## <small>2.0.2 (2024-03-14)</small>

- Chore: add "clean:wipe" script ([016a33f](https://github.com/32bitkid/sci.js/commit/016a33f))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.0.0

### Changed

- `BitReader` class has been replaced with an interface
- `createBitReader()` method now handles using the proper implementation based on configuration flags

### Added

- `fast` flag when creating a bit-reader. Uses an implementation that is slightly faster, at the cost of memory
  efficiency/duplication.

  ```ts
  import { createBitReader } from '@4bitlabs/readers';

  const br = createBitReader(data, { fast: true });
  ```

## 1.2.0

### Fixed

- Fixed bug in _least-significant_ byte ordering reads across byte-boundaries.

## 1.1.0

### Changed

- Performance improvements to `BitReader`. Using single DWORD reads when possible.
- Loosen the `bytes` typescript type to be any _typed-array_ or `DataView`.

## 1.0.0

Initial release.

### Added

- `BitReader` implementation.
- `AsyncBitReader` implementation.
