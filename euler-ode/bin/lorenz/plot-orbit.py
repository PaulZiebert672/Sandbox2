import os, json, yaml
import numpy as np
import matplotlib.pyplot as plt

# Configuration
with open('conf/config.json', 'r') as cli_cfg_file:
    cfg = json.load(cli_cfg_file)

if cfg['id'] != "lorenz":
    raise ValueError('Configuration id mismatch: {}'.format(cfg['id']))

with open('conf/lorenz/plot-orbit.yaml', 'r') as plot_opt_file:
    opt = yaml.load(plot_opt_file, Loader=yaml.Loader)

# Import calculated points
data = np.genfromtxt(
    os.path.join(opt['src']['dir'], opt['src']['data']),
    delimiter='\t',
    skip_header=1
)

# Plot orbit
def mk_orbit_plot(x, y):
    fig = plt.figure(figsize=(8, 8))
    plt.title("Lorenz attractor")
    plt.axis("equal")
    plt.xlabel("$x$")
    plt.ylabel("$z$")
    plt.grid(True)
    plt.plot(
        x, y,
        fillstyle='none',
        marker='o',
        markersize=1.5,
        linestyle='None',
        alpha=0.45
    )
    return fig

# Plot orbit
fig = mk_orbit_plot(data[:, 1], data[:, 2])
plt.show()
fig.savefig(os.path.join(opt['dst']['dir'], opt['dst']['plot']['orbit']['xz']), dpi=150)
