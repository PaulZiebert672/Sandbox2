using DifferentialEquations
using Elliptic
using Plots

function pendulum(du, u, p, t)
    du[1] = u[2]
    du[2] = -sin(u[1])
end

function energy(u)
    e = 0.5*u[2]^2 + 1 - cos(u[1])
end

N = 120
u0 = [pi/2, 0.0]

t_max = 4*Elliptic.K(0.5*energy(u0))
t_step = t_max/N 
prob = ODEProblem(pendulum, u0, (0.0, t_max))
sol = solve(prob, Vern7(), adaptive=false, dt=t_step)

#display(sol)

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotOrbit = scatter(
    Tuple.(sol.u),
    aspect_ratio = 1,
    xlabel = "\\theta",
    ylabel = "p",
    plot_title = "Mathematical pendulum",
    markersize = 1.0,
    alpha = 0.25,
    legend = false,
    dpi = 300
)

#gui(), readline()

annotate!(
    xlims(plotOrbit)[1] + 0.12*(xlims(plotOrbit)[2] - xlims(plotOrbit)[1]),
    ylims(plotOrbit)[2] - 0.03*(ylims(plotOrbit)[2] - ylims(plotOrbit)[1]),
    text("E = $(round(energy(u0), digits=4))", :red, :right, 4)
)
savefig(plotOrbit, "orbit.png")
