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
k_i & = f(t_0 + c_i h, y_0 + h \sum_{j=1}^s a_{ij} k_j) \\
y_1 & = y_0 + h \sum_{i=1}^s b_i k_i \\
t_1 & = t_0 + h
\end{align}
$$

The coefficients are usually displayed as follows:

$$
\begin{array}{c|c}
\mathbf{c} & A \\
\hline
& \mathbf{b}^t
\end{array}
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
\begin{array}{c|c}
0 \\
\hline
& 1
\end{array}
\qquad \text{and} \qquad
\begin{array}{c|c}
1 & 1 \\
\hline
& 1
\end{array}
$$

### $p = 2$

The explicit trapezoidal and explicit midpoint rules

$$
\begin{array}{c|cc}
0 \\
1 & 1 \\
\hline
& 1/2 & 1/2
\end{array}
\qquad \text{and} \qquad
\begin{array}{c|cc}
0 \\
1/2 & 1/2 \\
\hline
& 0 & 1
\end{array}
$$

The implicit trapezoidal and implicit midpoint rules

$$
\begin{array}{c|cc}
0 \\
1 & 1/2 & 1/2 \\
\hline
& 1/2 & 1/2
\end{array}
\qquad \text{and} \qquad
\begin{array}{c|cc}
1/2 & 1/2 \\
\hline
& 1 \\
\end{array}
$$

### $p = 4$

4-th order classical method of Kutta and alternative "3/8" method

$$
\begin{array}{c|cccc}
0 \\
1/2 & 1/2 \\
1/2 & 0 & 1/2 \\
1 & 0 & 0 & 1 \\
\hline
& 1/6 & 2/6 & 2/6 & 1/6
\end{array}
\qquad \text{and} \qquad
\begin{array}{c|cccc}
0 \\
1/3 & 1/3 \\
2/3 & -1/3 & 1 \\
1 & 1 & -1 & 1 \\
\hline
& 1/8 & 3/8 & 3/8 & 1/8
\end{array}
$$
