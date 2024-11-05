# Embedded methods

The embedded methods are designed to produce an estimate of the local truncation error of a single Runge–Kutta step, and as result, allow to control the error with adaptive stepsize. This is done by having two methods in the tableau, one with order $p$ and one with order $p - 1$.

The lower-order step is given by

$$
y^*_1 = y_0 + h \sum_{i=1}^s k_i b^*_i
$$

where the $k_i$ are the same as for the higher order method. Then the error is

$$
\epsilon = y_1 - y^*_1 = h \sum_{i=1}^s k_i (b_i - b^*_i) = \mathcal{O}(h^{p+1}) \quad \text{as} \quad h \rightarrow 0
$$

The Butcher Tableau for this kind of method is

$$
\begin{array}{c|c}
\mathbf{c} & A \\
\hline
& \mathbf{b}^t \\
& \mathbf{b^*}^t
\end{array}
$$

### Bogacki–Shampine _ode23_

$$
\begin{array}{c|cccc}
0 \\
1/2 & 1/2 \\
3/4 & 0 & 3/4 \\
1 & 2/9 & 1/3 & 4/9 \\
\hline
& 2/9 & 1/3 & 4/9 \\
& 7/24 & 1/4 & 1/3 & 1/8
\end{array}
$$

### Fehlberg RKF45

$$
\begin{array}{c|cccccc}
0 \\ \\
\frac{1}{4} & \frac{1}{4} \\ \\
\frac{3}{8} & \frac{3}{32} & \frac{9}{32} \\ \\
\frac{12}{13} & \frac{1932}{2197} & -\frac{7200}{2197} & \frac{7296}{2197} \\ \\
1 & \frac{439}{216} & -8 & \frac{3680}{513} & -\frac{845}{4104} \\ \\
\frac{1}{2} & -\frac{8}{27} & 2 & -\frac{3544}{2565} & \frac{1859}{4104} & -\frac{11}{40} \\ \\
\hline \\
& \frac{16}{135} & 0 & \frac{6656}{12825} & \frac{28561}{56430} & -\frac{9}{50} & \frac{2}{55} \\ \\
& \frac{25}{216} & 0 & \frac{1408}{2565} & \frac{2197}{4104} & -\frac{1}{5}
\end{array}
$$

### Dormand-Prince _ode45_

$$
\begin{array}{c|ccccccc}
0 \\ \\
\frac{1}{5} & \frac{1}{5} \\ \\
\frac{3}{10} & \frac{3}{40} & \frac{9}{40} \\ \\
\frac{4}{5} & \frac{44}{45} & -\frac{56}{15} & \frac{32}{9} \\ \\
\frac{8}{9} & \frac{19372}{6561} & -\frac{25360}{2187} & \frac{64448}{6561} & -\frac{212}{729} \\ \\
1 & \frac{9017}{3168} & -\frac{355}{33} & \frac{46732}{5247} & \frac{49}{176} & -\frac{5103}{18656} \\ \\
1 & \frac{35}{384} & 0 & \frac{500}{1113} & \frac{125}{192} & -\frac{2187}{6784} & \frac{11}{84} \\ \\
\hline \\
& \frac{35}{384} & 0 & \frac{500}{1113} & \frac{125}{192} & -\frac{2187}{6784} & \frac{11}{84} \\ \\
& \frac{5179}{57600} & 0 & \frac{7571}{16695} & \frac{393}{640} & -\frac{92097}{339200} & \frac{187}{2100} & \frac{1}{40}
\end{array}
$$
