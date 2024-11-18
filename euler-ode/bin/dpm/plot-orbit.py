import os, json, yaml
import numpy as np
import matplotlib.pyplot as plt

# Problem invariant
def energy(q, p):
    theta_1, theta_2 = q
    p_1, p_2 = p
    cdiff = np.cos(theta_1 - theta_2)
    return 0.5*(p_1**2 + 2*p_2**2 - 2*p_1*p_2*cdiff)/(2 - cdiff**2) + 3 - 2*np.cos(theta_1) - np.cos(theta_2)

# Configuration
with open('conf/config.json', 'r') as cli_cfg_file:
    cfg = json.load(cli_cfg_file)

if cfg['id'] != "dpm":
    raise ValueError('Configuration id mismatch: {}'.format(cfg['id']))

psi0 = cfg['psi0']
e0 = energy(psi0[0], psi0[1])

with open('conf/dpm/plot-orbit.yaml', 'r') as plot_opt_file:
    opt = yaml.load(plot_opt_file, Loader=yaml.Loader)

# Import calculated points
data = np.genfromtxt(
    os.path.join(opt['src']['dir'], opt['src']['data']),
    delimiter='\t',
    skip_header=1
)

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
plt.show()
fig.savefig(os.path.join(opt['dst']['dir'], opt['dst']['plot']['orbit']['q1p1']), dpi=150)

# Plot invariant error
fig = mk_inv_plot(data[:, 0], data[:, 3])
plt.show()
fig.savefig(os.path.join(opt['dst']['dir'], opt['dst']['plot']['invariant']['error']), dpi=150)
