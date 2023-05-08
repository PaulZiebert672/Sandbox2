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

a = Array{Float64}(undef, N, 4)
for i in 1:N
    psi = keplerPsi((i/N)*2*pi, eps)
    a[i, 1] = cos(psi) - eps
    a[i, 2] = sqrt(1 - eps^2)*sin(psi)
    a[i, 3] = -sin(psi)/(1 - eps*cos(psi))
    a[i, 4] = sqrt(1 - eps^2)*cos(psi)/(1 - eps*cos(psi))
end

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.45)
plotOrbit = scatter(
    a[:, 1],
    a[:, 2],
    aspect_ratio = 1,
    xlabel = L"x",
    ylabel = L"y",
    plot_title = "Kepler problem",
    markersize = 1.2,
    alpha = 0.75,
    legend = false,
    framestyle = :origin,
    dpi = 300
)
annotate!(
    xlims(plotOrbit)[1] + 0.07*(xlims(plotOrbit)[2] - xlims(plotOrbit)[1]),
    ylims(plotOrbit)[2] - 0.03*(ylims(plotOrbit)[2] - ylims(plotOrbit)[1]),
    L"\epsilon = %$eps%$"
)
savefig(plotOrbit, "orbit-exact.png")

function rho(x, y)
    sqrt(x^2 + y^2)
end

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.45)
plotRadial = scatter(
    map(eachrow(a)) do s 
        rho(s[1], s[2])
    end,
    map(eachrow(a)) do s 
        (s[3]*s[1] + s[2]*s[4])/rho(s[1], s[2])
    end,
    aspect_ratio = 1,
    xlabel = L"r",
    ylabel = L"p_r",
    plot_title = "Kepler problem",
    markersize = 1.2,
    alpha = 0.75,
    legend = false,
    dpi = 300
)
annotate!(
    xlims(plotRadial)[2] - 0.12*(xlims(plotRadial)[2] - xlims(plotRadial)[1]),
    ylims(plotRadial)[2] - 0.03*(ylims(plotRadial)[2] - ylims(plotRadial)[1]),
    L"\epsilon = %$eps%$"
)
savefig(plotRadial, "radial-exact.png")

Plots.scalefontsizes()
Plots.scalefontsizes(0.45)
plotOrbit = scatter(
    a[:, 3],
    a[:, 4],
    aspect_ratio = 1,
    xlabel = L"p_x",
    ylabel = L"p_y",
    plot_title = "Kepler problem",
    markersize = 1.2,
    alpha = 0.75,
    legend = false,
    framestyle = :origin,
    dpi = 300
)
annotate!(
    xlims(plotOrbit)[1] + 0.07*(xlims(plotOrbit)[2] - xlims(plotOrbit)[1]),
    ylims(plotOrbit)[2] - 0.03*(ylims(plotOrbit)[2] - ylims(plotOrbit)[1]),
    L"\epsilon = %$eps%$"
)
savefig(plotOrbit, "hodograph-exact.png")
