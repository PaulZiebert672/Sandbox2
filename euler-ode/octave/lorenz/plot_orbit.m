% Create plots using prepared tab separated values

% Config
cfg = jsondecode(fileread('../../conf/config.json'));
if(!strcmp(cfg.id, "lorenz"))
  beep();
  error(["Configuration id mismatch: ", cfg.id]);
endif

opt = jsondecode(fileread('plot_orbit.json'));

% Import calculated points
data = dlmread(fullfile(opt.src.dir, opt.src.data), "\t", 1, 0);

% Plot orbit
function hf = orbit_plot(x, y)

  marker_size = 1.5;

  hf = figure();
  hold on
  grid on
  axis equal
  xlabel "x"
  ylabel "z"
  set(gca, 'fontsize', 12);
  title 'Lorenz attractor'

  scatter(x, y, marker_size, 'r');

endfunction

% Plot orbit
hf = orbit_plot(data(:, [2]), data(:, [3]));
print(hf, fullfile(opt.dst.dir, opt.dst.plot.xz), "-S720,720");
