% Based on https://orbital-mechanics.space/the-n-body-problem/Lagrange-points-example.html
function lagrange_points_example
    % These masses represent the Earth-Moon system
    m1 = 5.974E24; % kg
    m2 = 7.348E22; % kg
    mu = m2/(m1 + m2);

    function y = collinear_lagrange(xstar)
        firstterm = xstar;
        secondterm = (1 - mu) ./ abs(xstar + mu).^3 .* (xstar + mu);
        thirdterm = mu ./ abs(xstar - 1 + mu).^3 .* (xstar - 1 + mu);
        y = firstterm - secondterm - thirdterm;
    end
    options = optimset('Display', 'iter');
    L_2 = fzero(@collinear_lagrange,[1, 1.5], options);
    L_1 = fzero(@collinear_lagrange,[0.02, 0.98], options);
    L_3 = fzero(@collinear_lagrange,[-1, -1.5], options);
    fprintf('L_1=%f, L_2=%f, L_3=%f\n', L_1, L_2, L_3)

    function output
        figure()
        title('The Lagrange points in the circular restricted 3-body problem')
        hold on
        ylim([-1.2, 1.2])
        xlim([-1.2, 1.2])
        axis square
        xlabel('x')
        ylabel('y')
        plot(-mu, 0, 'bo', 'MarkerFaceColor', 'b', 'MarkerSize', 8)
        plot(1 - mu, 0, 'go', 'MarkerFaceColor', 'g', 'MarkerSize', 6)
        plot(L_1, 0, 'rx', 'MarkerFaceColor', 'r', 'MarkerSize', 3)
        plot(L_2 ,0, 'r+', 'MarkerFaceColor', 'r', 'MarkerSize', 4)
        plot(L_3, 0, 'r*', 'MarkerFaceColor', 'w', 'MarkerSize', 3)
        plot(0.5 - mu, sqrt(3)/2, 'ro', 'MarkerFaceColor', 'w', 'MarkerSize', 3)
        plot(0.5 - mu, -sqrt(3)/2, 'rd', 'MarkerFaceColor', 'w', 'MarkerSize', 3)
        plot([-mu, 0.5-mu, 1-mu, 0.5-mu, -mu, 1-mu], [0, sqrt(3)/2, 0, -sqrt(3)/2, 0, 0], '--c')
        coords = linspace(0, 2*pi, 180);
        plot((1 - mu).*cos(coords), (1 - mu).*sin(coords), '-m')
        hold all
        plot(mu.*cos(coords), mu.*sin(coords), '-k')
        legend('$m_1$', '$m_2$', '$L_1$', '$L_2$', '$L_3$', '$L_4$', '$L_5$', 'Interpreter', 'latex')
    end
    output
end

