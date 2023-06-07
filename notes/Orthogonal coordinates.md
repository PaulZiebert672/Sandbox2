# Orthogonal coordinates

A general coordinate system with three variables $q_1, q_2, q_3$ can be defined by relating the general coordinates to the Cartesian coordinates $x_1, x_2, x_3$. We would like to relate the unit vectors $\hat{\xi}_i$ in the general system to the Cartesian unit vectors $\hat{n}_i$

The differential of the position vector $\vec{r}$ can be written as

$$
\mathrm{d}\vec{r} = \sum_{k=1}^3 \hat{n}_k \mathrm{d}x_k
= \sum_{k=1}^3 \hat{n}_k \sum_{i=1}^3 \dfrac{\partial x_k}{\partial q_i} \mathrm{d}q_i
= \sum_{i=1}^3 \bigg[ \sum_{k=1}^3 \dfrac{\partial x_k}{\partial q_i} \hat{n}_k \bigg] \mathrm{d}q_i
$$

The quantity in square brackets is in the direction of $\hat{\xi}_i$, but it may not have unit magnitude.

$$
\mathrm{d}\vec{r} \equiv \sum_{i=1}^3 h_i \hat{\xi}_i \mathrm{d}q_i
\qquad
h_i \hat{\xi}_i = \sum_{i=1}^3 \dfrac{\partial x_k}{\partial q_i} \hat{n}_k
$$

#### Ortogonality condition

For orthogonal coordinate systems

$$
\begin{align}
\hat{\xi_i} \cdot \hat{\xi_j} = \delta_{ij}
\end{align}
$$

This gives the orthogonality condition that

$$
\sum_{k=1}^3 \dfrac{\partial{x_k}}{\partial{q_i}} \dfrac{\partial{x_k}}{\partial{q_j}} = h_i h_j \delta_{ij}
$$

In case $i = j$

$$h_i = \sqrt{ \sum_{k=1}^3 \bigg( \dfrac{\partial x_k}{\partial q_i} \bigg)^2 }$$

### Gradient

$$
\mathrm{d}\phi \equiv \nabla \phi \cdot \mathrm{d}\vec{r}
$$

$$
\Big( \nabla \phi \Big)_i = \dfrac{1}{h_i} \dfrac{\partial}{\partial q_i} \phi
$$

### Divergence

$$
\nabla \cdot \vec{A} \equiv \lim_{V \to 0} \dfrac{1}{V} \oint\limits_{\partial V} \vec{A} \cdot \mathrm{d}\vec{s}
$$

$$
\nabla \cdot \vec{A} = \dfrac{1}{h_1 h_2 h_3} \Bigg( \dfrac{\partial}{\partial q_1} h_2 h_3 A_1 + \ldots\text{cyclic} \Bigg)
$$

### Curl

$$
\Big( \nabla \times \vec{A} \Big) \cdot \hat{n} \equiv \lim_{S \to 0} \dfrac{1}{S} \oint\limits_{\partial S} \vec{A} \cdot \mathrm{d}\vec{\tau}
$$

$$
\nabla \times \vec{A} = \dfrac{1}{h_1 h_2 h_3}
\begin{Vmatrix}
h_1 \hat{\xi}_1 & h_2 \hat{\xi}_2 & h_3 \hat{\xi}_3 \\
\dfrac{\partial}{\partial q_1} & \dfrac{\partial}{\partial q_2} & \dfrac{\partial}{\partial q_3} \\
h_1 A_1 & h_2 A_2 & h_3 A_3
\end{Vmatrix}
$$

### Laplacian

$$
\nabla^2 \phi \equiv \nabla \cdot \Big( \nabla \phi \Big)
$$

$$
\nabla^2 \phi = \dfrac{1}{h_1 h_2 h_3} \Bigg( \dfrac{\partial}{\partial q_1} \bigg[ \dfrac{h_2 h_3}{h_1} \dfrac{\partial}{\partial q_1} \phi \bigg] + \ldots\text{cyclic} \Bigg)
$$
