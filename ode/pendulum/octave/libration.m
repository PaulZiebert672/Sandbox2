# Mathematical pendulum
# Libration frequency versus energy

E = 0.0:0.005:2.0
plot(E, (pi/2)*(ellipke(E/2)).^(-1), "linewidth", 1.5)

grid on
title "Mathematical pendulum"
xlabel "E"
ylabel('\omega (E)', 'interpreter', 'tex')

