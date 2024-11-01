# Collocation  methods

Collocation  methods can be interpreted as being  generated  by a quadratic function which agrees in direction with that indicated by the differential equation at two points $t_0$ and $t_1$. An interesting feature of collocation methods is that we not only get a discrete set of approximations, but also a continuous approximation to the solution.

## Definition

Let $c_1, \ldots ,c_s$ be distinct real numbers (usually $0 \le c_i \le 1$). The collocation polynomial $u(t)$ is a polynomial of degree $s$ satisfying

$$
\begin{align}
i & = & 1, \ldots ,s \\
u(t_0) & = & y_0 \\
u(t_0 + c_i h) & = & f(t_0 + c_i h, u(t_0 + c_i h))
\end{align}
$$

and the numerical solution of the collocation method is defined by $y_1 = u(t_0 + h)$.

## Low order methods

For $s = 1$, the collocation polynomial has to be of the form

$$
\begin{align}
u(t) & = & y_0 + (t - t_0) k \\
k & = & f(t_0 + c_1 h, y_0 + h c_1 k)
\end{align}
$$

We see that the explicit and implicit Euler methods and the midpoint rule are collocation methods with $c_1 = 0$, $c_1 = 1$ and $c_1 = \frac{1}{2}$, respectively.

For $s = 2$ and $c_1 = 0, c_2 = 1$ we  find the implicit  trapezoidal rule. The choice of Hammer & Hollingsworth for the collocation points is $c_{1,2} = \frac{1}{2} \pm \frac{\sqrt{3}}{6}$, the _Gaussian quadrature_ nodes. The corresponding method is of order $p = 4$.
