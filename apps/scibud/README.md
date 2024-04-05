# `scibud`: Your Handy <abbr title="Sierra Creative Interpreter">`SCI`</abbr> Buddy

`scibud` is a CLI utility to assist in inspecting and extracting assets form Sierra `SCI0` and `SCI01`-engine adventure games.

## Usage

[Work in progress]

## Working with `Pic` Resources

### Finding `Pic` Resources

```
$ npx @4bitlabs/scibud --root=~/path/to/game pic list
```

### Getting Details About `Pic` Resources

```
$ npx @4bitlabs/scibud --root=~/path/to/game pic info <num>
```

### Rendering `PIC` Resources

```
Usage: scibud pic render [options] <id>

render pic resource as image

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

```
$ npx @4bitlabs/scibud --root=/path/to/game pic render 15
```

## Working with `VIEW` Resources

### Finding `VIEW` Resources

```
$ npx @4bitlabs/scibud --root=~/path/to/game view list
```

### Getting Details About `VIEW` Resources

```
$ npx @4bitlabs/scibud --root=~/path/to/game view info <num>
```

### Rendering `VIEW` Resources

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

```
$ npx @4bitlabs/scibud --root=~/path/to/game view render 0 0
```
