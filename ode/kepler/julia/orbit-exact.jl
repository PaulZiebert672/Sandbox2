using Plots;

eps = 0.28
N = 120

function keplerPsi(phi, eps)
    EPSILON = 1.0e-13
    theta0 = 0
    theta1 = phi
    while abs(theta1 - theta0) > EPSILON
        theta0 = theta1
        theta1 = phi + eps*sin(theta0)
    end
    theta1
end

a = Array{Float64}(undef, N, 2)
for i in 1:N
    psi = keplerPsi((i/N)*2*pi, eps)
    a[i, 1] = cos(psi) - eps
    a[i, 2] = sqrt(1 - eps^2)*sin(psi)
end

p = plot(
    a[:, 1],
    a[:, 2],
    seriestype=:scatter,
    aspect_ratio = 1,
    xlabel = "x",
    ylabel = "y",
    plot_title = "Kepler problem",
    markersize = 2,
    legend = false,
    framestyle = :origin,
    dpi = 300
)
annotate!(-1.5, 0.85, "eps = $(eps)")
savefig(p, "kepler-orbit.png")
