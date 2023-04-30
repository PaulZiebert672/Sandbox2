using Elliptic;
using Plots;
using LaTeXStrings;

N = 96

a = Array{Float64}(undef, N, 2)
for i in 1:N
    a[i, 1] = (i - 1)*2/N
    a[i, 2] = pi/(2*Elliptic.K((i - 1)/N))
end

gr(size = (180, 270), linewidth = 2)
Plots.scalefontsizes(0.45)
p = plot(
    a[:, 1],
    a[:, 2],
    plot_title = L"\mathrm{Mathematical \quad pendulum}",
    xlimits=(0, 2),
    ylimits=(0, 1),
    xlabel = L"\mathcal{E}",
    ylabel = L"\omega(\mathcal{E})",
    legend = false,
    dpi = 300
)
savefig(p, "pendulum-libration.png")
