# Collocation  methods

Collocation  methods can be interpreted as being  generated  by a quadratic function which agrees in direction with that indicated by the differential equation at two points $t_0$ and $t_1$. An interesting feature of collocation methods is that we not only get a discrete set of approximations, but also a continuous approximation to the solution.

## Definition

Let $c_1, \ldots ,c_s$ be distinct real numbers (usually $0 \le c_i \le 1$). The collocation polynomial $u(t)$ is a polynomial of degree $s$ satisfying

$$
\begin{align}
i & = 1, \ldots ,s \\
u(t_0) & = y_0 \\
\dot{u}(t_0 + c_i h) & = f(t_0 + c_i h, u(t_0 + c_i h))
\end{align}
$$

and the numerical solution of the collocation method is defined by $y_1 = u(t_0 + h)$.

## Low order methods

For $s = 1$, the collocation polynomial has to be of the form

$$
\begin{align}
u(t) & = y_0 + (t - t_0) k \\
k & = f(t_0 + c_1 h, y_0 + h c_1 k)
\end{align}
$$

We see that the explicit and implicit Euler methods and the midpoint rule are collocation methods with $c_1 = 0$, $c_1 = 1$ and $c_1 = \frac{1}{2}$, respectively.

For $s = 2$ and $c_1 = 0, c_2 = 1$ we  find the implicit  trapezoidal rule. The choice of Hammer & Hollingsworth for the collocation points is $c_{1,2} = \frac{1}{2} \pm \frac{\sqrt{3}}{6}$, the _Gaussian quadrature_ nodes. The corresponding method is of order $p = 4$.

## Theorem

The collocation method is equivalent to the $s$-stage Runge-Kutta method with the coefficients

$$
\begin{align}
a_{ij} & = \int\limits_0^{c_i} \ell_j(\tau) \, \mathrm{d} \tau \\
b_i & = \int\limits_0^1 \ell_i(\tau) \, \mathrm{d} \tau
\end{align}
$$

where $\ell_j(\tau)$ is the Lagrange polynomial

$$
\ell_n(\tau) = \prod_{k \ne n} \dfrac{\tau - c_n}{c_k - c_n}
$$

## Gauss and Lobatto collocations

### Gauss methods

If we take $c_1, \ldots, c_s$ as the zeros of the $s$-th shifted Legendre polynomial

$$
\dfrac{\mathrm{d^s}}{\mathrm{d}x^s}\bigg( x^s (x - 1)^s\bigg)
$$

then the Runge–Kutta (or collocation) method based on these nodes has order $2s$.

### $s = 1$

The implicit midpoint rule.

### $s = 2$

Gauss collocation of order $4$

$$
\begin{array}{c|cc}
\frac{1}{2} - \frac{\sqrt{3}}{6} & \frac{1}{4} & \frac{1}{4} - \frac{\sqrt{3}}{6} \\ \\
\frac{1}{2} + \frac{\sqrt{3}}{6} & \frac{1}{4} + \frac{\sqrt{3}}{6} & \frac{1}{4} \\ \\
\hline \\
& \frac{1}{2} & \frac{1}{2}
\end{array}
$$

### $s = 3$

Gauss collocation of order $6$

$$
\begin{array}{c|ccc}
\frac{1}{2} - \frac{\sqrt{10}}{15} & \frac{5}{36} & \frac{2}{9} - \frac{\sqrt{15}}{15} & \frac{5}{36} - \frac{\sqrt{15}}{30} \\ \\
\frac{1}{2} &  \frac{5}{36} + \frac{\sqrt{15}}{24} & \frac{2}{9} & \frac{5}{36} - \frac{\sqrt{15}}{24} \\ \\
\frac{1}{2} + \frac{\sqrt{10}}{15} & \frac{5}{36} + \frac{\sqrt{15}}{30} & \frac{2}{9} + \frac{\sqrt{15}}{15} & \frac{5}{36} \\ \\
\hline \\
& \frac{5}{18} & \frac{4}{9} & \frac{5}{18}
\end{array}
$$

### Lobatto IIIA methods

Lobatto quadrature formulas have the highest possible order with $c_1 = 0$ and $c_s = 1$. Under these conditions, the nodes must be the zeros of

$$
\dfrac{\mathrm{d^{s-2}}}{\mathrm{d}x^{s-2}}\bigg( x^s (x - 1)^s\bigg)
$$

and the quadrature order is $p = 2s − 2$. The corresponding collocation methods are called, for historical reasons, Lobatto IIIA methods.

### $s = 2$

The implicit trapezoidal rule.

### $s = 3$

### $s = 4$
