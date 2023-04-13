# Kepler problem

eps = 0.6;

q01 = 1 - eps;
q02 = 0;
u01 = 0;
u02 = sqrt((1 + eps)/(1 - eps));

function xdot = f(x,t)
  r = sqrt(x(1)^2 + x(2)^2);
  xdot(1) = x(3);
  xdot(2) = x(4);
  xdot(3) = -x(1)/r^3;
  xdot(4) = -x(2)/r^3;
endfunction

T = 8*atan(1);

x = lsode("f", [q01; q02; u01; u02], (t = linspace (0, T, 120 + 1)'));

#set term postcript;
#set output "sample.ps";
scatter(x(:, [1]), x(:, [2]), 1.5);

axis equal
axis([-1.8, 0.6, -1.2, 1.2])
grid on
title "Kepler problem"
xlabel "x"
ylabel "y"

hP = axis();
ts1 = sprintf("eps = %f\n", eps);
text(-3*hP(2) + 0.05*(hP(2) - hP(1)), hP(4) - 0.05*(hP(4) - hP(3)), ts1);
