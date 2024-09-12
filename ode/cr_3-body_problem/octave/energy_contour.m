function energy_contour

    % These masses represent the Earth-Moon system
    m1 = 5.974E24; % kg
    m2 = 7.348E22; % kg
    mu = m2/(m1 + m2);

    function e = energy(x, y)
        r_1 = sqrt((x + mu).^2 + y.^2)
        r_2 = sqrt((x + mu - 1).^2 + y.^2)
        e = -(1 - mu)./r_1 - mu./r_2 - 0.5*((1 - mu)*r_1.^2 + mu*r_2.^2)
    endfunction

    function output
        figure()
        title('The energy in the circular restricted 3-body problem')
        hold on
        ylim([-1.2, 1.2])
        xlim([-1.2, 1.2])
        axis square
        xlabel('x')
        ylabel('y')
        xcoord = linspace(-1.2, 1.2, 360)
        ycoord = linspace(-1.2, 1.2, 360)
        [X, Y] = meshgrid(xcoord, ycoord)
        contour(X, Y, energy(X, Y), linspace(0, -2, 360))
    endfunction
    output
end

