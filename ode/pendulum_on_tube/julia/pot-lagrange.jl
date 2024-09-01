using Roots
using QuadGK
using DifferentialEquations
using Plots

include("pot-config.jl")

function pendulum(du, u, p, t)
    du[1] = u[2]
    du[2] = -(rho*u[2]^2 + sin(u[1]))/(1 + rho*u[1])
end

function energy(u, rho)
    0.5*(1 + rho*u[1])^2*u[2]^2 + rho*sin(u[1]) + 1 - (1 + rho*u[1])*cos(u[1])
end

e0 = energy(u0, rho)
println("energy = ", e0)
amplitude = theta -> e0 - energy([theta, 0], rho)
theta_left = find_zero(amplitude, (-2*pi/3, 0))
theta_right = find_zero(amplitude, (2*pi/3, 0))
println("theta_left = ", theta_left)
println("theta_right = ", theta_right)
kernel = theta -> (1 + rho*theta)/sqrt(amplitude(theta))
result_left, qerror = quadgk(kernel, theta_left, 0)
result_right, qerror = quadgk(kernel, 0, theta_right)
t_period = sqrt(2)*(result_left + result_right)
println("period = ", t_period)

t_step = t_period/N 
prob = ODEProblem(pendulum, u0, (0.0, 2*t_period))
sol = solve(prob, Vern7(), adaptive=false, dt=t_step)
display(Tuple.(sol.u))

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotOrbit = scatter(
    Tuple.(sol.u),
    aspect_ratio = 1,
    xlabel = "\\theta",
    ylabel = "\\omega",
    plot_title = "Pendulum on the tube",
    markersize = 1.0,
    alpha = 0.25,
    legend = false,
    dpi = 300
)

x_plot_size = xlims(plotOrbit)[2] - xlims(plotOrbit)[1]
y_plot_size = ylims(plotOrbit)[2] - ylims(plotOrbit)[1]
annotate!(
    xlims(plotOrbit)[1] + 0.48*x_plot_size,
    ylims(plotOrbit)[2] - 0.24*y_plot_size,
    text("\$\\mathcal{E}_0 = $(round(e0, digits=4))\$\n\$\\mathrm{T} = $(round(t_period, digits=4))\$", :crimson, :right, 4)
)
annotate!(
    xlims(plotOrbit)[1] + 0.48*x_plot_size,
    ylims(plotOrbit)[2] - 0.76*y_plot_size,
    text("\$\\rho = $(round(rho, digits=4))\$", :slateblue, :right, 4)
)
gui(), readline()
savefig(plotOrbit, "pot-lagrange-orbit.png")
