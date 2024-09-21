% Circular restricted 3-body problem
function cr3bp_orbit

    % Read config params
    cfg = config;

    % Equations of motion in corotating frame
    function xdot = f(x, t)
        mu = cfg.mu;
        r1 = hypot((x(1) + mu), x(2), x(3));
        r2 = hypot((x(1) - 1 + mu), x(2), x(3));
        xdot(1) = x(4);
        xdot(2) = x(5);
        xdot(3) = x(6);
        xdot(4) = 2*x(5) + x(1) - (1 - mu)*(x(1) + mu)/r1^3 - mu*(x(1) - 1 + mu)/r2^3;
        xdot(5) = -2*x(4) + x(2) - (1 - mu)*x(2)/r1^3 - mu*x(2)/r2^3;
        xdot(6) = -(1 - mu)*x(3)/r1^3 - mu*x(3)/r2^3;
    endfunction

    % Constant of motion
    function e = energy(x)
        mu = cfg.mu;
        r1 = hypot((x(1) + mu), x(2), x(3));
        r2 = hypot((x(1) - 1 + mu), x(2), x(3));
        e = 0.5*(x(4)^2 + x(5)^2 + x(6)^2) - (1 - mu)/r1 - mu/r2 - 0.5*((1 - mu)*r1^2 + mu*r2^2);
    endfunction

    % Plot orbit
    function configuration_plot(x)
        gap = 0.1;
        marker_size = 0.5;

        hf = figure();
        hold on
        scatter(x(:, [1]), x(:, [2]), marker_size, 'r');
        axis equal
        axis([-1 - gap, 1 + gap, -1 - gap, 1 + gap]);
        set(gca, 'fontsize', 11);
        grid on
        title "Circular restricted 3-body problem"
        xlabel "x"
        ylabel "y"
        plot(-cfg.mu, 0, 'bo', 'MarkerFaceColor', 'b', 'MarkerSize', 8)
        plot(1 - cfg.mu, 0, 'bo', 'MarkerFaceColor', '#FF8C00', 'MarkerSize', 4)

        glim = axis();
        text(
            glim(1) + 0.05*(glim(2) - glim(1)),
            glim(4) - 0.05*(glim(4) - glim(3)),
            sprintf("\\mu = %d\nt = [0, %d]", cfg.mu, cfg.t_max)
        );
        print(hf, "orbit.jpg", "-S960,720");
        print(hf, "orbit.eps", "-S960,720");
    endfunction

    % Plot relative error in Jacobi constant
    function invariant_plot(x, t)
        marker_size = 1.5;

        e0 = energy(cfg.x_init);
        m = 1;
        for el = x'
            sample(m).e = energy(el) - e0;
            m++;
        endfor

        hf = figure();
        scatter(t, [sample.e], marker_size);
        set(gca, 'fontsize', 11);
        grid on
        title "Relative error in Jacobi constant"
        xlabel "Time"
        ylabel "Relative error"
        legend("Jacobi constant");

        glim = axis();
        text(
            glim(1) + 0.05*(glim(2) - glim(1)),
            glim(4) - 0.05*(glim(4) - glim(3)),
            sprintf("\\mu = %d\nJ = %d", cfg.mu, e0)
        );
        print(hf, "error.jpg", "-S960,720");
        print(hf, "error.eps", "-S960,720");
    endfunction

    x = lsode("f", cfg.x_init, (t = linspace (0, cfg.t_max, cfg.N)'));
    configuration_plot(x);
    invariant_plot(x, t);
end

