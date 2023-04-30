# Mathematical pendulum

printf(" --- Initial conditions --- \n");
p01 = 0;
q01 = 6*atan(2 - sqrt(3));

function xdot = f(x,t)
  xdot(1) = x(2);
  xdot(2) = -sin(x(1));
endfunction

E0 = p01^2/2 + 1 - cos(q01);
T = 4*ellipke(E0/2);
printf(" --- Period --- \nT = %d", T);

x = lsode("f", [q01; p01], (t = linspace (0, T, 120 + 1)'));

#set term postcript;
#set output "sample.ps";
scatter(x(:, [1]), x(:, [2]), 1.5);

axis equal
axis([-1.75, 1.75, -1.5, 1.5])
grid on
title "Mathematical pendulum"
xlabel "q"
ylabel "u"

hP = axis();
ts1 = sprintf("E0 = %f\nT = %.4f\n", E0, T);
text(-hP(2) + 0.05*(hP(2) - hP(1)), hP(4) - 0.05*(hP(4) - hP(3)), ts1);
