# `@4bitlabs/sci0`

Library for parsing and rendering assets from [Sierra On-line's][sierra] SCI-engine.

## Parse `RESOURCE.MAP` file

```ts
import { readFile } from 'fs/promises';
import { parseAllMappings } from "@4bitlabs/sci0";

const resourceMap = await readFile("path/to/RESOURCE.MAP");
const [mapping] = parseAllMappings(resourceMap);
```

## Working `ResourceMap` Entires

```ts
import { getResourceNumber, getResourceTypeStr } from '@4bitlabs/sci0';

// finding by type
const firstPic = mapping
  .find((it) => getResourceTypeStr(it.id) === 'Pic');

// ...or by specific resource number.
const num11 = mapping
  .find((it) => getResourceNumber(it.id) === 11);
```

## Getting the actual data

```ts
import { parseHeaderFrom, decompress } from "@4bitlabs/sci0"

// Get the resource file that contains this asset, and its offset where the header starts.
const { file, offset } = mapping
  .find((it) => getResourceTypeStr(it.id) === 'Pic');

const resource = await readFile(`path/to/RESOURCE.${file.toString().padStart(3, '0')}}`);

// Parse the asset header
const header = parseHeaderFrom(resFile.subarray(offset, offset + 8));
// Determine the payload length
const payloadLength = getPayloadLength(header);
// Snip out the bytes from the payload. 
const compressed = resFile.subarray(offset + 8, start + payloadLength);
// Decompress the asset data
const data = decompress('sci0', header.compression, compressed);
```

## `VIEW` Resource

Example:

_todo_

## `PIC` Resource

Example:

```ts
import { renderPic } from '@4bitlabs/sci0';
import { createDitherizer } from '@4bitlabs/image';

const picData = Pic.parseFrom(data);
const { visible, priority, control } = renderPic(picData);
```

## Supported Resource Types

| ID  | Type   | Read | Write |
|:---:|--------|:----:|:-----:|
| `0` | View   |  ✅   |   | 
| `1` | Pic    |  ✅   |   |
| `2` | Script |  ❌   |   |
| `3` | Text   |  ✅   |   |
| `4` | Sound  |  ❌   |   |
| `5` | Memory |  ❌   |   |
| `6` | Vocab  |  ❌   |   |
| `7` | Font   |  ✅   |   |
| `8` | Cursor |  ✅   |   |
| `9` | Patch  |  ❌   |   |

[sierra]: https://en.wikipedia.org/wiki/Sierra_Entertainment


