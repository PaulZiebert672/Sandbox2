using Elliptic;
using Plots;
using LaTeXStrings;

import Elliptic.Jacobi;

E_0 = 1.0
N = 120

T = 4*Elliptic.K(E_0/2)
m = E_0/2

a = Array{Float64}(undef, N, 2)
for i in 1:N
    t = (i/N)*T
    a[i, 1] = 2*asin(sqrt(m)*Jacobi.sn(t, m))
    a[i, 2] = 2*sqrt(m)*Jacobi.cn(t, m)
end

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.45)
plotOrbit = plot(
    a[:, 1],
    a[:, 2],
    seriestype=:scatter,
    aspect_ratio = 1,
    xlabel = L"\theta",
    ylabel = L"p",
    plot_title = "Mathematical pendulum",
    markersize = 1.2,
    legend = false,
    dpi = 300
)
annotate!(
    xlims(plotOrbit)[1] + 0.12*(xlims(plotOrbit)[2] - xlims(plotOrbit)[1]),
    ylims(plotOrbit)[2] - 0.03*(ylims(plotOrbit)[2] - ylims(plotOrbit)[1]),
    L"\mathcal{E} = %$E_0%$"
)
savefig(plotOrbit, "pendulum-orbit.png")
