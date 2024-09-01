using Roots
using QuadGK
using Plots

include("pot-config.jl")

function energy(u, rho)
    0.5*(1 + rho*u[1])^2*u[2]^2 + rho*sin(u[1]) + 1 - (1 + rho*u[1])*cos(u[1])
end

function theta_m(e)
    amplitude = theta -> e - energy([theta, 0], rho)
    theta_left = find_zero(amplitude, (-2*pi/3, 0))
    theta_right = find_zero(amplitude, (2*pi/3, 0))
    0.5*(theta_left + theta_right)
end

function theta_m0(e)
    -(2/3)*rho*e
end

e_max = energy([-pi/2, 0], rho)
e_range = LinRange(0, e_max, N)

gr(size = (300, 300))
Plots.scalefontsizes()
Plots.scalefontsizes(0.4)
plotMedian = scatter(
    e_range,
    theta_m,
    xlabel = "E",
    ylabel = "\\theta_{m}",
    plot_title = "Pendulum on the tube",
    markersize = 1.0,
    alpha = 0.25,
    legend = false,
    dpi = 300
)

plot!(
    plotMedian,
    e_range,
    theta_m0,
    linewidth = 1.5,
    linestyle = :dash,
    linecolor = :darkcyan,
    alpha = 0.5
)

annotate!((
    0.2,
    -7.5,
    text("\$\\rho = $(round(rho, digits=4))\$", :slateblue, :center, 4)
))

gui(), readline()
savefig(plotMedian, "pot-midpoint.png")
