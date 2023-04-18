#!/bin/sh

ode < pendulum.ode |
awk '{print $1, $2}' |
graph -T png \
  --bitmap-size 720x720 \
  --font-size 0.03 \
  --width-of-plot 0.76 \
  --right-shift 0.12 \
  --height-of-plot 0.76 \
  --upward-shift 0.12 \
  --title-font-size 0.04 \
  -L "Mathematical pendulum" \
  -C -m -1 \
  -S 4 0.01 \
  -X "q" \
  -Y "u" \
  -x -1.6 1.6 \
  -y -1.6 1.6 > orbit.png
