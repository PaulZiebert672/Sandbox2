# Double pendulum

## Lagrange's function

Lagrange's function is expressed via kinetic and potential energy

$$
\begin{equation}
\begin{split}
\mathcal{L}(\dot{\theta_i}, \theta_i) = & T(\dot{\theta_i}, \theta_i) - U(\theta_i) \\
T = & \dfrac{1}{2}m_1 \Big( \dot{x_1}^2 + \dot{y_1}^2 \Big) + \dfrac{1}{2}J_1\dot{\theta_1}^2 \\
  + & \dfrac{1}{2}m_2 \Big( \dot{x_2}^2 + \dot{y_2}^2 \Big) + \dfrac{1}{2}J_2\dot{\theta_2}^2 \\
U = & m_1 g y_1 + m_2 g y_2
\end{split}
\end{equation}
$$

### Kinematical relations

Kinematical relations are needed to represent energy values via the generalized coordinates

$$
\begin{equation}
\begin{split}
x_1 = & h_1\sin\theta_1 \\
y_1 = & -h_1\cos\theta_1 \\
x_2 = & l_1\sin\theta_1 + h_2\sin\theta_2 \\
y_2 = & -l_1\cos\theta_1 - h_2\cos\theta_2 \\
\end{split}
\end{equation}
$$

#### Kinetic energy

$$
\begin{equation}
\begin{split}
T = & \dfrac{1}{2} \Big( m_1 h_1^2 + m_2 l_1^2 + J_1 \Big) \dot{\theta_1}^2 \\
  + & \dfrac{1}{2} \Big( m_2 h_2^2 + J_2 \Big) \dot{\theta_2}^2 \\
  + & m_2 l_1 h_2 \dot{\theta_1}\dot{\theta_2} \cos(\theta_1 - \theta_2) \\
\end{split}
\end{equation}
$$

#### Potential enery

$$
\begin{equation}
U = - (m_1 \mathrm{g} h_1 + m_2 \mathrm{g} l_1) \cos\theta_1 - m_2 \mathrm{g} h_2 \cos\theta_2
\end{equation}
$$

## Symmetric double pendulum (dimensionless)

Symmetry conditions

$$
\begin{matrix}
m_1 = m_2 = 1 & \qquad l_1 = l_2 = 1 \\
J_1 = J_2 = J & \qquad h_1 = h_2 = h
\end{matrix}
$$

### Mathematical pendulum

All mass is contained at a point

$$
J = 0 \qquad h = 1 \qquad \mathrm{g} = 1
$$

Lagrange's function

$$
\mathcal{L} = \dot{\theta_1}^2 + \dfrac{1}{2}\dot{\theta_2}^2 + \dot{\theta_1}\dot{\theta_2}\cos(\theta_1 - \theta_2) + 2\cos\theta_1 + \cos\theta_2
$$

### Bar pendulum

Mass is uniformly distrubuted along the bar

$$
J = \frac{1}{12} \qquad h = \frac{1}{2} \qquad \mathrm{g} = \frac{2}{3}
$$

Lagrange's function

$$
\mathcal{L} = \dfrac{2}{3}\dot{\theta_1}^2 + \dfrac{1}{6}\dot{\theta_2}^2 + \dfrac{1}{2}\dot{\theta_1}\dot{\theta_2}\cos(\theta_1 - \theta_2) + \cos\theta_1 + \dfrac{1}{3}\cos\theta_2
$$

## Equations of motion

Equations of motion in generalized coordinates

$$
\Bigg(
  \dfrac{\mathrm{d}}{\mathrm{d}t} \dfrac{\partial}{\partial\dot{\theta_i}}  - \dfrac{\partial}{\partial\theta_i}
\Bigg)
\, \mathcal{L}(\dot{\theta_i}, \theta_i) = 0
\qquad
i = \{1, 2\}
$$

### Mathematical pendulum

$$
\begin{cases}
& \ddot{\theta_1} & = & \dfrac{
\phantom{2}\sin\theta_2\cos(\theta_1 - \theta_2) -
2\sin\theta_1 -
\sin(\theta_1 - \theta_2)
\Big[ \phantom{2}\dot{\theta_2}^2 + \cos(\theta_1 - \theta_2)\dot{\theta_1}^2 \Big]
}{2 - \cos^2(\theta_1 - \theta_2)} & \\
& \ddot{\theta_2} & = & \dfrac{
2\sin\theta_1\cos(\theta_1 - \theta_2) -
2\sin\theta_2 +
\sin(\theta_1 - \theta_2)
\Big[ 2\dot{\theta_1}^2 + \cos(\theta_1 - \theta_2)\dot{\theta_2}^2 \Big]
}{2 - \cos^2(\theta_1 - \theta_2)}
\end{cases}
$$

## Small oscillations

Linearized equations of motion

$$
\mathbf{M} \cdot \ddot{\vec{\Theta}} + \mathbf{K} \cdot \vec{\Theta} = 0
$$

### Mathematical pendulum

$$
\mathbf{M} = \begin{pmatrix} 2 & 1 \\ 1 & 1 \end{pmatrix}
\qquad
\mathbf{K} = \begin{pmatrix} 2 & 0 \\ 0 & 1 \end{pmatrix}
$$

Normal frequencies

$$
\omega_{1,2}^2 = 2 \pm \sqrt{2}
$$

### Bar pendulum

$$
\mathbf{M} = \begin{pmatrix} \frac{4}{3} & \frac{1}{2} \\ \frac{1}{2} & \frac{1}{3} \end{pmatrix}
\qquad
\mathbf{K} = \begin{pmatrix} 1 & 0 \\ 0 & \frac{1}{3} \end{pmatrix}
$$

Normal frequencies

$$
\omega_{1,2}^2 = 2 \pm 4 \dfrac{\sqrt{7}}{7}
$$
