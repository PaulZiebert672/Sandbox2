import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import bisect
from scipy.integrate import solve_ivp
from scipy.integrate import quad

import potconfig as config

# constant of motion
def energy(x):
    theta, omega = x
    rho = config.rho
    return 0.5*((1 + rho*theta)**2)*omega**2 + rho*np.sin(theta) + 1 - (1 + rho*theta)*np.cos(theta)

# evolution in time
def pendulum(t, x):
    theta, omega = x
    rho = config.rho
    d_theta = omega
    d_omega = -(rho*omega**2 + np.sin(theta))/(1 + rho*theta)
    return [d_theta, d_omega]

# period of librations
e0 = energy(config.x_init)
print("E0 = ", e0)
amplitude = lambda theta: e0 - energy([theta, 0])
theta_01 = bisect(amplitude, 0, np.pi/2)
theta_02 = bisect(amplitude, -np.pi/2, 0)
print("theta_01 : theta_02 = ", theta_01, " : ", theta_02)
kernel = lambda theta: (1 + config.rho*theta)/np.sqrt(amplitude(theta))
result1 = quad(kernel, 0, theta_01)
result2 = quad(kernel, theta_02, 0)
t_period = np.sqrt(2)*(result1[0] + result2[0])
print("T = ", t_period)

# ODE numerical solution
sol = solve_ivp(
    pendulum,
    [0, config.K_cycles*t_period],
    config.x_init,
    t_eval=np.arange(0, config.K_cycles*t_period, t_period/config.N_points),
    method="DOP853",
    rtol=1e-10,
    atol=1e-10
)

# plot phase orbit
fig = plt.figure(figsize=(6, 6*1.0))
plt.title("Pendulum on the tube. Lagrangian dynamics")
plt.axis("equal")
plt.xlabel(r"$\theta$")
plt.ylabel(r"$\omega$")
plt.grid(True)
plt.plot(
    sol.y[0],
    sol.y[1],
    fillstyle='none',
    marker='o',
    markersize=1.5,
    linestyle='None',
    alpha=0.5
)
xmin, xmax, ymin, ymax = plt.axis()
plt.text(
    xmax - 0.20*(xmax - xmin), ymax - 0.08*(ymax - ymin),
    r"$\rho$ = {:.2f}".format(config.rho)
)
plt.text(
    xmax - 0.20*(xmax - xmin), ymin + 0.08*(ymax - ymin),
    r"$E_0$ = {:.4f}".format(e0) + "\n" + r"$T$ = {:.4f}".format(t_period)
)

plt.show()
fig.savefig('pot-lagrange-orbit.png', dpi=150)

# plot relative error in energy value
fig = plt.figure(figsize=(5*1.5, 5))
plt.title("Pendulum on the tube. Invariant error")
plt.xlabel("Time")
plt.ylabel("Relative energy error")
plt.grid(True)

plt.plot(sol.t, (energy(sol.y) - e0)/e0)
plt.legend(['Energy'])
xmin, xmax, ymin, ymax = plt.axis()
plt.text(
    xmin + 0.08*(xmax - xmin), ymax - 0.08*(ymax - ymin),
    r"$\rho$ = {:.2f}".format(config.rho)
)
plt.text(
    xmin + 0.08*(xmax - xmin), ymin + 0.08*(ymax - ymin),
    r"$E_0$ = {:.4f}".format(e0) + "\n" + r"$T$ = {:.4f}".format(t_period)
)

plt.show()
fig.savefig('pot-lagrange-error.png', dpi=150)
