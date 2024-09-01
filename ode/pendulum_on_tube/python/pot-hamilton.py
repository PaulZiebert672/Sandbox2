import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import bisect
from scipy.integrate import solve_ivp
from scipy.integrate import quad

import potconfig as config

# rescale initial conditions from generalized velocity to generalized momentum
x_init = [config.x_init[0], config.x_init[1]*(1 + config.rho*config.x_init[0])**2]

# constant of motion
def energy(x):
    theta, p = x
    rho = config.rho
    return 0.5*p**2/(1 + rho*theta)**2 + rho*np.sin(theta) + 1 - (1 + rho*theta)*np.cos(theta)

# evolution in time
def pendulum(t, x):
    theta, p = x
    rho = config.rho
    d_theta = p/(1 + rho*theta)**2
    d_p = (rho*p**2)/(1 + rho*theta)**3 - (1 + rho*theta)*np.sin(theta)
    return [d_theta, d_p]

# period of librations
e0 = energy(x_init)
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
    [0, 2*t_period],
    x_init,
    t_eval=np.arange(0, 2*t_period, t_period/config.N_points),
    method="DOP853",
    rtol=1e-10,
    atol=1e-10
)

# plot phase orbit
fig = plt.figure(figsize=(6, 6*1.0))
plt.title("Pendulum on the tube")
plt.axis("equal")
plt.xlabel(r"$\theta$")
plt.ylabel(r"$p$")
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
    xmin + 0.08*(xmax - xmin), ymax - 0.08*(ymax - ymin),
    r"$\rho$ = {:.2f}".format(config.rho)
)
plt.text(
    xmin + 0.08*(xmax - xmin), ymin + 0.08*(ymax - ymin),
    r"$E_0$ = {:.4f}".format(e0) + "\n" + r"$T$ = {:.4f}".format(t_period)
)

plt.show()
fig.savefig('pot-hamilton-orbit.png', dpi=150)
