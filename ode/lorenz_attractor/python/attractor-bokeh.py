from scipy.integrate import solve_ivp
from bokeh.plotting import figure, show

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
x = sol.y[0, :]
y = sol.y[1, :]
z = sol.y[2, :]

plot = figure(title="Lorenz attractor", background_fill_color="#fafafa")
plot.line(x, z, line_color="#4292C6", line_alpha=0.8, line_width=1.5)
show(plot)
