using Plots; pythonplot(size = (300, 300))

include("config.jl")

function energy(x, y)
    r_1 = sqrt((x + mu)^2 + y^2)
    r_2 = sqrt((x + mu - 1)^2 + y^2)
    e = -(1 - mu)/r_1 - mu/r_2 - 0.5*((1 - mu)*r_1^2 + mu*r_2^2)
    if e < -1.76
        return -1.76
    end
    return e
end

limit = 1.5
x = range(-limit, limit, length = 720)
y = range(-limit, limit, length = 720)

z = @. energy(x', y)
println("mu = ", mu)

plotContour = contour(x, y, z,
    levels = range(-1.75, -1.5, length = 60),
    lw = 0.8,
    alpha = 0.95,
    aspect_ratio = 1,
    dpi = 300,
    annotation = (0.15, -0.25, text("\$\\mu= $(mu)\$", :blue, :bottom, 7))
)

gui(), readline()
# ERROR: unable to save file
# savefig(plotContour, "pseudo-potential.png")
