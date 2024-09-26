import numpy as np
import matplotlib.pyplot as plt

from matplotlib.patches import Circle

import config as cfg

r_1 = lambda x, y: np.sqrt((x + cfg.mu)**2 + y**2)
r_2 = lambda x, y: np.sqrt((x - 1 + cfg.mu)**2 + y**2)

limit = 1.5
delta = 0.005
x = np.arange(-limit, limit, delta)
y = np.arange(-limit, limit, delta)
X, Y = np.meshgrid(x, y)

Z = - (1 - cfg.mu)/r_1(X, Y) - cfg.mu/r_2(X, Y) - 0.5*((1 - cfg.mu)*r_1(X, Y)**2 + cfg.mu*r_2(X, Y)**2)

fig = plt.figure(figsize=(8, 8))
plt.title("Potential energy in circular resticted 3-body problem")
plt.axis("equal")
plt.xlabel("x")
plt.ylabel("y")
plt.grid(True, linestyle = '--', linewidth = 0.2)

plt.contour(X, Y, Z, levels=np.arange(-1.75, -1.5, 0.005), linewidths=0.1)
body1 = Circle((-cfg.mu, 0), radius=0.03, color='darkslateblue', alpha=0.5)
body2 = Circle((1 - cfg.mu, 0), radius=0.01, color='crimson', alpha=0.5)
plt.gca().add_artist(body1)
plt.gca().add_artist(body2)
xmin, xmax, ymin, ymax = plt.axis()
plt.text(xmin + 0.02*(xmax - xmin), ymax - 0.06*(xmax - xmin), "mu = {:.6f}".format(cfg.mu))

fig.savefig('pseudo-potential.pdf', dpi=150)
