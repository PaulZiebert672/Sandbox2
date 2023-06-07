import numpy as np
import matplotlib.pyplot as plt

from numpy.polynomial import Polynomial
from typing import Tuple

def legendre_poly(k:int) -> Tuple[Polynomial, Polynomial]:
    coeff = np.array([[-1/16, 1/24, 1/4, -1/6], [9/16, -9/8, -1/4, 1/2], [9/16, 9/8, -1/4, -1/2], [-1/16, -1/24, 1/4, 1/6]])
    res_prime = [coeff[k][1], 2*coeff[k][2], 3*coeff[k][3]]
    res = coeff[k]
    return (Polynomial(res), Polynomial(res_prime))

# Create interpolation polynomials of 3-rd order
x = np.linspace(-2, 3, 201)
p_m32, p_prime_m32 = legendre_poly(0)
p_m12, p_prime_m12 = legendre_poly(1)
p_p12, p_prime_p12 = legendre_poly(2)
p_p32, p_prime_p32 = legendre_poly(3)

# Plot interpolation polynomials
fig = plt.figure(figsize=(8, 8))
plt.title("Legendre interpolation polynomials")
#plt.axis("equal")
plt.xlim(-2, 2)
plt.ylim(-2, 2)
plt.xlabel("x")
plt.ylabel("y")
plt.grid(True)

plt.plot(x, p_m32(x), label="L_{-3/2}")
plt.plot(x, p_m12(x), label="L_{-1/2}")
#plt.plot(x, p_p12(x), label="L_{1/2}")
#plt.plot(x, p_p32(x), label="L_{3/2}")
plt.plot(x, p_prime_m32(x), linestyle='dotted', label="L'_{-3/2}")
plt.plot(x, p_prime_m12(x), linestyle='dotted', label="L'_{-1/2}")
#plt.plot(x, p_prime_p12(x), linestyle='dotted', label="L'_{1/2}")
#plt.plot(x, p_prime_p32(x), linestyle='dotted', label="L'_{3/2}")
plt.legend()

fig.savefig('sample-04.png', dpi=150)
