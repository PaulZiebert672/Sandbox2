import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp

u0 = [1.0, 1.0, 10.0]
params = [10.0, 28.0, 8/3]

t_step = 0.005
N_max = 4801
t_max = N_max*t_step

def f(t, u):
    x, y, z = u
    sigma, rho, beta = params
    return [sigma*(y - x), x*(rho - z) - y, x*y - beta*z]

sol = solve_ivp(
    f,
    [0, t_max],
    u0,
    t_eval=[n*t_step for n in range(0, N_max)],
    method="DOP853",
    rtol=5e-11,
    atol=1e-11
)

fig = plt.figure(figsize=(8, 8))
# ax = fig.add_subplot(111, projection='3d')
ax = fig.add_subplot()
ax.plot(
    sol.y[0, :],
    # sol.y[1, :],
    sol.y[2, :],
    fillstyle='full',
    marker='o',
    markersize=0.5,
    linestyle='None',
    alpha=0.5
)
label = '%s' % params
plt.suptitle("Lorenz attractor")
plt.title(label, color='grey', size=8)
plt.grid()

plt.show()
fig.savefig("orbit.png", dpi=150)
