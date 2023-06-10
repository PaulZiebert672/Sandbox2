# Double pendulum. Poincare section
import numpy as np
import matplotlib.pyplot as plt

from numpy import sin, cos
from numpy.polynomial import Polynomial
from scipy.integrate import solve_ivp
from datetime import datetime
from typing import List

# Time span
dt = 0.02
t_max = 12*192.0

N_max = np.floor(t_max/dt) + 1

def energy(x):
    theta_1, theta_2, p_1, p_2 = x
    cdiff = cos(theta_1 - theta_2)
    return 0.5*(p_1**2 + 2*p_2**2 - 2*p_1*p_2*cdiff)/(2 - cdiff**2) + 3 - 2*cos(theta_1) - cos(theta_2)

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

def is_section_limit(x_start, x_finish):
    theta_1_s, theta_2_s, p_1_s, p_2_s = x_start
    theta_1_f, theta_2_f, p_1_f, p_2_f = x_finish
    if theta_2_s*theta_2_f <= 0:
        return True
    return False

def legendre_poly(k:int) -> Polynomial:
    coeff = np.array([[-1/16, 1/24, 1/4, -1/6], [9/16, -9/8, -1/4, 1/2], [9/16, 9/8, -1/4, -1/2], [-1/16, -1/24, 1/4, 1/6]])
    return Polynomial(coeff[k])

def get_interpolation_poly(y:List[float]) -> Polynomial:
    res = Polynomial(np.zeros(len(y)))
    for i in range(len(y)):
        poly = legendre_poly(i)
        res = res + y[i]*poly
    return res

def newton_solve(t0:float, poly:Polynomial) -> float:
    EPS = 5.0e-9
    LIMIT = 50
    count = 1
    deriv = poly.deriv()
    while np.abs(poly(t0)) > EPS and count < LIMIT:
        #print('    ::> count={}, t0={}, f(t0)={}'.format(count, t0, f(t0)))
        count += 1
        t0 = t0 - poly(t0)/deriv(t0)
    #print('  ::> count={}, t0={}, f(t0)={}'.format(count, t0, poly(t0)))
    return t0

def find_section_data(t, x):
    res = []
    for k in range(len(t)):
        if k == 0:
            continue
        if not is_section_limit(x[:, k], x[:, k - 1]):
            continue
        #print('  ~~> section limit: from {} to {}'.format(t[k - 1], t[k]))
        if k < 2 or k > len(t) - 2:
            print('  **> warning: too close to the edge')
            continue
        poly = get_interpolation_poly([x[1, k - 2], x[1, k - 1], x[1, k], x[1, k + 1]])
        #print([poly(-3/2), poly(-1/2), poly(1/2), poly(3/2)])
        t0 = newton_solve(-1/2, poly)
        entry = []
        for n in range(0, 4):
            poly = get_interpolation_poly([x[n, k - 2], x[n, k - 1], x[n, k], x[n, k + 1]])
            entry.append(poly(t0))
        if entry[3] > 0.5*entry[2]*cos(entry[0]):
            res.append(entry)
    return np.array(res)

def plot_section(x0_preset, e0, t_max, dt):
    fig = plt.figure(figsize=(6, 8))
    plt.title("Double pendulum. Poincare section")
    plt.axis("equal")
    #plt.xlim(-2, 2)
    #plt.ylim(-2, 2)
    plt.xlabel("theta_1")
    plt.ylabel("p_1")
    plt.grid(True)

    for m in range(len(x0_preset)):
        x0 = x0_preset[m]
        print("{} - {}/{} - x0:{}".format(datetime.now().strftime("%d/%m/%Y %H:%M:%S"), m + 1, len(x0_preset), x0))
        sol = solve_ivp(dfunc, [0, t_max], x0, t_eval=np.arange(0, t_max, dt), method="DOP853", rtol=1e-10, atol=1e-10)
        print("{} - {}/{} - integration complete".format(datetime.now().strftime("%d/%m/%Y %H:%M:%S"), m + 1, len(x0_preset)))
        res = find_section_data(sol.t, sol.y)
        print("{} - {}/{} - interpolation complete: {} points".format(datetime.now().strftime("%d/%m/%Y %H:%M:%S"), m + 1, len(x0_preset), len(res)))
        plt.plot(res[:, 0], res[:, 2], fillstyle='none', marker='.', markersize=0.5, linestyle='None', alpha=0.45)
    xmin, xmax, ymin, ymax = plt.axis()
    plt.text(xmin + 0.01*(xmax - xmin), ymax - 0.05*(xmax - xmin), "E = {:.4f}".format(e0))
    fig.savefig('section-hamilton.png', dpi=150)


# Main procedure
e0 = 1.0
N_steps = 60

q02_max = np.arccos(1 - e0)
x0_preset = []
for psi in np.arange(0, np.pi, np.pi/N_steps):
    q02 = q02_max*cos(psi)
    x0_current = [np.arccos((3 - e0 - cos(q02))/2), q02, 0, 0]
    x0_preset.append(x0_current)

for s in range(len(x0_preset)):
    EPS = 1.0e-8
    x0 = x0_preset[s]
    if np.abs(e0 - energy(x0) > EPS):
        print("**> warn: energy(x0) != e0", energy(x0), x0)
plot_section(x0_preset, e0, t_max, dt)
