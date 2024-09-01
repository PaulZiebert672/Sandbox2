import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import bisect
from scipy.integrate import solve_ivp
from scipy.integrate import quad

import mpconfig as config

# constant of motion
def energy(x):
    theta, omega = x
    return 0.5*omega**2 + 1 - np.cos(theta)

# evolution in time
def pendulum(t, x):
    theta, omega = x
    d_theta = omega
    d_omega = -np.sin(theta)
    return [d_theta, d_omega]

# period of librations
e0 = energy(config.x_init)
print("E0 = ", e0)
amplitude = lambda theta: e0 - energy([theta, 0])
theta_0 = bisect(amplitude, 0, np.pi)
print("theta_0 = ", theta_0)
result = quad(lambda theta: 1/np.sqrt(amplitude(theta)), 0, theta_0)
t_period = 4*result[0]/np.sqrt(2)
print("T = ", t_period)

# ODE numerical solution
sol = solve_ivp(
    pendulum,
    [0, 2*t_period],
    config.x_init,
    t_eval=np.arange(0, 2*t_period, t_period/config.N_points),
    method="DOP853",
    rtol=1e-10,
    atol=1e-10
)

# plot phase orbit
fig = plt.figure(figsize=(6, 6*1.0))
plt.title("Mathematical pendulum")
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
    xmax - 0.20*(xmax - xmin), ymin + 0.08*(ymax - ymin),
    r"$E_0$ = {:.4f}".format(e0) + "\n" + r"$T$ = {:.4f}".format(t_period)
)

plt.show()
fig.savefig('mp-lagrange-orbit.png', dpi=150)
