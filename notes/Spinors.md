# Spinors

## Spinors in Euclidean space

### Rotations

Rotation matrix will satisfy $R^{T}R = I$ and can be represened as $R = \exp(\theta_i L_i)$, where $L_i$ are the $SO(3)$ group generators

$$
L_1 =
\begin{pmatrix}
0 & 0 & 0 \\
0 & 0 & -1 \\
0 & 1 & 0
\end{pmatrix} \qquad
L_2 =
\begin{pmatrix}
0 & 0 & 1 \\
0 & 0 & 0 \\
-1 & 0 & 0
\end{pmatrix} \qquad
L_3 =
\begin{pmatrix}
0 & -1 & 0 \\
1 & 0 & 0 \\
0 & 0 & 0
\end{pmatrix} \qquad
$$

They satisfy commutation relations

$$
\big[ L_1, L_2 \big] = L_3
\quad \ldots + \text{cyclic permitations}
$$

One could define $J_i = iL_i\:$ which will generate $\mathfrak{so}(3)$ algebra

$$
\big[ J_i, J_j\big] = i\epsilon_{i j k} J_k
$$

### Pauli matrices

Pauli matrices are defined as

$$
\sigma_1 =
\begin{pmatrix}
0 & 1 \\
1 & 0
\end{pmatrix} \qquad
\sigma_2 =
\begin{pmatrix}
0 & -i \\
i & 0
\end{pmatrix} \qquad
\sigma_3 =
\begin{pmatrix}
1 & 0 \\
0 & -1
\end{pmatrix}
$$

They satisfy commutation relations

$$
\big[ \sigma_1, \sigma_2 \big] = \dfrac{i}{2}\sigma_3
\quad \ldots + \text{cyclic permitations}
$$

One could define $J_i = \dfrac{1}{2}\sigma_i\:$ which will generate $\mathfrak{su}(2)$ algebra

$$
\big[ J_i, J_j\big] = i\epsilon_{i j k} J_k
$$

### Clifford algebra

Pauli matrices satisfy the Clifford algebra

$$
\big[ \sigma_i, \sigma_j \big] \cdot_{+} = 2 \delta_{ij} \sigma_0
$$

where $\delta_{ij}$ is essentialy the metric in Euclidean space.

### Transformation of spinors

Two-component spinor $\chi$ is transformed as

$$
\chi^{\prime} = \exp \Big( \dfrac{i}{2} \sigma_i \theta_i \Big) \chi
$$

## Spinors in Minkowski space

### Lorentz transformations

Metric $\eta_{\mu\nu} = \mathrm{diag}\big( 1, -1, -1, -1 \big)$

Transformation matrix $\Lambda$ satisfies the relation $\Lambda^{T} \eta \Lambda = \eta$

Generators of the $SO(1,3)$ group can produce any transformation matrix $\Lambda = \exp\big( i\beta_i K_i + i\theta_j J_j \big)$. They constitute set of 3 boosts and 3 rotations:

$$
\begin{eqnarray}
K_1 = -i
\begin{pmatrix}
0 & 1 & 0 & 0 \\
1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0
\end{pmatrix} \qquad
K_2 = -i
\begin{pmatrix}
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 0 \\
1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0
\end{pmatrix} \qquad
K_3 = -i
\begin{pmatrix}
0 & 0 & 0 & 1 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 \\
1 & 0 & 0 & 0
\end{pmatrix} \\
J_1 = i
\begin{pmatrix}
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & -1 \\
0 & 0 & 1 & 0
\end{pmatrix} \qquad
J_2 = i
\begin{pmatrix}
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 \\
0 & 0 & 0 & 0 \\
0 & -1 & 0 & 0
\end{pmatrix} \qquad
J_3 = i
\begin{pmatrix}
0 & 0 & 0 & 0 \\
0 & 0 & -1 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0
\end{pmatrix}
\end{eqnarray}
$$

These generators satisfy commutation relations

$$
\begin{eqnarray}
\big[ J_i, J_j \big] & = & i \epsilon_{i j k} J_k \\
\big[ K_i, K_j \big] & = & -i \epsilon_{i j k} J_k \\
\big[ J_i, K_j \big] & = & i \epsilon_{i j k} K_k \\
\end{eqnarray}
$$

Linear combinations $J_i^+ = \dfrac{1}{2}\Big( J_i + iK_i \Big)$ and $J_i^- = \dfrac{1}{2}\Big( J_i - iK_i \Big)$ will satisfy

$$
\begin{eqnarray}
\big[ J_i^+, J_j^+ \big] & = & i \epsilon_{i j k} J_k^+ \\
\big[ J_i^-, J_j^- \big] & = & i \epsilon_{i j k} J_k^- \\
\big[ J_i^+, J_j^- \big] & = & 0 \\
\end{eqnarray}
$$

Generators $J_i^+, J_i^-$  form a Lie algebra $\mathfrak{su}(2) \oplus \mathfrak{su}(2)$.

### Clifford algebra

Define the Dirac gamma matrices that will satisfy the Clifford algebra

$$
\big[ \gamma^{\mu}, \gamma^{\nu} \big] \cdot_{+} = 2 \eta^{\mu\nu} \mathcal{I}
$$

where $\eta^{\mu\nu}$ is the metric in Minkowski space.

#### Dirac representation

$$
\gamma^0 =
\begin{pmatrix}
\sigma_0 & \\
& -\sigma_0
\end{pmatrix} \qquad
\gamma^{i} =
\begin{pmatrix}
& \sigma_i \\
-\sigma_i &
\end{pmatrix}
$$

#### Weyl representation

$$
\gamma^0 =
\begin{pmatrix}
& \sigma_0 \\
\sigma_0 &
\end{pmatrix} \qquad
\gamma^{i} =
\begin{pmatrix}
& \sigma_i \\
-\sigma_i &
\end{pmatrix}
$$

### Transformation of spinors

Define the list of 6 transformation parameters be totally antisymmetric $\omega_{\nu\mu} = - \omega_{\mu\nu}$ and define 6 generators as

$$
\sigma^{\mu\nu} = \dfrac{i}{2}\big[ \gamma^{\mu}, \gamma^{\nu} \big]
$$

Four-component spinor $\psi$ is transformed as

$$
\psi^{\prime} = \exp \Big( \dfrac{i}{4} \sigma^{\mu\nu} \omega_{\mu\nu} \Big) \psi
$$

Define Dirac adjoint as $\bar{\psi} = \psi^{\dagger} \gamma_0$. Combination $\bar{\psi} \psi$ is Lorentz invariant.
