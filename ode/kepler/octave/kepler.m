# Kepler problem

eps = 0.6
N = 120
K = 24    # Number of periods

q01 = 1 - eps;
q02 = 0;
u01 = 0;
u02 = sqrt((1 + eps)/(1 - eps));

function xdot = f(x,t)
  r = hypot(x(1), x(2));
  xdot(1) = x(3);
  xdot(2) = x(4);
  xdot(3) = -x(1)/r^3;
  xdot(4) = -x(2)/r^3;
endfunction

function e = energy(q1, q2, p1, p2)
  e = 0.5*(p1.^2 + p2.^2) - 1/hypot(q1, q2);
endfunction

function l = angular(q1, q2, p1, p2)
  l = q1*p2 - p1*q2;
endfunction

function configuration_plot(x, eps)
  global K;
  gap = 0.1;
  marker_size = 3.5;

  hf = figure();
  scatter(x(:, [1]), x(:, [2]), marker_size);
  axis equal
  axis([-1 - eps - gap, 1 - eps + gap, -sqrt(1 - eps^2) - gap, sqrt(1 - eps^2) + gap]);
  set(gca, 'fontsize', 11);
  grid on
  title "Kepler problem"
  xlabel "x"
  ylabel "y"

  glim = axis();
  text(
    glim(1) + 0.05*(glim(2) - glim(1)),
    glim(4) - 0.05*(glim(4) - glim(3)),
    sprintf("\\epsilon = %4.3f\nPeriods: %d", eps, K)
  );
  print(hf, "orbit.jpg", "-S960,720");
  print(hf, "orbit.eps", "-S960,720");
  #print(hf, "orbit.pdf", "-S960,720");
endfunction

function invariant_plot(x, t)
  marker_size = 3.5;

  e0 = energy(x(1, 1), x(1, 2), x(1, 3), x(1, 4));
  l0 = angular(x(1, 1), x(1, 2), x(1, 3), x(1, 4));
  m = 1;
  for el = x'
    sample(m).e = energy(el(1), el(2), el(3), el(4)) - e0;
    sample(m).l = angular(el(1), el(2), el(3), el(4)) - l0;
    m++;
  endfor

  hf = figure();
  scatter(t/(2*pi), [sample.e], marker_size);
  hold on
  scatter(t/(2*pi), [sample.l], marker_size, "marker", "+");
  set(gca, 'fontsize', 11);
  grid on
  title "Kepler problem"
  xlabel "Periods"
  ylabel "Error"
  legend("energy", "angular momentum");

  print(hf, "error.jpg", "-S960,720");
  print(hf, "error.eps", "-S960,720");
endfunction

x = lsode("f", [q01; q02; u01; u02], (t = linspace (0, 2*pi*K, N*K + 1)'));

configuration_plot(x, eps);
invariant_plot(x, t);

