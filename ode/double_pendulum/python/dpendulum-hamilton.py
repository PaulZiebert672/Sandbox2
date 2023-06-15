import numpy as np
import matplotlib.pyplot as plt

from numpy import sin, cos
from scipy.integrate import solve_ivp

t_max = 12*192.0
dt = 0.02

#x_init = [1*np.pi/3, 0*np.pi/2, 0, 0]

e0 = 1.5
psi = 0.95*np.pi
q02_max = np.arccos(1 - e0)
q02 = q02_max*cos(psi)
x_init = [np.arccos((3 - e0 - cos(q02))/2), q02, 0, 0]

def energy(x):
    theta_1, theta_2, p_1, p_2 = x
    cdiff = cos(theta_1 - theta_2)
    E = 0.5*(p_1**2 + 2*p_2**2 - 2*p_1*p_2*cdiff)/(2 - cdiff**2) + 3 - 2*cos(theta_1) - cos(theta_2)
    return E

def dfunc(t, x):
    theta_1, theta_2, p_1, p_2 = x
    sdiff = sin(theta_1 - theta_2)
    cdiff = cos(theta_1 - theta_2)
    detM = 2 - cdiff**2
    W = (sdiff/detM**2)*((p_1**2 + 2*p_2**2)*cdiff - p_1*p_2*(4 - detM))
 
    d_theta_1 = (p_1 - p_2*cdiff)/detM
    d_theta_2 = (2*p_2 - p_1*cdiff)/detM
    d_p_1 = -2*sin(theta_1) + W
    d_p_2 = -sin(theta_2) - W
    return [d_theta_1, d_theta_2, d_p_1, d_p_2]

e0 = energy(x_init)
sol = solve_ivp(dfunc, [0, t_max], x_init, t_eval=np.arange(0, t_max, dt), method="DOP853", rtol=1e-10, atol=1e-10)

q01_max = np.arccos((2 - e0)/2) + 0.5
p01_max = 2*np.sqrt(e0) + 0.1

fig = plt.figure(figsize=(6, 6*1.5))
plt.title("Double pendulum")
plt.axis("equal")
plt.xlim(-q01_max, q01_max)
plt.ylim(-p01_max, p01_max)
plt.xlabel("theta_1")
plt.ylabel("p_1")
plt.grid(True)

plt.plot(sol.y[0], sol.y[2], fillstyle='none', marker='o', markersize=1.0, linestyle='None', alpha=0.15)
xmin, xmax, ymin, ymax = plt.axis()
plt.text(xmin + 0.08*(xmax - xmin), ymax - 0.10*(xmax - xmin), "E = {:.4f}".format(e0))

theta_1, theta_2 = [x_init[0], x_init[1]]
bar = 0.25
x0 = xmax - 0.65
y0 = ymax - 0.25
x1 = x0 + bar*np.sin(theta_1)
y1 = y0 - bar*np.cos(theta_1)
x2 = x1 + bar*np.sin(theta_2)
y2 = y1 - bar*np.cos(theta_2)
line1 = plt.Line2D([x0, x1], [y0, y1], linewidth=3, color='green', alpha=0.65)
line2 = plt.Line2D([x1, x2], [y1, y2], linewidth=3, color='green', alpha=0.65)
circle1 = plt.Circle((x1, y1), radius=0.05, color='green', alpha=0.85)
circle2 = plt.Circle((x2, y2), radius=0.05, color='green', alpha=0.85)
plt.gca().add_artist(circle1)
plt.gca().add_artist(circle2)
plt.gca().add_artist(line1)
plt.gca().add_artist(line2)

fig.savefig('orbit-hamilton.png', dpi=150)

fig = plt.figure(figsize=(8, 8))
plt.title("Double pendulum. Invariant error")
plt.xlabel("Time")
plt.ylabel("Error")
plt.grid(True)

plt.plot(sol.t, energy(sol.y) - e0)
plt.legend(['Energy'])
fig.savefig('error-hamilton.png', dpi=150)
