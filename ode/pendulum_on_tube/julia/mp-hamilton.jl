using OrdinaryDiffEq
using LinearAlgebra
using ForwardDiff
using Elliptic
using Plots
using Statistics

include("mp-config.jl")

# Hamiltonian
H(p, q) = 0.5*(p[1])^2 + 1 - cos(q[1])

# Hamilton's canonical equations
pdot(dp, p, q, params, t) = ForwardDiff.gradient!(dp, q -> -H(p, q), q)
qdot(dq, p, q, params, t) = ForwardDiff.gradient!(dq, p -> H(p, q), p)

q0 = [u0[1]]
p0 = [u0[2]]

e0 = H(p0, q0)
t_period = 4*Elliptic.K(0.5*e0)
println("energy = ", e0)
println("period = ", t_period)
t_step = t_period/N
t_max = t_period*K

prob = DynamicalODEProblem(pdot, qdot, p0, q0, (0.0, t_max))
sol = solve(prob, KahanLi6(), dt = t_step);
data = reduce(hcat, sol.u)'

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotOrbit = scatter(
    data[:, 2], data[:, 1],
    aspect_ratio = 1,
    xlabel = "\$\\theta\$",
    ylabel = "p",
    plot_title = "Mathematical pendulum - Hamiltonian dynamics",
    markersize = 1.0,
    alpha = 0.25,
    legend = false,
    dpi = 300
)
annotate!(
    xlims(plotOrbit)[1] + 0.18*(xlims(plotOrbit)[2] - xlims(plotOrbit)[1]),
    ylims(plotOrbit)[2] - 0.06*(ylims(plotOrbit)[2] - ylims(plotOrbit)[1]),
    text("\$\\mathcal{E}_0 = $(round(e0, digits=4))\$\n\$T = $(round(t_period, digits=6))\$", :crimson, :right, 4)
)
# gui(), readline()
savefig(plotOrbit, "mp-hamilton-orbit.png")

constant_of_motion = map(H, data[:, 1], data[:, 2])
# display(constant_of_motion)
println("mean energy = ", mean(constant_of_motion))
println("std energy = ", std(constant_of_motion))

gr(size = (360, 240))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotError = scatter(
    sol.t, (constant_of_motion .- e0)./e0,
    xlabel = "Time",
    ylabel = "Relative energy error",
    plot_title = "Mathematical pendulum - Hamiltonian dynamics",
    markersize = 0.5,
    alpha = 0.25,
    legend = false,
    dpi = 300,
    annotation = (t_max - t_period, 0.0, text("\$\\mathcal{E}_0 = $(round(e0, digits=4))\$\n\$T = $(round(t_period, digits=6))\$", :darkslateblue, :bottom, 4))
)
# gui(), readline()
savefig(plotError, "mp-hamilton-error.png")
