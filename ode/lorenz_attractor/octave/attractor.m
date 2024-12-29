% Lorenz attractor

rho = 28;
sigma = 10;
beta = 8/3;

f = @(t, u) [
  -sigma*u(1) + sigma*u(2);
  rho*u(1) - u(2) - u(1)*u(3);
  -beta*u(3) + u(1)*u(2)
];

% Dormand-Prince adaptive ODE solver
opt = odeset("MaxStep", 0.002);
[t, u] = ode45(f, [0 24], [1 1 10], opt);

% Plot orbit
function hf = mk_orbit_plot(x, y)
  plot(x, y)
  xlabel "x"
  ylabel "z"
  title("Lorenz attractor")
  print("orbit.jpg", "-S960,720");
endfunction

mk_orbit_plot(u(:, 1), u(:, 3));

