import numpy as np
from scipy.optimize import bisect
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

import potconfig as config

def energy(x):
    theta, omega = x
    rho = config.rho
    return 0.5*((1 + rho*theta)**2)*omega**2 + rho*np.sin(theta) + 1 - (1 + rho*theta)*np.cos(theta)

e0 = energy(config.x_init)
print("E0 = ", e0)
amplitude = lambda theta: e0 - energy([theta, 0])
theta_01 = bisect(amplitude, 0, np.pi/2)
theta_02 = bisect(amplitude, -np.pi/2, 0)
print("theta_01 : theta_02 = ", theta_01, " : ", theta_02)

circle1 = plt.Circle((0, 0), config.rho, color='mediumaquamarine')
plt.gca().add_patch(circle1)

arc1 = mpatches.Arc(
    (0, 0),
    2*config.rho,
    2*config.rho,
    angle=0,
    theta1=0,
    theta2=90,
    color='darkslateblue',
    linewidth=2
)
plt.gca().add_patch(arc1)

t = np.linspace(theta_01, theta_02, np.floor_divide(config.N_points, 2))
plt.plot(
    config.rho*np.cos(t) + (1 + config.rho*t)*np.sin(t), 
    config.rho*np.sin(t) - (1 + config.rho*t)*np.cos(t),
    color='grey',
    linestyle='dashed',
    linewidth=2,
    alpha=0.5
)

line1 = plt.plot(
    [config.rho, config.rho],
    [0, -1],
    color='darkslateblue',
    linewidth=2
)

circle2 = plt.Circle((config.rho, -1), 0.03, color='darkslateblue')
plt.gca().add_patch(circle2)

plt.axis("equal")
plt.title("Pendulum on the tube")
plt.xlabel(r"$x$")
plt.ylabel(r"$y$")

xmin, xmax, ymin, ymax = plt.axis()
plt.text(
    xmin + 0.08*(xmax - xmin), ymax - 0.08*(ymax - ymin),
    r"$\rho$ = {:.2f}".format(config.rho)
)
plt.text(
    xmin + 0.08*(xmax - xmin), ymin + 0.08*(ymax - ymin),
    r"$E_0$ = {:.4f}".format(e0)
)

plt.show()
