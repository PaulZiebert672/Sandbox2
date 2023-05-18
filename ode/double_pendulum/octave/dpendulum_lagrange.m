# Double pendulum. Lagrange dynamics

% --- Initial conditions

q02 = 6*pi/12;
x0 = [acos((3 - 1.0 - cos(q02))/2); q02; 0; 0];

##u02 = sqrt(0.5);
##x0 = [0; 0; -0.5*u02 + sqrt(1.0 - (u02/2)^2); u02];

##q01 = 4*pi/12;
##x0 = [q01; 0; sqrt(1.0 - 2 + 2*cos(q01)); 0];

##q02 = 6*pi/12;
##x0 = [0; q02; 0; sqrt(2*(1.0 - 1 + cos(q02)))];

% --- Time span

t_step = 0.02;
t_max = 2*192.0;

N_max = floor(t_max/t_step) + 1;

function xdot = dpendulum(x, t)
  c12 = cos(x(1) - x(2));
  s12 = sin(x(1) - x(2));
  detM = 2 - c12^2;
  xdot(1) = x(3);
  xdot(2) = x(4);
  xdot(3) = (sin(x(2))*c12 - 2*sin(x(1)) - s12*(x(4)^2 + c12*x(3)^2)) / detM;
  xdot(4) = (2*sin(x(1))*c12 - 2*sin(x(2)) + s12*(2*x(3)^2 + c12*x(4)^2)) / detM;
endfunction

function e = energy(x)
  e = x(3)^2 + 0.5*x(4)^2 + x(3)*x(4)*cos(x(1) - x(2)) + 3 - 2*cos(x(1)) - cos(x(2));
endfunction

function plot_orbit(x)
  e0 = energy(x(1, :));
  q_max = acos((2 - e0)/2) + 0.05;
  p_max = sqrt(2*e0) + 0.05;

  hf = figure();
  scatter(x(:, 1), x(:, 3), 0.3);

  axis equal
  axis([-q_max, q_max, -p_max, p_max]);
  grid on
  set(gca, 'fontsize', 14);
  title "Double pendulum. Phase orbit"
  xlabel "\q_1"
  ylabel "\u_1"

  glim = axis();
  text(
    glim(1) + 0.05*(glim(2) - glim(1)),
    glim(4) - 0.05*(glim(4) - glim(3)),
    sprintf("E = %4.3f", e0)
  );
  print(hf, "orbit-lagrange.jpg", "-S600,800");
endfunction

function plot_invariant(x, t)
  e0 = energy(x(1, :));
  for k = [1:length(t)]
    sample(k).e = energy(x(k, :)) - e0;
  endfor

  hf = figure();
  scatter(t,  [sample.e], 1.0);

  grid on
  set(gca, 'fontsize', 12);
  title "Double pendulum. Invariant error"
  xlabel "time"
  ylabel "energy error"

  glim = axis();
  text(
    glim(1) + 0.05*(glim(2) - glim(1)),
    glim(4) - 0.05*(glim(4) - glim(3)),
    sprintf("E = %4.3f", e0)
  );

  print(hf, "error-lagrange.jpg", "-S960,720");
endfunction

% --- Main procedure

x = lsode("dpendulum", x0, (t = linspace(0, t_max, N_max)'));

plot_orbit(x);
plot_invariant(x, t);

