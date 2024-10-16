% Van der Pohl oscillator

mu = 1.0;

f = @(t, u) [
  u(2);
  mu*(1 - u(1)^2)*u(2) - u(1)
];

[t, u] = ode45(f, [0 100], [0.0002 0]);     % Runge-Kutta 4th/5th order ODE solver

scatter(u(:, 1), u(:, 2), 1.5, 'r') % marker size and color
xlabel "x"
ylabel "y"
grid on
axis equal
title("Van der Pohl oscillator")
print("orbit.jpg", "-S960,720");

