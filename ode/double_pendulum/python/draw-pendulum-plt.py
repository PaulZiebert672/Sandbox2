import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure(figsize=(6, 6))
ax = plt.gca()
ax.spines['left'].set_position('zero')
ax.spines['bottom'].set_position('zero')
ax.spines['right'].set_color('none')
ax.spines['top'].set_color('none')
ax.xaxis.set_tick_params(rotation=18, labelsize=8, labelcolor="gray")
ax.yaxis.set_tick_params(rotation=18, labelsize=8, labelcolor="gray")

plt.title("Double pendulum")
plt.axis("equal")
plt.xlim(-1.5, 1.5)
plt.ylim(-2.0, 0.5)
plt.xlabel("x", loc="right")
plt.ylabel("y", loc="top")
plt.grid(True)

theta_1 = np.radians(18)
theta_2 = np.radians(-54)

x1 = np.sin(theta_1)
y1 = -np.cos(theta_1)
x2 = x1 + np.sin(theta_2)
y2 = y1 - np.cos(theta_2)

circle1 = plt.Circle((x1, y1), radius=0.05, color='green')
circle2 = plt.Circle((x2, y2), radius=0.05, color='green')
#plt.plot([0, x1], [0, y1], color='green')
#plt.plot([x1, x2], [y1, y2], color='green')
line1 = plt.Line2D([0, x1], [0, y1], color='green')
line2 = plt.Line2D([x1, x2], [y1, y2], color='green')

ax.add_artist(circle1)
ax.add_artist(circle2)
ax.add_artist(line1)
ax.add_artist(line2)

fig.savefig('coordinates-plt.png', dpi=150)
