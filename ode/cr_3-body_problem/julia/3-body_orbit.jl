# Restricted 3-body problem in corotating frame
using DifferentialEquations
using Plots

include("config.jl")

r_1 = u -> hypot(u[1] + mu, u[2], u[3])
r_2 = u -> hypot(u[1] - 1 + mu, u[2], u[3])

# Numerical Methods for Ordinary Differential Equations
# J. C. Butcher
# ISBN: 9781119121503
function cr3body(du, u, p, t)
    du[1] = u[4]
    du[2] = u[5]
    du[3] = u[6]
    du[4] = 2*u[5] + u[1] - (1 - p)*(u[1] + p)/r_1(u)^3 - p*(u[1] + p - 1)/r_2(u)^3
    du[5] = -2*u[4] + u[2] - (1 - p)*u[2]/r_1(u)^3 - p*u[2]/r_2(u)^3
    du[6] =  -(1 - p)*u[3]/r_1(u)^3 - p*u[3]/r_2(u)^3
end

# Jacobi constant
jacobi(u, p) = 0.5*(u[4]^2 + u[5]^2 + u[6]^2) - (1 - p)/r_1(u) - p/r_2(u) - 0.5*((1 - p)*r_1(u)^2 + p*r_2(u)^2)

t_step = t_period/N
prob = ODEProblem(cr3body, u0, (0.0, t_period), mu)
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

#gui(), readline()
savefig(plotOrbit, "orbit.png")

inv0 = jacobi(u0, mu)
println("jacobi constant = ", inv0)
inv = map(jacobi, sol.u, map(x -> mu, sol.t))

plotError = scatter(
    sol.t, (inv .- inv0)./inv0,
    xlabel = "time",
    ylabel = "error",
    plot_title = "Relative invariant error in restricted 3-body problem",
    markersize = 0.8,
    alpha = 0.15,
    legend = false,
    dpi = 300,
    annotation = (t_period - 3.0, 0.0, text("\$\\mu= $(mu)\$\n\$inv = $(inv0)\$", :crimson, :bottom, 4))
)

# gui(), readline()
savefig(plotError, "error.png")
