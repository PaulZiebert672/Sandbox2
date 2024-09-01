using Roots
using Plots

include("pot-config.jl")

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

t = LinRange(0, 2*pi, 360)
theta = LinRange(theta_left, theta_right, N)

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)

plotFigure = plot(
    rho*sin.(t),
    rho*cos.(t),
    seriestype = [:shape],
    linewidth = 0.7,
    color = :slateblue,
    aspect_ratio = 1,
    xlabel = "x",
    ylabel = "y",
    plot_title = "Pendulum on the tube",
    legend = false,
    fillalpha = 0.3,
    dpi = 300
)

plot!(
    plotFigure,
    [rho, rho],
    [0, -1],
    linewidth = 0.7,
    linecolor = :black
)

plot!(
    plotFigure,
    rho .+ 0.02*sin.(t),
    -1 .+ 0.02*cos.(t),
    seriestype = [:shape],
    linewidth = 1,
    color = :black,
)

plot!(
    plotFigure,
    map(x -> rho*cos(x) + (1 + rho*x)*sin(x), theta),
    map(x -> rho*sin(x) - (1 + rho*x)*cos(x), theta),
    linewidth = 1,
    linestyle = :dot,
    linecolor = :grey,
    alpha = 0.4
)

x_plot_size = xlims(plotFigure)[2] - xlims(plotFigure)[1]
y_plot_size = ylims(plotFigure)[2] - ylims(plotFigure)[1]
annotate!(
    xlims(plotFigure)[1] + 0.18*x_plot_size,
    ylims(plotFigure)[2] - 0.24*y_plot_size,
    text("\$\\mathcal{E}_0 = $(round(e0, digits=4))\$", :crimson, :right, 4)
)
annotate!(
    xlims(plotFigure)[1] + 0.18*x_plot_size,
    ylims(plotFigure)[2] - 0.76*y_plot_size,
    text("\$\\rho = $(round(rho, digits=4))\$", :darkslateblue, :right, 4)
)

gui(), readline()
savefig(plotFigure, "figure.png")
