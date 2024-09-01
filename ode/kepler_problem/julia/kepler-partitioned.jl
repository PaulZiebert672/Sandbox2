using OrdinaryDiffEq
using LinearAlgebra
using ForwardDiff
using Plots

H(p, q) = 0.5*norm(p)^2 - inv(norm(q))

pdot(dp, p, q, params, t) = ForwardDiff.gradient!(dp, q -> -H(p, q), q)
qdot(dq, p, q, params, t) = ForwardDiff.gradient!(dq, p -> H(p, q), p)

q0 = [0.4, 0.0]
p0 = [0.0, 2.0]

N = 120     # points per orbital period
K = 5400    # total number of cycles
M = 5       # number of last cycles to analyze
t_step = 2*pi/N
t_max = 2*pi*K

prob = DynamicalODEProblem(pdot, qdot, p0, q0, (0.0, t_max))
sol = solve(prob, KahanLi6(), dt = t_step);
data = reduce(hcat, sol.u[N*(K-M):N*K+1])'

#display(sol)

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotOrbit = scatter(
    data[:, 3], data[:, 4],
    aspect_ratio = 1,
    xlabel = "x",
    ylabel = "y",
    plot_title = "Kepler problem",
    markersize = 0.5,
    alpha = 0.25,
    legend = false,
    dpi = 300
)

annotate!(
    xlims(plotOrbit)[1] + 0.12*(xlims(plotOrbit)[2] - xlims(plotOrbit)[1]),
    ylims(plotOrbit)[2] - 0.03*(ylims(plotOrbit)[2] - ylims(plotOrbit)[1]),
    text("E = $(round(H(p0, q0), digits=4))", :red, :right, 4)
)
savefig(plotOrbit, "orbit-hamilton.png")

Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotEnergy = scatter(
    sol.t[N*(K-M):N*K+1]/(2*pi),
    map(eachrow(data)) do s
        H([s[1], s[2]], [s[3], s[4]]) - H(p0, q0)
    end,
    xlabel = "Rotations - N",
    ylabel = "Energy error - \\Delta E",
    plot_title = "Kepler problem",
    markersize = 0.5,
    alpha = 0.25,
    legend = false,
    dpi = 300
)
savefig(plotEnergy, "energy.png")
