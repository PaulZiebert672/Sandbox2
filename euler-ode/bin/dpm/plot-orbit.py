import os
import numpy as np
import matplotlib.pyplot as plt

# Configuration
e0 = 1.5
src_data = "orbit09.tsv"
src_dir = "data/dpm"
dest_dir = "plot/dpm"
dest_orbit_plot = "orbit-q1p1.png"
dest_inv_plot = "inv-error.png"

# Import calculated points
data = np.genfromtxt(os.path.join(src_dir, src_data), delimiter='\t', skip_header=1)

# Plot orbit
def mk_orbit_plot(x, y):
    fig = plt.figure(figsize=(6, 8))
    plt.title("Double pendulum")
    plt.axis("equal")
    plt.xlabel("$\\theta_1$")
    plt.ylabel("$p_1$")
    plt.grid(True)
    plt.plot(
        x, y,
        fillstyle='none',
        marker='o',
        markersize=1.0,
        linestyle='None',
        alpha=0.25
    )
    xmin, xmax, ymin, ymax = plt.axis()
    plt.text(
        xmin - 0.15*(xmax - xmin),
        ymax - 0.05*(ymax - ymin),
        "$E$ = {:.4f}".format(e0)
    )
    return fig

def mk_inv_plot(x, y):
    n_start = divmod(2*len(x), 3)[0]
    n_stop = divmod(17*len(x), 24)[0]
    fig = plt.figure(figsize=(8, 8))
    plt.subplot(2, 1, 1)
    plt.title("Double pendulum. Invariant error")
    plt.xlabel("$t$")
    plt.ylabel("$\\delta E$")
    plt.grid(True)
    plt.plot(
        x, y,
        alpha=0.8
    )
    plt.subplot(2, 1, 2)
    plt.xlabel("$t$")
    plt.ylabel("$\\delta E$")
    plt.grid(True)
    plt.plot(
        x[n_start:n_stop], y[n_start:n_stop],
        alpha=0.8
    )
    return fig

# Plot orbit
fig = mk_orbit_plot(data[:, 1], data[:, 2])
# plt.show()
fig.savefig(os.path.join(dest_dir, dest_orbit_plot), dpi=150)

# Plot invariant error
fig = mk_inv_plot(data[:, 0], data[:, 3])
# plt.show()
fig.savefig(os.path.join(dest_dir, dest_inv_plot), dpi=150)
