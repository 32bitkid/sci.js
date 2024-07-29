# scibud [![License][license]][npm] [![NPM Version][version]][npm] <!-- [![NPM Downloads][dl]][npm] -->

[npm]: https://www.npmjs.com/package/@4bitlabs/scibud
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fscibud
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fscibud
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fscibud

`scibud` is a CLI utility to assist in inspecting and extracting assets form Sierra `SCI0` and `SCI01`-engine adventure games.

## Command-line usage

The easiest way to use `scibud` is to use `npx`:

```sh
$ npx @4bitlabs/scibud
```

`scibud` will attempt to locate `RESOURCE.*` files in your current working directory, if available. You can also use
`--root` option to local resources from another directory.

```sh
# list pics, using the current directory
$ npx @4bitlabs/scibud pic list

# list pics, using RESOURCE.* files in ~/path/to/game directory
$ npx @4bitlabs/scibud --root=~/path/to/game pic list
```

## Working with `PIC` resources

### Finding `PIC` resources

```sh
$ npx @4bitlabs/scibud pic list
```

### Getting details about `PIC` resources

```sh
$ npx @4bitlabs/scibud pic info 1
```

### Rendering `PIC` resources

```
Usage: scibud pic render [options] <num>

Render pic resource as image

Arguments:
  id                          picture resource number

Options:
  -l, --layer <layer>          (choices: "visible", "priority", "control", default: "visible")
  -S, --pre-scaler <scaler>   pre-dither pixel scaler (choices: "none", "2x2", "3x3", "4x4", "5x5", "5x6", "scale2x", "scale3x", "scale5x6", default: "none")
  -d, --dither <dither>       dither sizing. (default: "1x1")
  -p, --palette <pal>         the base palette (choices: "cga", "true-cga", "dga", default: "cga")
  -c, --contrast <value>      IBM 5153-style contrast knob. <value> should be between 0.0 and 1.0, or false (default: false)
  -m, --palette-mixer <pal>   palette mixing function (choices: "none", "10%", "15%", "25%", "soft", default: "none")
  -s, --post-scaler <scaler>  post-dither pixel scaler (choices: "none", "2x2", "3x3", "4x4", "5x5", "5x6", "scale2x", "scale3x", "scale5x6", default: "none")
  -b, --blur <method>         apply blur (choices: "none", "box", "hbox", "hblur", "gauss", default: "none")
  -a, --blur-amount <amount>  amount of pixels to blur (default: 1)
  -F, --force-pal <value>     Force  (choices: "0", "1", "2", "3")
  -f, --format <format>       image format. used when writing to STDOUT (choices: "png", "jpg", "webp", "raw", default: "png")
  -o, --output <string>       output filename, "-" for STDOUT
  -h, --help                  display help for command
```

For example:

```sh
# render PIC #1 to the default filename 'pic.001.png'
$ npx @4bitlabs/scibud pic render 1

# render PIC #1 as 'background.webp'
$ npx @4bitlabs/scibud pic render 1 -o background.webp

# render PIC #1 to STDOUT
$ npx @4bitlabs/scibud pic render 1 -o - | imgcat
```

## Working with `VIEW` resources

### Finding `VIEW` resources

```sh
$ npx @4bitlabs/scibud view list
```

### Getting details about `VIEW` resources

```sh
$ npx @4bitlabs/scibud view info 0
```

### Rendering `VIEW` resources

```
Usage: scibud view render [options] <num> <loop>

Arguments:
  num                     id to render
  loop                    loop to render

Options:
  -p, --palette <pal>     the base palette (choices: "cga", "true-cga", "dga", default: "cga")
  -c, --contrast <value>  IBM 5153-style contrast knob. <value> should be between 0.0 and 1.0, or false (default: false)
  -s --scaler <scaler>    pixel scaler (choices: "none", "2x2", "3x3", "4x4", "5x5", "5x6", "scale2x", "scale3x", "scale5x6", default: "none")
  --animated              render loop as animated gif (default: false)
  --padding <padding>     add extra padding around sprite (in pixels)
  -o, --output <string>   output filename, "-" for STDOUT
  -f, --format <format>   image format. used when writing to STDOUT (choices: "png", "jpg", "webp", "raw", default: "png")
  -h, --help              display help for command
```

```sh
# render VIEW #0, LOOP #0 to the default filename 'view.000-0.png'
$ npx @4bitlabs/scibud view render 0 0

# render VIEW #0, LOOP #1 as 'sprite-sheet.webp'
$ npx @4bitlabs/scibud view render 0 1 -o sprite-sheet.webp

# render VIEW #0, LOOP #2 to STDOUT
$ npx @4bitlabs/scibud view render 0 2 -o - | imgcat
```
