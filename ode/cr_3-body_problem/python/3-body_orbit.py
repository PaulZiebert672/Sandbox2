# Circular restricted 3-body problem in corotating frame
import numpy as np
import matplotlib.pyplot as plt

from numpy import sqrt
from scipy.integrate import solve_ivp
from matplotlib.patches import Circle

import config as cfg

# Distance to the big body
def r_1(x):
    x_1, x_2, x_3 = x
    mu = cfg.mu
    return sqrt((x_1 + mu)**2 + x_2**2 + x_3**2)

# Distance to the small body
def r_2(x):
    x_1, x_2, x_3 = x
    mu = cfg.mu
    return sqrt((x_1 + mu - 1)**2 + x_2**2 + x_3**2)

# The Jacobi constant
def energy(z):
    x_1, x_2, x_3, u_1, u_2, u_3 = z
    x = [x_1, x_2, x_3]
    mu = cfg.mu
    return 0.5*(u_1**2 + u_2**2 + u_3**2) - (1 - mu)/r_1(x) - mu/r_2(x) - 0.5*((1 - mu)*r_1(x)**2 + mu*r_2(x)**2)

# Differential equations
def dfunc(t, z):
    x_1, x_2, x_3, u_1, u_2, u_3 = z
    x = [x_1, x_2, x_3]
    mu = cfg.mu
    dx_1 = u_1
    dx_2 = u_2
    dx_3 = u_3
    du_1 = 2*u_2 + x_1 - (1 - mu)*(x_1 + mu)/r_1(x)**3 - mu*(x_1 - 1 + mu)/r_2(x)**3
    du_2 = -2*u_1 + x_2 - (1 - mu)*x_2/r_1(x)**3 - mu*x_2/r_2(x)**3
    du_3 = -(1 - mu)*x_3/r_1(x)**3 - mu*x_3/r_2(x)**3
    return [dx_1, dx_2, dx_3, du_1, du_2, du_3]

# Solve equations of motion
e0 = energy(cfg.z_init)
print("J = {}".format(e0))
sol = solve_ivp(dfunc, [0, cfg.t_max], cfg.z_init, t_eval=np.arange(0, cfg.t_max, cfg.dt), method="DOP853", rtol=1e-10, atol=1e-10)

# Plot orbit in corotating frame
fig = plt.figure(figsize=(8, 8))
plt.title("Circular resticted 3-body problem")
plt.axis("equal")
plt.xlabel("x")
plt.ylabel("y")
plt.grid(True)

plt.plot(sol.y[0], sol.y[1], fillstyle='none', marker='o', markersize=1.0, linestyle='None', alpha=0.25)
body1 = Circle((-cfg.mu, 0), radius=0.05, color='darkslateblue', alpha=0.5)
body2 = Circle((1 - cfg.mu, 0), radius=0.02, color='crimson', alpha=0.5)
plt.gca().add_artist(body1)
plt.gca().add_artist(body2)
xmin, xmax, ymin, ymax = plt.axis()
plt.gca().set_xlim([xmin, max(xmax, 1.05)])
plt.text(xmin + 0.01*(xmax - xmin), ymax - 0.05*(xmax - xmin), "mu = {:.6f}\nt_max = {:.6f}".format(cfg.mu, cfg.t_max))
fig.savefig('orbit.png', dpi=150)

# Plot relative error in Jacobi constant value
fig = plt.figure(figsize=(8, 8))
plt.title("CR3BP. Invariant error")
plt.xlabel("Time")
plt.ylabel("Error")
plt.grid(True)

plt.plot(sol.t, energy(sol.y) - e0)
plt.legend(['Energy'])
fig.savefig('error.png', dpi=150)
