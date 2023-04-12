# Double pendulum
1;

function xdot = f(x,t)
  c12 = cos(x(1) - x(2));
  s12 = sin(x(1) - x(2));
  xdot(1) = x(3);
  xdot(2) = x(4);
  xdot(3) = (sin(x(2))*c12 - 2*sin(x(1)) - s12*(x(4)^2 + c12*x(3)^2)) / (2 - c12^2);
  xdot(4) = (2*sin(x(1))*c12 - 2*sin(x(2)) + s12*(2*x(3)^2 + c12*x(4)^2)) / (2 - c12^2);
endfunction

x = lsode("f", [0; 3*atan(1/sqrt(3)); 0; 0], (t = linspace (0, 384, 19200)'));

#set term postcript;
#set output "sample.ps";
scatter(x(:, [1]), x(:, [3]), 0.5);

axis equal
axis([-1.25, 1.25, -1.5, 1.5])
grid on
title "Double pendulum"
xlabel "q1"
ylabel "d q1 / d t"

