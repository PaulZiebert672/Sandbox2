import numpy as np
import matplotlib.pyplot as plt

from numpy import sin, cos
from scipy.integrate import solve_ivp

t_max = 2*192.0
dt = 0.02

x_init = [0, np.pi/2, 0, 0]

def energy(x):
    theta_1 = x[0]
    theta_2 = x[1]
    u_1 = x[2]   # \dot{\theta_1}
    u_2 = x[3]   # \dot{\theta_2}
    E = u_1**2 + (1/2)*u_2**2 + u_1*u_2*cos(theta_1 - theta_2) + 3 - 2*cos(theta_1) - cos(theta_2)
    return E

def dfunc(t, x):
    theta_1 = x[0]
    theta_2 = x[1]
    u_1 = x[2]   # \dot{\theta_1}
    u_2 = x[3]   # \dot{\theta_2}
    sdiff = sin(theta_1 - theta_2)
    cdiff = cos(theta_1 - theta_2)
    detM = 2 - cdiff**2
 
    res = np.zeros_like(x)
    res[0] = u_1
    res[1] = u_2
    res[2] = (sin(theta_2)*cdiff - 2*sin(theta_1) - sdiff*(u_2**2 + cdiff*u_1**2)) / detM
    res[3] = (2*sin(theta_1)*cdiff -2*sin(theta_2) + sdiff*(2*u_1**2 + cdiff*u_2**2)) / detM
    return res

e0 = energy(x_init)
sol = solve_ivp(dfunc, [0, t_max], x_init, t_eval=np.arange(0, t_max, dt), method="DOP853", rtol=1e-10, atol=1e-10)

fig = plt.figure(figsize=(8, 8))
plt.title("Double pendulum")
plt.axis("equal")
plt.xlabel("theta_1")
plt.ylabel("u_1")
plt.grid(True)

plt.plot(sol.y[0], sol.y[2], fillstyle='none', marker='o', markersize=1.0, linestyle='None', alpha=0.25)
xmin, xmax, ymin, ymax = plt.axis()
plt.text(xmin + 0.05*(xmax - xmin), ymax - 0.03*(xmax - xmin), "E = {}".format(e0))
fig.savefig('orbit-lagrange.png', dpi=150)

fig = plt.figure(figsize=(8, 8))
plt.title("Double pendulum. Invariant error")
plt.xlabel("Time")
plt.ylabel("Error")
plt.grid(True)

plt.plot(sol.t, energy(sol.y) - e0)
plt.legend(['Energy'])
fig.savefig('error-lagrange.png', dpi=150)
