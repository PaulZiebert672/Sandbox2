using DifferentialEquations
using Elliptic
using Plots
using Statistics

include("mp-config.jl")

function pendulum(du, u, p, t)
    du[1] = u[2]
    du[2] = -sin(u[1])
end

energy(u) = 0.5*u[2]^2 + 1 - cos(u[1])

e0 = energy(u0)
t_period = 4*Elliptic.K(0.5*e0)
println("energy = ", e0)
println("period = ", t_period)
t_step = t_period/N 
t_max = K*t_period

prob = ODEProblem(pendulum, u0, (0.0, t_max))
sol = solve(prob, Vern6(), adaptive=false, dt=t_step)
#display(sol)

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotOrbit = scatter(
    Tuple.(sol.u),
    aspect_ratio = 1,
    xlabel = "\\theta",
    ylabel = "\\omega",
    plot_title = "Mathematical pendulum - Lagrangian dynamics",
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
#gui(), readline()
savefig(plotOrbit, "mp-lagrange-orbit.png")

constant_of_motion = map(energy, sol.u)
# display(constant_of_motion)
println("mean energy = ", mean(constant_of_motion))
println("std energy = ", std(constant_of_motion))

gr(size = (360, 240))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotError = scatter(
    sol.t, (constant_of_motion .- energy(u0))./energy(u0),
    xlabel = "Time",
    ylabel = "Relative energy error",
    plot_title = "Mathematical pendulum - Lagrangian dynamics",
    markersize = 0.8,
    alpha = 0.15,
    legend = false,
    dpi = 300,
    annotation = (t_max - t_period, 0.0, text("\$\\mathcal{E}_0 = $(round(e0, digits=4))\$\n\$T = $(round(t_period, digits=6))\$", :darkslateblue, :bottom, 4))
)
# gui(), readline()
savefig(plotError, "mp-lagrange-error.png")
