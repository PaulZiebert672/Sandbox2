# Double pendulum

printf(" --- Initial conditions --- \n");
p01 = 0
p02 = 0
q01 = 0*atan(2 - sqrt(3))
q02 = 6*atan(2 - sqrt(3))

Tmax = 1*384
Nstep = 50

function E = H(p1, p2, q1, q2)
  E = (1/2)*(p1^2 + 2*p2^2 - 2*p1*p2*cos(q1 - q2))/(2 - cos(q1 - q2)^2) + 3 - 2*cos(q1) - cos(q2);
endfunction

function xdot = Hdiff(x, t)
    c12 = cos(x(3) - x(4));
    detM = 2 - c12^2;
    W = (sin(x(3) - x(4)) / detM^2) * ((x(1)^2 + 2*x(2)^2)*c12 - x(1)*x(2)*(4 - detM));
    xdot(1) = -2*sin(x(3)) + W;
    xdot(2) = -sin(x(4)) - W;
    xdot(3) = (x(1) - x(2)*c12) / detM;
    xdot(4) = (2*x(2) - x(1)*c12) / detM;
endfunction

x = lsode("Hdiff", [p01; p02; q01; q02], (t = linspace (0, Tmax, ceil(Tmax * Nstep))'));

#set term postcript;
#set output "sample.ps";
scatter(x(:, 3), x(:, 1), 0.5);

Hv = arrayfun("H", x(: ,1), x(:, 2), x(: ,3), x(: ,4));

axis equal
axis([-1.25, 1.25, -2.0, 2.0])
grid on
title "Double pendulum"
xlabel "q1"
ylabel "p1"

ts1 = sprintf("E0 = %f\nT = %.4f\n", H(p01, p02, q01, q02), Tmax);
ts2 = sprintf("m(H) = %f\nd(H) = %f\n", mean(Hv), sqrt(cov(Hv)));
hP = axis();
text(hP(2) + 0.02*(hP(2) - hP(1)), hP(4) - 0.05*(hP(4) - hP(3)), ts1);
text(hP(2) + 0.02*(hP(2) - hP(1)), 0.5*(hP(4) + hP(3)) - 0.05*(hP(4) - hP(3)), ts2);

printf(" --- Energy integral --- \n");
printf(ts1);
printf(ts2);

