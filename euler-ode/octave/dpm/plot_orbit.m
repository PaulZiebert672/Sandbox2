% Create plots using prepared tab separated values

% Config
global E0;
E0 = 1.5;
src_data = "orbit09.tsv";
src_dir = "../../data/dpm/";
dst_orbit_plot = "orbit-q1p1.eps";
dst_inv_plot = "inv-error.eps";
dst_dir = "../../plot/dpm/";

% Import calculated points
data = dlmread([src_dir src_data], "\t", 1, 0);

% Plot orbit
function hf = orbit_plot(x, y)

  global E0;
  marker_size = 0.25;
  gap = 0.05;

  p_max = 2*sqrt(E0);
  q_max = acos(1 - E0/2);

  hf = figure();
  hold on
  grid on
  axis equal
  axis([-q_max - gap, q_max + gap, -p_max - gap, p_max + gap]);
  xlabel "\\theta_1"
  ylabel "p_1"
  set(gca, 'fontsize', 12);
  title 'Double pendulum'

  scatter(x, y, marker_size, 'r');

  glim = axis();
  text(
    glim(1) + 0.05*(glim(2) - glim(1)),
    glim(4) - 0.05*(glim(4) - glim(3)),
    sprintf("E = %d", E0)
  );
endfunction

% Plot invariant error
function hf = inv_plot(x, y)
  n_start = idivide(2*size(x, 1), int32(3), "fix");
  n_stop = idivide(17*size(x, 1), int32(24), "fix");
  hf = figure();
  hold on
  subplot(2, 1, 1);
  plot(x, y);
  xlabel("t")
  ylabel("\\delta E")
  grid on
  title 'Double pendulum. Invariant error'
  subplot(2, 1, 2);
  plot(x(n_start:n_stop), y(n_start:n_stop));
  xlabel("t")
  ylabel("\\delta E")
  grid on
  title 'Double pendulum. Invariant error (zoomed)'
endfunction

% Plot orbit
hf = orbit_plot(data(:, [2]), data(:, [3]));
print(hf, [dst_dir, dst_orbit_plot], "-S720,960");

% Plot invariant error
hf = inv_plot(data(:, 1), data(:, 4));
print(hf, [dst_dir, dst_inv_plot], "-S960,720");

