# Double pendulum

printf(" --- Initial conditions --- \n");
q01 = 0;
q02 = 6*atan(2 - sqrt(3));
u01 = 0;
u02 = 0;

function xdot = f(x,t)
  c12 = cos(x(1) - x(2));
  s12 = sin(x(1) - x(2));
  xdot(1) = x(3);
  xdot(2) = x(4);
  xdot(3) = (sin(x(2))*c12 - 2*sin(x(1)) - s12*(x(4)^2 + c12*x(3)^2)) / (2 - c12^2);
  xdot(4) = (2*sin(x(1))*c12 - 2*sin(x(2)) + s12*(2*x(3)^2 + c12*x(4)^2)) / (2 - c12^2);
endfunction

x = lsode("f", [q01; q02; u01; u02], (t = linspace (0, 384, 19200)'));

#set term postcript;
#set output "sample.ps";
scatter(x(:, [1]), x(:, [3]), 0.5);

axis equal
axis([-1.25, 1.25, -1.5, 1.5])
grid on
title "Double pendulum"
xlabel "q1"
ylabel "u1"

hP = axis();
ts1 = sprintf("Q0 = [%f, %f]\nU0 = [%f, %f]\n", q01, q02, u01, u02);
text(-hP(2) + 0.05*(hP(2) - hP(1)), hP(4) - 0.05*(hP(4) - hP(3)), ts1);
