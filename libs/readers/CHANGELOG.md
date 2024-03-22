# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## <small>2.0.3 (2024-03-22)</small>

- Chore: small tweak to reader CHANGELOG ([5ba6796](https://github.com/32bitkid/sci.js/commit/5ba6796))
- Chore: update repo and bugs properties in package.json ([d426943](https://github.com/32bitkid/sci.js/commit/d426943))

## <small>2.0.2 (2024-03-14)</small>

- Chore: add "clean:wipe" script ([016a33f](https://github.com/32bitkid/sci.js/commit/016a33f))

## <small>2.0.0</small>

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

## <small>1.2.0</small>

### Fixed

- Fixed bug in _least-significant_ byte ordering reads across byte-boundaries.

## <small>1.1.0</small>

### Changed

- Performance improvements to `BitReader`. Using single DWORD reads when possible.
- Loosen the `bytes` typescript type to be any _typed-array_ or `DataView`.

## <small>1.0.0</small>

Initial release.

### Added

- `BitReader` implementation.
- `AsyncBitReader` implementation.
