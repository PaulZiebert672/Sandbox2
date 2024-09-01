# Pendulum on tube

### Cartesian coordinates

$$
\begin{align}
x = & \rho \cos{\theta} + (1 + \rho \theta) \sin{\theta} \\
y = & \rho \sin{\theta} - (1 + \rho \theta) \sin{\theta}
\end{align}
$$

### Lagrangian

$$
\mathcal{L}(\theta, \dot{\theta}) = \dfrac{1}{2} (1 + \rho \theta)^2 \dot{\theta}^2 - \rho \sin{\theta} + (1 + \rho \theta) \cos{\theta}
$$

### Momentum

$$
p = \dfrac{\partial \mathcal{L}}{\partial \dot{\theta}}
  = (1 + \rho \theta)^2 \dot{\theta}
$$

### Equation of motion

$$
\dfrac{\mathrm{d}}{\mathrm{d} t} \dfrac{\partial \mathcal{L}}{\partial \dot{\theta}} - \dfrac{\partial \mathcal{L}}{\partial \theta} = 0
$$

$$
(1 + \rho \theta) \, \ddot{\theta} + \rho \, \dot{\theta}^2 + \sin{\theta} = 0
$$

### Constant of motion

$$
\mathcal{E}_0 \equiv \mathcal{E}(\theta, \dot{\theta}) = \dfrac{1}{2} (1 + \rho \theta)^2 \dot{\theta}^2 + \rho \sin{\theta} + 1 - (1 + \rho \theta) \cos{\theta}
$$

### Libration time

Maximal amplitude $\theta_0$ satisfies equation

$$
\mathcal{E}_0 = \rho \sin{\theta_0} + 1 - (1 + \rho \theta_0) \cos{\theta_0}
$$

Time of motion from maximal amplitude to vertical

$$
\mathrm{T}_{\theta_0 \rightarrow 0} = \dfrac{1}{\sqrt{2}} \int \limits_0^{\theta_0} \dfrac{(1 + \rho \theta) \, \mathrm{d} \theta}{\sqrt{\rho \sin{\theta_0} - (1 + \rho \theta_0) \cos{\theta_0} - \rho \sin{\theta} + (1 + \rho \theta) \cos{\theta}}}
$$

### Hamiltonian

$$
\mathcal{H}(p, \theta) = p \, \dot{\theta} - \mathcal{L}(\theta, \dot{\theta})
$$

$$
\mathcal{H}(p, \theta) = \dfrac{1}{2} \dfrac{p^2}{(1 + \rho \theta)^2} + \rho \sin{\theta} + 1 - (1 + \rho \theta) \cos{\theta}
$$

### Canonical equations

$$
\dot{\theta} = \dfrac{\partial \mathcal{H}}{\partial p}
\qquad
\dot{p} = - \dfrac{\partial \mathcal{H}}{\partial \theta}
$$

$$
\begin{align}
\dot{\theta} = & \dfrac{p}{(1 + \rho \theta)^2} \\
\dot{p} = & \dfrac{\rho \, p^2}{(1 + \rho \theta)^3} - (1 + \rho \theta) \sin{\theta}
\end{align}
$$
