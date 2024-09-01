#!/bin/sh

ode < kepler.ode |
awk '{print $1, $3}' |
graph -T png \
  --bitmap-size 720x720 \
  --font-size 0.03 \
  --width-of-plot 0.76 \
  --right-shift 0.12 \
  --height-of-plot 0.76 \
  --upward-shift 0.12 \
  --title-font-size 0.04 \
  -L "Kepler problem" \
  -C -m -1 \
  -S 4 0.01 \
  -X "x" \
  -Y "y" \
  -x -1.8 0.6 \
  -y -1.2 1.2 > orbit.png
