# Restricted 3-body problem in corotating frame
using DifferentialEquations
using Plots

include("config.jl")

# Numerical Methods for Ordinary Differential Equations
# J. C. Butcher
# ISBN: 9781119121503
function r3body(du, u, p, t)
    du[1] = u[4]
    du[2] = u[5]
    du[3] = u[6]
    du[4] = 2*u[5] + u[1] - mu*(u[1] + mu - 1)/hypot(u[2], u[3], u[1] + mu - 1)^3 - (1 - mu)*(u[1] + mu)/hypot(u[2], u[3], u[1] + mu)^3
    du[5] = -2*u[4] + u[2] - mu*u[2]/hypot(u[2], u[3], u[1] + mu - 1)^3 - (1 - mu)*u[2]/hypot(u[2], u[3], u[1] + mu)^3
    du[6] = - mu*u[3]/hypot(u[2], u[3], u[1] + mu - 1)^3 - (1 - mu)*u[3]/hypot(u[2], u[3], u[1] + mu)^3
end

t_step = t_period/N
prob = ODEProblem(r3body, u0, (0.0, t_period))
sol = solve(prob, Vern7(), adaptive=false, dt=t_step)

println("mu = ", mu)
println("period = ", t_period)
# display(sol)
data = reduce(hcat, sol.u)'

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotOrbit = scatter(
    data[:,1], data[:,2],
    aspect_ratio = 1,
    xlabel = "x",
    ylabel = "y",
    plot_title = "Restricted 3-body problem",
    markersize = 0.25,
    alpha = 0.05,
    legend = false,
    dpi = 300,
    annotation = (0.15, -0.25, text("\$\\mu= $(mu)\$\n\$T = 0...$(t_period)\$", :crimson, :bottom, 4))
)

# Heavy body position
scatter!(
    plotOrbit,
    [-mu], [0],
    markersize = 5.0,
    markercolor = :steelblue,
    alpha = 0.8
)

# Light body position
scatter!(
    plotOrbit,
    [1 - mu], [0],
    markersize = 2.0,
    markercolor = :orange,
    alpha = 0.8
)

plot!(plotOrbit, x_foreground_color_axis=:lightgrey, y_foreground_color_axis=:lightgrey)
plot!(plotOrbit, x_foreground_color_text=:lightgrey, y_foreground_color_text=:lightgrey)
plot!(plotOrbit, x_foreground_color_border=:lightgrey, y_foreground_color_border=:lightgrey)

gui(), readline()
savefig(plotOrbit, "orbit.png")