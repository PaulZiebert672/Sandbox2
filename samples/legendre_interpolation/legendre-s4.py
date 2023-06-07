import numpy as np
import matplotlib.pyplot as plt

from numpy.polynomial import Polynomial

def legendre_poly(k):
    coeff = np.array([[-1/16, 1/24, 1/4, -1/6], [9/16, -9/8, -1/4, 1/2], [9/16, 9/8, -1/4, -1/2], [-1/16, -1/24, 1/4, 1/6]])
    res = coeff[k]
    return Polynomial(res)

x = np.linspace(-2, 3, 201)
p_m32 = legendre_poly(0)
p_m12 = legendre_poly(1)
p_p12 = legendre_poly(2)
p_p32 = legendre_poly(3)

fig = plt.figure(figsize=(8, 8))
plt.title("Legendre interpolation polynomials")
#plt.axis("equal")
plt.xlim(-2, 2)
plt.ylim(-2, 2)
plt.xlabel("x")
plt.ylabel("y")
plt.grid(True)

plt.plot(x, p_m32(x))
plt.plot(x, p_m12(x))
#plt.plot(x, p_p12(x))
#plt.plot(x, p_p32(x))
plt.legend(['L_{-3/2}', 'L_{-1/2}', 'L_{1/2}', 'L_{3/2}'])

fig.savefig('sample-04.png', dpi=150)
