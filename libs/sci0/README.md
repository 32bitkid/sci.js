# @4bitlabs/sci0 [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

[npm]: https://www.npmjs.com/package/@4bitlabs/sci0
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fsci0
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fsci0
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fsci0

Library for decoding and parsing assets from [Sierra On-line's][sierra] [<abbr title="Sierra Creative Interpreter">SCI</abbr>-engine][sci0].

## Documentation

Full documentation for the library can be found [here][docs].

[docs]: https://32bitkid.github.io/sci.js/modules/_4bitlabs_sci0.html

## Supported SCI0 resource types

| Type   | Extract | Parse/Render | Write |
| ------ | :-----: | :----------: | :---: |
| View   |   ✅    |      ✅      |  ❌   |
| Pic    |   ✅    |      ✅      |  ❌   |
| Script |   ✅    |      ❌      |  ❌   |
| Text   |   ✅    |      ✅      |  ❌   |
| Sound  |   ✅    |      ❌      |  ❌   |
| Memory |   ✅    |      ❌      |  ❌   |
| Vocab  |   ✅    |      ❌      |  ❌   |
| Font   |   ✅    |      ✅      |  ❌   |
| Cursor |   ✅    |      ✅      |  ❌   |
| Patch  |   ✅    |      ❌      |  ❌   |

## Parse `RESOURCE.MAP` file

```ts
import { readFile } from 'fs/promises';
import { parseAllMappings } from '@4bitlabs/sci0';

const resourceMap = await readFile('path/to/RESOURCE.MAP');
const [mapping] = parseAllMappings(resourceMap);
```

## Working `ResourceMap` Entires

```ts
import { Resource } from '@4bitlabs/sci0';

// finding by type
const firstPic = mapping.find((it) => Resource.getTypeStr(it.id) === 'Pic');

// ...or by specific resource number.
const num11 = mapping.find((it) => Resource.getNumber(it.id) === 11);
```

## Getting the actual data

```ts
import { parseHeaderWithPayload, decompress } from '@4bitlabs/sci0';

// Get the resource file that contains this asset, and its offset where the header starts.
const { file, offset } = mapping.find(
  (it) => getResourceTypeStr(it.id) === 'Pic',
);

const resource = await readFile(
  `path/to/RESOURCE.${file.toString().padStart(3, '0')}}`,
);

// Parse the asset header and payload
const [header, compressed] = parseHeaderWithPayload(resource, offset);

// Decompress the asset data
const data = decompress('sci0', header.compression, compressed);
```

## `VIEW` Resource

Example:

_todo_

[sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment
[sci0]: http://sciwiki.sierrahelp.com/index.php/Sierra_Creative_Interpreter
