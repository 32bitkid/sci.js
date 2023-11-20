# `scibud`: A Modern SCI Buddy

`scibud` is a CLI utility to assist in inspecting and extracting assets form Sierra SCI0-engine adventure games.

## Usage

[Work in progress]

### Pic Rendering

```
Usage: scibud pic render [options] <id>

Arguments:
  id                       Picture resource number

Options:
  -o, --outdir <path>      output folder (default: ".")
  -f, --filename <string>  output filename
  --all                    render all steps as individual frames (default: false)
  --pre-roll <number>      pre-roll frames. renders the final frame this many times at the beginning of the
                           sequence. (default: 240)
  -h, --help               display help for command
```

#### Rendering a Single Picture Resource

```
$ scibud --root=/path/to/game pic render 15
```

#### Rendering an animation of a Picture Resource

```
$ scibud --root=/path/to/game pic render --all 15
```

You can can then use `ffmpeg` or another tool to convert these frames into a video:

```sh
$ ffmpeg -r 60 -f image2 -i pic.015.%04d.png -vcodec libx264 -crf 25  -pix_fmt yuv420p pic.015.mp4
```
