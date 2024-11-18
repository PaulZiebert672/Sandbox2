import os, json, yaml
import numpy as np
import matplotlib.pyplot as plt

from matplotlib.patches import Circle

# Configuration
with open('conf/config.json', 'r') as cli_cfg_file:
    cfg = json.load(cli_cfg_file)

if cfg['id'] != "cr3bp":
    raise ValueError('Configuration id mismatch: {}'.format(cfg['id']))

mu = cfg['params']['mu']
with open('conf/cr3bp/plot-orbit.yaml', 'r') as plot_opt_file:
    opt = yaml.load(plot_opt_file, Loader=yaml.Loader)

# Import calculated points
data_phi = np.genfromtxt(
    os.path.join(opt['src']['dir'], opt['src']['data']),
    delimiter='\t',
    skip_header=1
)

# Plot orbit
def mk_orbit_plot(x, y, name):
    fig = plt.figure(figsize=(8, 8))
    plt.title(". ".join(("Circular restricted 3-body problem", name)))
    plt.axis("equal")
    plt.xlabel("x")
    plt.ylabel("y")
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
    # plt.gca().set_xlim([xmin, max(xmax, 1.05)])
    plt.text(
        xmin + 0.78*(xmax - xmin),
        ymax - 0.08*(ymax - ymin),
        "$\\mu$ = 1:{:.2f}".format(1/mu)
    )
    return fig

# Transformation to Ptolemy view
def rotate_orbit(x):
    t = x[0]
    return [t, x[1]*np.cos(t) - x[2]*np.sin(t) + mu*np.cos(t), x[1]*np.sin(t) + x[2]*np.cos(t) + mu*np.sin(t)]

# Plot orbit in corotating frame
fig = mk_orbit_plot(data_phi[:, 1], data_phi[:, 2], "Corotating frame")
body1 = Circle((-mu, 0), radius=0.02, color='darkslateblue', alpha=0.5)
body2 = Circle((1 - mu, 0), radius=0.01, color='crimson', alpha=0.5)
plt.gca().add_artist(body1)
plt.gca().add_artist(body2)
plt.show()
fig.savefig(os.path.join(opt['dst']['dir'], opt['dst']['plot']['orbit']['corotating']), dpi=150)

data_psi = np.apply_along_axis(rotate_orbit, axis=1, arr=data_phi)

# Plot orbit in Ptolemy view
fig = mk_orbit_plot(data_psi[:, 1], data_psi[:, 2], "Ptolemy view")
body1 = Circle((0, 0), radius=0.02, color='darkslateblue', alpha=0.5)
plt.gca().add_artist(body1)
plt.show()
fig.savefig(os.path.join(opt['dst']['dir'], opt['dst']['plot']['orbit']['ptolemy']), dpi=150)
