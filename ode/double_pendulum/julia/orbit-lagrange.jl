using DifferentialEquations
using Plots

function dpendulum(du, u, p, t)
    sdiff = sin(u[1] - u[2])
    cdiff = cos(u[1] - u[2])
    detM = 2 - cdiff^2
    du[1] = u[3]
    du[2] = u[4]
    du[3] = (sin(u[2])*cdiff - 2*sin(u[1]) - sdiff*(u[4]^2 + cdiff*u[3]^2)) / detM
    du[4] = (2*sin(u[1])*cdiff -2*sin(u[2]) + sdiff*(2*u[3]^2 + cdiff*u[4]^2)) / detM
end

function energy(u)
    e = u[3]^2 + (1/2)*u[4]^2 + u[3]*u[4]*cos(u[1] - u[2]) + 3 - 2*cos(u[1]) - cos(u[2])
end

u0 = [0.0, pi/2, 0.0, 0.0]

t_max = 384.0
t_step = 0.02 
prob = ODEProblem(dpendulum, u0, (0.0, t_max))
sol = solve(prob, Vern7(), adaptive=false, dt=t_step)

#display(sol)
data = reduce(hcat, sol.u)'

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotOrbit = scatter(
    data[:,1], data[:,3],
    aspect_ratio = 1,
    xlabel = "\\theta_1",
    ylabel = "\\nu_1",
    plot_title = "Double pendulum",
    markersize = 0.5,
    alpha = 0.25,
    legend = false,
    dpi = 300
)

annotate!(
    xlims(plotOrbit)[1] + 0.12*(xlims(plotOrbit)[2] - xlims(plotOrbit)[1]),
    ylims(plotOrbit)[2] - 0.03*(ylims(plotOrbit)[2] - ylims(plotOrbit)[1]),
    text("E = $(round(energy(u0), digits=4))", :red, :right, 4)
)
savefig(plotOrbit, "orbit-lagrange.png")
