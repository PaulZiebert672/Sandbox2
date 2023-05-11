using DiffEqPhysics
using DifferentialEquations
using Plots

function H(p, q, param = nothing)
    E = (1/2)*(p[1]^2 + 2*p[2]^2 - 2*p[1]*p[2]*cos(q[1] - q[2]))/(2 - cos(q[1] - q[2])^2) + 3 - 2*cos(q[1]) - cos(q[2])
end

t_max = 384.0
t_step = 0.02 
p0 = [0.0, 0.0]
q0 = [0.0, pi/2]

prob = HamiltonianProblem(H, p0, q0, (0, t_max))
sol = solve(prob, Vern7(), adaptive=false, dt=t_step)
data = reduce(hcat, sol.u)'

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.5)
plotOrbit = scatter(
    data[:,3], data[:,1],
    aspect_ratio = 1,
    xlabel = "\\theta_1",
    ylabel = "\\pi_1",
    plot_title = "Double pendulum",
    markersize = 0.4,
    alpha = 0.15,
    legend = false,
    dpi = 300
)
annotate!(
    xlims(plotOrbit)[1] + 0.12*(xlims(plotOrbit)[2] - xlims(plotOrbit)[1]),
    ylims(plotOrbit)[2] - 0.03*(ylims(plotOrbit)[2] - ylims(plotOrbit)[1]),
    text("E = $(round(H(p0, q0), digits=4))", :red, :right, 4)
)
savefig(plotOrbit, "orbit-hamilton.png")
