# SCIOTF

A small utility to convert Sierra On-Line Adventure Game pixel fonts into OpenType fonts that your computer can use. 

## Basic Usage

The basic mapper will map the ASCII range of characters:

```shell
npx @4bitlabs/sciotf otf -r /path/to/sci/game 0
```

If the source files can be found, this will create file `sciAC-font-000.otf`, which you can install the 
normal ways that you install fonts on your operating system.

By default, it will scale the fonts to match the original aspect-ratio of the EGA video mode of the source, to get 
square-pixel versions use the `--apsect-ratio` argument.

```shell
npx @4bitlabs/sciotf otf -r /path/to/sci/game 0 --aspect-ratio 1:1
```

This will create `sciPX-font-000.otf` which ignores aspect-ratio correction, will map to display pixels with a when
anti-aliasing is off and where font-size of multiples of `16px`.

### Aspect Ratio Correction

The EGA modes that these fonts were originally displayed on did not have square 1&ratio;1 aspect-ratio pixels, instead had 
a display aspect-ratio of 1&ratio;1.2 (or the closest integer scaling of 5&ratio;6).  

- `sciAC` prefixed fonts are "aspect-ratio correct"
- `sciPX` prefixed fonts are "square-pixel fonts"


## How to know what fonts exist?

You can use `scibud` to list the available fonts.

```shell
npx @4bitlabs/scibud -r /path/to/sci/game font list
```

## Advanced Usage

To map characters outside of the "standard" ASCII range, you will want to use the `advanced` option. This will
let you map any character input to any unicode codepoint output. It also supports generating fonts from _multiple_ 
sources. Often, due to file-space limitations of the day, not every glyph was included in every packaged
release, or special glyphs were included for game specific assets.

For example `FONT.000` is almost _always_ found in Sierra releases. However, for Space Quest 3,
there were several glyphs that were _only_ included for it: a standard roman-numeral III and a
Space Quest specific one. You can use the `advanced` option to create a font that includes both:

```json
{
  "name": "FONT.000",
  "version": "1.0.0",
  "sources": [
    {
      "type": "source",
      "root": "/path/to/kq4sci-demo",
      "id": 0,
      "mappings": [
        "ascii",
        ["04", "00a9", "copyright sign"],
        ["05", "2122", "trademark symbol"],
        ["0a", "2163", "roman numeral four"],
        ["0b", "2642", "male symbol"],
        ["0c", "2640", "female symbol"],
        ["0d", "266a", "eighth note"],
        ["0e", "266c", "beamed 16th note"],

        ["10", "25b6", "black right-pointing triangle"],
        ["11", "25c2", "black left-pointing triangle"],
        ["1e", "25b2", "black left-pointing triangle"],
        ["1f", "25bc", "black left-pointing triangle"],

        ["18", "2191", "up-pointing arrow"],
        ["19", "2193", "down-pointing arrow"],
        ["1a", "2192", "right-pointing arrow"],
        ["1b", "2190", "left-pointing arrow"],
        ["12", "2195", "vertical-pointing arrow"],
        ["1d", "2194", "horizontal-pointing arrow"],
        ["16", "25ac", "black rectangle"],
        ["17", "21a8", "up down arrow with base"],

        ["01", "26f0", "mountain"],
        ["13", "203c", "double exclamation mark"],
        ["14", "00b6", "pilcrow sign"],
        ["15", "00a7", "section sign"],
        ["1c", "221f", "right angle"],
        ["0f", "263c", "solar symbol"],
        ["03", "2388", "helm symbol"],
        ["02", "2387", "alternative key symbol"],
        ["08", "232b", "erase to the left"],
        ["09", "2b7e", "horizontal tab key"]
      ]
    },
    {
      "type": "source",
      "root": "/path/to/sq3-demo",
      "id": 0,
      "mappings": [
        ["0c", "2162", "roman numeral three"],
        ["0b", "E000", "space quest three"]
      ]
    }
  ]
}
```

### Freely Available Sierra Fonts from Demo Releases

#### ```FONT.000```

- Codename: ICEMAN Demo
- Colonel's Bequest Demo
- Conquests of Camelot Demo
- King's Quest 1 (1990) Demo
- King's Quest IV SCI Demo
- Leisure Suit Larry II Demo
- Leisure Suit Larry III Demo
- Police Quest II Demo
- Quest for Glory I Demo
- Quest for Glory II Demo

##### Alternates

Space Quest 3 Demo includes an alternate version of `FONT.000`. This version excludes &#x2642; and 
&#x2640; symbols from FONT.000 and replaces them with two &#x2162; symbols. Also changes some spacing.

#### ```FONT.001```

- Codename: ICEMAN Demo
- Colonel's Bequest Demo
- Conquests of Camelot Demo
- King's Quest IV SCI Demo
- Leisure Suit Larry II Demo
- Leisure Suit Larry III Demo
- Police Quest II Demo
- Quest for Glory I Demo
- Quest for Glory II Demo
- Space Quest III Demo

#### `FONT.002`

- King's Quest IV SCI Demo

#### `FONT.003`

- King's Quest IV SCI Demo
- Space Quest III Demo

#### `FONT.004`

- Colonel's Bequest Demo
- King's Quest 1 (1990) Demo
- King's Quest IV SCI Demo
- Leisure Suit Larry II Demo
- Leisure Suit Larry III Demo
- Police Quest II Demo
- Quest for Glory II Demo
- Space Quest III Demo

#### `FONT.007`

- King's Quest IV SCI Demo
- Police Quest II Demo

#### `FONT.008`

- Colonel's Bequest Demo
- King's Quest IV SCI Demo
- Quest for Glory I Demo

#### `FONT.009`

- Leisure Suit Larry III Demo

#### `FONT.040`

- Colonel's Bequest Demo

#### `FONT.041`

- Colonel's Bequest Demo

#### `FONT.100`

- King's Quest IV SCI Demo

Codename: ICEMAN Demo also includes a `FONT.100` but it doesn't look like the one from KQ4. It only includes 
upper-case characters, and looks like a worse version of `FONT.600` from the Space Quest 3 Demo. Use that instead. 

#### `FONT.101`

- King's Quest IV SCI Demo

#### `FONT.200`

- Space Quest III Demo

#### `FONT.300`

- King's Quest 1 (1990) Demo
- Space Quest III Demo

#### `FONT.600`

- Space Quest III Demo

#### `FONT.601`

0 Space Quest III Demo

#### `FONT.999`

- Codename: ICEMAN Demo
- Conquests of Camelot Demo
- King's Quest 1 (1990) Demo
- King's Quest IV SCI Demo
- Leisure Suit Larry II Demo
- Leisure Suit Larry III Demo
- Police Quest II Demo
- Quest for Glory I Demo
- Quest for Glory II Demo
- Space Quest III Demo
