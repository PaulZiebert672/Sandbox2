# Double pendulum. Poincare section

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

function result = find_section_data(x, t)
  N_span = 3;
  result = [];
  for k = [1:length(t)]
    if (k == 1) continue endif
    if (x(k, 2)*x(k - 1, 2) > 0) continue endif
    if (x(k - 1, 4) < 0) continue endif

##    printf("~~> k = %d, t = %f \n", k, t(k - 1));
##    printf("~~> x(k - 1) = %f, %f, %f, %f \n", x(k - 1, 1), x(k - 1, 2), x(k - 1, 3), x(k - 1, 4));
##    printf("~~> x(k) = %f, %f, %f, %f \n", x(k, 1), x(k, 2), x(k, 3), x(k, 4));

    pt_start = max(1, k - N_span);
    pt_end = min(pt_start + 2*N_span + 1, length(t));
    sp_approx = spline(t(pt_start:pt_end), x(pt_start:pt_end, 2));
    fn = @(s) ppval(sp_approx, s);

##    printf("~~> fn(t(k - 1)) = %f, fn(t(k)) = %f \n", fn(t(k - 1)), fn(t(k)));

    t_zero = fzero(fn, [t(k - 1), t(k)]);
    x_zero = [];
    for idx = [1:4]
      x_zero(idx) = spline(t(pt_start:pt_end), x(pt_start:pt_end, idx), t_zero);
    endfor

##    printf("**> t_zero = %f \n", t_zero);
##    printf("**> x_zero = %f, %f, %f, %f \n", x_zero(1), x_zero(2), x_zero(3), x_zero(4));
##
##    printf("\n");

    result = [result; x_zero];
  endfor
##  result
endfunction

function hf = plot_section(x0_preset, e0, t_max, N_max)
  q_max = acos((2 - e0)/2) + 0.05;
  p_max = sqrt(2*e0) + 0.05;

  hf = figure();
  hold on
  axis equal;
  axis([-q_max, q_max, -p_max, p_max]);
  grid on;
  title "Double pendulum. Poincare section"
  xlabel "\q_1"
  ylabel "\u_1"

  for m = [1:length(x0_preset)]
    x0 = x0_preset(m, :)';
    x = lsode("dpendulum", x0, (t = linspace(0, t_max, N_max)'));
    printf("%s :: %d/%d :: integration complete - x0: [%f, %f, %f, %f] \n", ctime(time()), m, length(x0_preset), x0);
    result = find_section_data(x, t);
    printf("%s :: %d/%d :: section complete - %d points\n", ctime(time()), m, length(x0_preset), length(result));

    scatter(result(:, 1), result(:, 3), 0.3);
  endfor
  printf("%s :: process complete - %d samples\n", ctime(time()), m);

  glim = axis();
  text(
    glim(1) + 0.05*(glim(2) - glim(1)),
    glim(4) - 0.05*(glim(4) - glim(3)),
    sprintf("E = %4.3f", e0)
  );
endfunction

% --- Main procedure

e0 = 1.0;

x0_preset = [];
q01_max = acos((2 - e0)/2);
q02_max = acos(1 - e0);

N_steps = 6;

for q02 = [-q02_max:pi/N_steps:q02_max];
  x0_preset = [x0_preset; [acos((3 - e0 - cos(q02))/2), q02, 0, 0]];
endfor

for q01 = [0:pi/N_steps:q01_max];
  x0_preset = [x0_preset; [q01, 0, sqrt(e0 - 2 + 2*cos(q01)), 0]];
endfor

for q02 = [0:pi/N_steps:q02_max];
  x0_preset = [x0_preset; [0, q02, 0, sqrt(2*(e0 - 1 + cos(q02)))]];
endfor

clc;
printf("%s :: Poincare section. Processing %d samples... \n", ctime(time()), length(x0_preset));

for m = [1:length(x0_preset)]
  EPSILON = 1e-6;
  x0 = x0_preset(m, :)';
  if (abs(energy(x0) - e0) > EPSILON)
    printf("**> warning: energy(x0) != e0, %f \n", energy(x0));
  endif
endfor

hf = plot_section(x0_preset, e0, t_max, N_max);
# print(hf, "u-section-01.jpg", "-S1200,1600");

