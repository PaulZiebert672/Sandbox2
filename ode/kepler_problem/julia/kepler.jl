using DifferentialEquations
using Plots

function kepler(du, u, p, t)
    du[1] = u[3]
    du[2] = u[4]
    du[3] = -u[1]/hypot(u[1], u[2])^3
    du[4] = -u[2]/hypot(u[1], u[2])^3
end

function energy(u)
    e = 0.5*hypot(u[3], u[4])^2 + 1/hypot(u[1], u[2])
end

function angular(u)
    l = u[4]*u[1] - u[2]*u[3]
end

eps = 0.6
N = 120
K = 8

u0 = [1 - eps, 0.0, 0.0, sqrt((1 + eps)/(1 - eps))]

t_0 = 2*pi
t_step = t_0/N 
prob = ODEProblem(kepler, u0, (0.0, t_0*K))
sol = solve(prob, Vern7(), adaptive=false, dt=t_step)

#display(sol)
data = reduce(hcat, sol.u)'

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotOrbit = scatter(
    data[:,1], data[:,2],
    aspect_ratio = 1,
    xlabel = "x",
    ylabel = "y",
    plot_title = "Kepler problem",
    markersize = 0.5,
    alpha = 0.25,
    legend = false,
    framestyle = :origin,
    dpi = 300
)

annotate!(
    xlims(plotOrbit)[1] + 0.12*(xlims(plotOrbit)[2] - xlims(plotOrbit)[1]),
    ylims(plotOrbit)[2] - 0.03*(ylims(plotOrbit)[2] - ylims(plotOrbit)[1]),
    text("\\epsilon = $(eps)", :red, :right, 4)
)
savefig(plotOrbit, "orbit.png")
