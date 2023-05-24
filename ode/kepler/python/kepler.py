import numpy as np
import matplotlib.pyplot as plt

from scipy.integrate import solve_ivp

eps = 0.6
N_ppr = 120   # Number of points per rotation
N_rot = 25    # Number of rotations
t_step = 2*np.pi/N_ppr
x_init = [1 - eps, 0, 0, np.sqrt((1 + eps)/(1 - eps))]

def dfunc(t, x):
    res = np.zeros_like(x)
    r = np.hypot(x[0], x[1])
    res[0] = x[2]
    res[1] = x[3]
    res[2] = -x[0]/r**3
    res[3] = -x[1]/r**3
    return res

def energy(x):
    E = 0.5*np.hypot(x[2], x[3])**2 - 1/np.hypot(x[0], x[1])
    return E

def angular(x):
    L = x[0]*x[3] - x[2]*x[1]
    return L

sol = solve_ivp(dfunc, [0, N_rot*2*np.pi], x_init, t_eval=[n*t_step for n in range(0, N_rot*N_ppr + 1)], method="DOP853")

fig = plt.figure(figsize=(8, 8))
plt.title("Kepler problem. Orbit")
plt.axis("equal")
plt.xlabel("x")
plt.ylabel("y")
plt.grid(True)

#plt.scatter(sol.y[0], sol.y[1])
plt.plot(sol.y[0], sol.y[1])
xmin, xmax, ymin, ymax = plt.axis()
plt.text(xmin + 0.05*(xmax - xmin), ymax - 0.03*(xmax - xmin), "eps = {}".format(eps))
fig.savefig('orbit.png', dpi=150)

e0 = energy(x_init)
l0 = angular(x_init)
fig = plt.figure(figsize=(8, 8))
plt.title("Kepler problem. Invariant error")
plt.xlabel("Periods")
plt.ylabel("Error")
plt.grid(True)

plt.plot(sol.t/(2*np.pi), energy(sol.y) - e0)
plt.plot(sol.t/(2*np.pi), angular(sol.y) - l0)
plt.legend(['Energy', 'Angular momentum'])
fig.savefig('error.png', dpi=150)
