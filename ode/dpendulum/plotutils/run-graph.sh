#!/bin/sh

ode < dpendulum.ode |
awk '{print $1, $2}' |
graph -T png \
  --bitmap-size 720x720 \
  --font-size 0.03 \
  --width-of-plot 0.76 \
  --right-shift 0.12 \
  --height-of-plot 0.76 \
  --upward-shift 0.12 \
  --title-font-size 0.04 \
  -L "Double pendulum" \
  -C -m -1 \
  -S 1 \
  -X "t1" \
  -Y "u1" \
  -x -1.5 1.5 \
  -y -1.5 1.5 > orbit.png
