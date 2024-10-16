#!/bin/sh

ode < oscillator.ode |
graph -T png \
  --bitmap-size 720x720 \
  --font-size 0.03 \
  --width-of-plot 0.76 \
  --right-shift 0.12 \
  --height-of-plot 0.76 \
  --upward-shift 0.12 \
  --title-font-size 0.04 \
  -L "Van der Pohl oscillator" \
  -C -m -1 \
  -S 4 0.01 \
  -X "x" \
  -Y "y" > orbit.png
