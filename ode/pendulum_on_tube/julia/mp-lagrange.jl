using DifferentialEquations
using Elliptic
using Plots

include("mp-config.jl")

function pendulum(du, u, p, t)
    du[1] = u[2]
    du[2] = -sin(u[1])
end

function energy(u)
    e = 0.5*u[2]^2 + 1 - cos(u[1])
end

t_period = 4*Elliptic.K(0.5*energy(u0))
t_step = t_period/N 
prob = ODEProblem(pendulum, u0, (0.0, 2*t_period))
sol = solve(prob, Vern7(), adaptive=false, dt=t_step)

println("energy = ", energy(u0))
println("period = ", t_period)
#display(sol)

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotOrbit = scatter(
    Tuple.(sol.u),
    aspect_ratio = 1,
    xlabel = "\\theta",
    ylabel = "\\omega",
    plot_title = "Mathematical pendulum",
    markersize = 1.0,
    alpha = 0.25,
    legend = false,
    dpi = 300
)

#gui(), readline()

annotate!(
    xlims(plotOrbit)[1] + 0.18*(xlims(plotOrbit)[2] - xlims(plotOrbit)[1]),
    ylims(plotOrbit)[2] - 0.06*(ylims(plotOrbit)[2] - ylims(plotOrbit)[1]),
    text("\$\\mathcal{E}_0 = $(round(energy(u0), digits=4))\$\n\$T = $(round(t_period, digits=4))\$", :crimson, :right, 4)
)
savefig(plotOrbit, "mp-orbit.png")