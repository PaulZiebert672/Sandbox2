#!/bin/sh

ode < attractor.ode |
awk '{print $1, $3}' |
graph -T png \
  --bitmap-size 720x720 \
  --font-size 0.03 \
  --width-of-plot 0.76 \
  --right-shift 0.12 \
  --height-of-plot 0.76 \
  --upward-shift 0.12 \
  --title-font-size 0.04 \
  -L "Lorenz attractor" \
  -C -m -1 \
  -S 4 0.005 \
  -X "x" \
  -Y "z" > orbit.png
