using Plots;
using LaTeXStrings;

eps = 0.6
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

gr(size = (300, 300))
Plots.scalefontsizes(0.45)
p = plot(
    a[:, 1],
    a[:, 2],
    seriestype=:scatter,
    aspect_ratio = 1,
    xlabel = L"x",
    ylabel = L"y",
    plot_title = "Kepler problem",
    markersize = 1.5,
    legend = false,
    framestyle = :origin,
    dpi = 300
)
x = eps # one-symbol var required
annotate!(
    xlims(p)[1] + 0.07*(xlims(p)[2] - xlims(p)[1]),
    ylims(p)[2] - 0.03*(ylims(p)[2] - ylims(p)[1]),
    L"\epsilon = %$x"
)
savefig(p, "kepler-orbit.png")
