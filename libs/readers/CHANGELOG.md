# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.1.0

### Changed
- Performance improvements to `BitReader`. Using single DWORD reads when possible.
- Loosen the `bytes` typescript type to be any _typed-array_ or `DataView`.
- 

## 1.0.0

Initial release.

### Added

- `BitReader` implementation.
- `AsyncBitReader` implementation.
