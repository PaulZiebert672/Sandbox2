% Create plots using prepared tab separated values

% Configuration
cfg = jsondecode(fileread('../../conf/config.json'));
if(!strcmp(cfg.id, "cr3bp"))
  beep();
  error(["Configuration id mismatch: ", cfg.id]);
endif

opt = jsondecode(fileread('plot_orbit.json'));

global mu;
global gap;
mu = cfg.params.mu;
gap = opt.dst.plot.gap;

% Import calculated points
data_phi = dlmread(fullfile(opt.src.dir, opt.src.data), "\t", 1, 0);

% Plot orbit
function hf = orbit_plot(x, y, name)

  global mu;
  global gap;
  marker_size = 0.25;

  hf = figure();
  hold on
  grid on
  axis equal
  axis([-1 - gap, 1 + gap, -1 - gap, 1 + gap]);
  xlabel "x"
  ylabel "y"
  set(gca, 'fontsize', 11);
  title(['Circular restricted 3-body problem. ', name])

  scatter(x, y, marker_size, 'r');

  glim = axis();
  text(
    glim(1) + 0.05*(glim(2) - glim(1)),
    glim(4) - 0.05*(glim(4) - glim(3)),
    sprintf("\\mu = 1 : %d", 1/mu)
  );
endfunction

% Transformation to Ptolemy view
function res = rotate_orbit(x)
  global mu;
  t = x(1);
  res = [t, x(2)*cos(t) - x(3)*sin(t) + mu*cos(t), x(2)*sin(t) + x(3)*cos(t) + mu*sin(t)];
endfunction

data_psi = cell2mat(arrayfun(
  @(k) rotate_orbit([data_phi(k, 1), data_phi(k, 2), data_phi(k, 3)]),
  (1:size(data_phi, 1)).',
  "UniformOutput",
  false
));

% Plot orbit in corotating frame
hf = orbit_plot(data_phi(:, [2]), data_phi(:, [3]), "Corotating frame");
plot([-mu], [0], 'bo', 'MarkerFaceColor', '#55A0CC', 'MarkerSize', 5);
plot(1 - mu, 0, 'bo', 'MarkerFaceColor', '#FF8C00', 'MarkerSize', 3)
print(hf, fullfile(opt.dst.dir, opt.dst.plot.corotating), "-S960,720");

% Plot orbit in Ptolemy view
hf = orbit_plot(data_psi(:, [2]), data_psi(:, [3]), "Ptolemy view");
plot([0], [0], 'bo', 'MarkerFaceColor', '#55A0CC', 'MarkerSize', 5);
tau=2*pi*(1:200)/200;
plot(cos(tau), sin(tau), 'bo', 'MarkerFaceColor', '#FF8C00', 'MarkerSize', 3)
print(hf, fullfile(opt.dst.dir, opt.dst.plot.ptolemy), "-S960,720");
