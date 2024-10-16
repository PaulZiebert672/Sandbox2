% Lorenz attractor

sigma = 10;
beta = 8/3;
rho = 28;

f = @(t, u) [
  -sigma*u(1) + sigma*u(2);
  rho*u(1) - u(2) - u(1)*u(3);
  -beta*u(3) + u(1)*u(2)
];

[t, u] = ode45(f, [0 100], [1 0 0]);     % Runge-Kutta 4th/5th order ODE solver

scatter3(u(:, 1), u(:, 2), u(:, 3), 1.2, 'r') % marker size and color
view (30, 30)      % azimuth and elevation
xlabel "x"
ylabel "y"
zlabel "z"
title("Lorenz attractor")
print("orbit.jpg", "-S960,720");

