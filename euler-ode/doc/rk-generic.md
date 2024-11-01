# Runge-Kutta integration methods

Runge-Kutta methods form an important class of methods for the integration of differential equations. A special subclass, the collocation methods, allows for a particularly elegant access to order, symplecticity and continuous output.

## Definition

Consider non-autonomous systems of first-order ordinary differential equations

$$
\dot{y} = f(t, y), \qquad y(t_0) = y_0
$$

Let $b_i, a_{ij}$  where $i, j = 1, \ldots ,s$ be real numbers and let

$$
c_i = \sum_{j=1}^s a_{ij}
$$

An $s$-stage Runge-Kutta method is given by

$$
\begin{align}
i & = & 1, \dots ,s \\
k_i & = & f(t_0 + c_i h, y_0 + h \sum_{j=1}^s a_{ij} k_j) \\
y_1 & = & y_0 +h \sum_{i=1}^s b_i k_i
\end{align}
$$

The coefficients are usually displayed as follows:

$$
\begin{vmatrix}
\mathbf{c} & A \\
& \mathbf{b}^t
\end{vmatrix}
\qquad
A =
\begin{pmatrix}
a_{11} & \cdots & a_{1s} \\
& \vdots \\
a_{s1} & \cdots & a_{ss}
\end{pmatrix}
$$

## Order of method

A Runge-Kutta method has order $p$, if for all sufficiently regular problems the local error $y_1 - y(t_0 + h)$ satisfies

$$
y_1 - y(t_0 + h) = \mathcal{O}(h^{p+1}) \qquad \text{as} \quad h \rightarrow 0
$$

To check the order of a Runge Kutta method, one has to compute the Taylor series expansions of $y(t_0 + h)$ and $y_1$ around to $h = 0$. This leads to the following algebraic conditions for the coefficients for orders 1, 2, and 3:

- $p = 1$ $\qquad \sum_i b_i = 1$
- $p = 2$ $\qquad \sum_i b_i c_i = \frac{1}{2}$
- $p = 3$ $\qquad \sum_i b_i c_i^2 = \frac{1}{3}\qquad$ and $\qquad \sum_{i,j} b_i a_{ij} c_j = \frac{1}{6}$

## Low order methods

### $p = 1$

The explicit and implicit Euler methods

$$
\begin{vmatrix}
0 \\ \\
& 1
\end{vmatrix}
\qquad \text{and} \qquad
\begin{vmatrix}
1 & 1 \\ \\
& 1
\end{vmatrix}
$$

### $p = 2$

The explicit trapezoidal and explicit midpoint rules

$$
\begin{vmatrix}
0 \\ \\
1 & 1 \\
& \frac{1}{2} & \frac{1}{2}
\end{vmatrix}
\qquad \text{and} \qquad
\begin{vmatrix}
0 \\ \\
\frac{1}{2} & \frac{1}{2} \\
& 0 & 1
\end{vmatrix}
$$

The implicit trapezoidal and implicit midpoint rules

$$
\begin{vmatrix}
0 \\ \\
1 & \frac{1}{2} & \frac{1}{2} \\ \\
& \frac{1}{2} & \frac{1}{2}
\end{vmatrix}
\qquad \text{and} \qquad
\begin{vmatrix}
\frac{1}{2} & \frac{1}{2} \\ \\
& 1
\end{vmatrix}
$$

### $p = 4$

4-th order classical method of Kutta

$$
\begin{vmatrix}
0 \\ \\
\frac{1}{2} & \frac{1}{2} \\ \\
\frac{1}{2} & 0 & \frac{1}{2} \\ \\
1 & 0 & 0 & 1 \\ \\
& \frac{1}{6} & \frac{2}{6} & \frac{2}{6} & \frac{1}{6}
\end{vmatrix}
$$

Alternative "3/8" method

$$
\begin{vmatrix}
0 \\ \\
\frac{1}{3} & \frac{1}{3} \\ \\
\frac{2}{3} & -\frac{1}{3} & 1 \\ \\
1 & 1 & -1 & 1 \\ \\
& \frac{1}{8} & \frac{3}{8} & \frac{3}{8} & \frac{1}{8}
\end{vmatrix}
$$
