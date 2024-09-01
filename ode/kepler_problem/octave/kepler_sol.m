# Kepler problem. Exact solution

eps = 0.6
N = 120

function psi = kepler(phi, eps)
  EPSILON = 1.0e-13;
  t0 = 0;
  t1 = phi;
  while abs(t1 - t0) > EPSILON
    t0 = t1;
    t1 = phi + eps*sin(t0);
  endwhile
  psi = t1;
endfunction

function data = orbit(N, eps)
  T = 2*pi;
  for i = 1:N
    t_i = (i/N)*T;
    data(i).t = t_i;
    psi = kepler(t_i, eps);
    data(i).x1 = cos(psi) - eps;
    data(i).x2 = sqrt(1-eps^2)*sin(psi);
    data(i).p1 = -sin(psi)/(1 - eps*cos(psi));
    data(i).p2 = sqrt(1 - eps^2)*cos(psi)/(1 - eps*cos(psi));
  endfor
endfunction

function configuration_plot(data, eps)
  gap = 0.2;
  marker_size = 6;
  hf = figure();

  scatter([data.x1], [data.x2], marker_size);
  axis equal
  axis([-1 - eps - gap, 1 - eps + gap, -sqrt(1 - eps^2) - gap, sqrt(1 - eps^2) + gap])
  set(gca, 'fontsize', 11);
  set(gca, 'xaxislocation', 'origin');
  set(gca, 'yaxislocation', 'origin');
  set(gca, 'xminortick', 'on');
  set(gca, 'yminortick', 'on');
  grid on
  title "Kepler problem. Coordinate orbit"
  xlabel "x"
  ylabel "y"

  glim = axis();
  text(
    glim(1) + 0.05*(glim(2) - glim(1)),
    glim(4) - 0.05*(glim(4) - glim(3)),
    sprintf("\\epsilon = %4.3f\n", eps)
  );

  print(hf, "orbit-exact.jpg", "-S960,720");
  print(hf, "orbit-exact.eps", "-S960,720");
endfunction

function radial_plot(data, eps)
  gap = 0.05;
  marker_size = 6;
  hf = figure();

  k = 1;
  for el = data
    sample(k).r = hypot(el.x1, el.x2);
    sample(k).p = (el.p1*el.x1 + el.x2*el.p2)/hypot(el.x1, el.x2);
    k++;
  endfor

  scatter([sample.r], [sample.p], marker_size);
  axis equal
  glim = axis();
  axis([1 - eps - gap, 1 + eps + gap, glim(3), glim(4)])
  set(gca, 'fontsize', 11);
  set(gca, 'xaxislocation', 'origin');
  set(gca, 'yaxislocation', 'origin');
  set(gca, 'xminortick', 'on');
  set(gca, 'yminortick', 'on');
  grid on
  title "Kepler problem. Radial section"
  xlabel "r"
  ylabel "\p_r"

  glim = axis();
  text(
    glim(2) - 0.15*(glim(2) - glim(1)),
    glim(4) - 0.05*(glim(4) - glim(3)),
    sprintf("\\epsilon = %4.3f\n", eps)
  );

  print(hf, "radial-exact.jpg", "-S960,720");
  print(hf, "radial-exact.eps", "-S960,720");
endfunction

function hodograph_plot(data, eps)
  marker_size = 6;
  hf = figure();

  scatter([data.p1], [data.p2], marker_size);
  axis equal
  set(gca, 'fontsize', 11);
  set(gca, 'xaxislocation', 'origin');
  set(gca, 'yaxislocation', 'origin');
  set(gca, 'xminortick', 'on');
  set(gca, 'yminortick', 'on');
  grid on
  title "Kepler problem. Momentum hodograph"
  xlabel "\p_x"
  ylabel "\p_y"

  glim = axis();
  text(
    glim(1) + 0.05*(glim(2) - glim(1)),
    glim(4) - 0.05*(glim(4) - glim(3)),
    sprintf("\\epsilon = %4.3f\n", eps)
  );

  print(hf, "hodograph-exact.jpg", "-S960,720");
  print(hf, "hodograph-exact.eps", "-S960,720");
endfunction

data = orbit(N, eps);

configuration_plot(data, eps);
hodograph_plot(data, eps);
radial_plot(data, eps);

