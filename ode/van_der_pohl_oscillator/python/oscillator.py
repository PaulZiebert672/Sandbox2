import matplotlib.pyplot as plt

from scipy.integrate import solve_ivp

u0 = [1.0, 0.0]
mu = 1.0

t_step = 0.01
N_max = 10000
t_max = N_max*t_step

def f(t, u):
    x, y = u
    return [y, mu*(1 - x**2)*y - x]

sol = solve_ivp(
    f,
    [0, t_max],
    u0,
    t_eval=[n*t_step for n in range(0, N_max)],
    method="DOP853",
    rtol=1e-10,
    atol=1e-9
)

fig = plt.figure(figsize=(6, 6))
plt.plot(
    sol.y[0],
    sol.y[1],
    fillstyle='full',
    marker='o',
    markersize=0.5,
    linestyle='None',
    alpha=0.5
)
label = '$\mu$ = %s' % mu
plt.suptitle("Van der Pohl oscillator")
plt.title(label, color='grey', size=8)
plt.axis("equal")
plt.xlabel(r"$x$")
plt.ylabel(r"$\dfrac{dx}{dt}$")
plt.grid(True)

plt.show()
fig.savefig("orbit.png", dpi=150)
