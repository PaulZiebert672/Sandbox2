import numpy as np

from PIL import Image, ImageDraw, ImageFont

len = 240
gap = 20
bob = 8    # pendulum bob size
am = 60    # angle arc size
pstart = [200, gap + 100]
theta_1 = np.radians(15)
theta_2 = np.radians(-45)

im = Image.new('RGB', (2*pstart[0], 3*pstart[0]), (255, 255, 255))
draw = ImageDraw.Draw(im)

x0 = pstart[0]
y0 = pstart[1]
x1 = x0 + len*np.sin(theta_1)
y1 = y0 + len*np.cos(theta_1)
x2 = x1 + len*np.sin(theta_2)
y2 = y1 + len*np.cos(theta_2)

# Draw pendulum
draw.line((x0, y0, x1, y1, x2, y2), fill=(0, 0, 0), width=2)
draw.ellipse((x1 - bob, y1 - bob, x1 + bob, y1 + bob), fill=(63, 63, 63))
draw.ellipse((x2 - bob, y2 - bob, x2 + bob, y2 + bob), fill=(63, 63, 63))

# Draw axes
draw.line((gap, y0, 2*pstart[0] - gap, y0), fill=(127, 127, 127), width=1)
draw.line((2*pstart[0] - gap - 10, y0 - 5, 2*pstart[0] - gap, y0, 2*pstart[0] - gap - 10, y0 + 5), fill=(127, 127, 127), width=1)
draw.line((x0, gap, x0, 3*pstart[0] - gap), fill=(127, 127, 127), width=1)
draw.line((x0 - 5, gap + 10, x0, gap, x0 + 5, gap + 10), fill=(127, 127, 127), width=1)
for k in range(20):
    draw.line((x1, y1 + k*10, x1, y1 + k*10 + 5), fill=(127, 127, 127), width=1)

# Draw angles
draw.arc((x0 - am, y0 - am, x0 + am, y0 + am), start=90 - np.degrees(theta_1), end=90, fill=(127, 127, 127), width=1)
draw.arc((x1 - am + 1, y1 - am + 1, x1 + am - 1, y1 + am - 1), start=90, end=90 - np.degrees(theta_2), fill=(127, 127, 127), width=1)
draw.arc((x1 - am - 1, y1 - am - 1, x1 + am + 1, y1 + am + 1), start=90, end=90 - np.degrees(theta_2), fill=(127, 127, 127), width=1)

font = ImageFont.load_default().font
draw.text((x0 + gap, y0 + gap), text='theta_1', fill=(63, 63, 63), font=font)
draw.text((x1 + gap, y1 + gap), text='theta_2', fill=(63, 63, 63))
draw.text((2*pstart[0] - 2*gap, y0 - gap), text='x', fill=(63, 63, 63))
draw.text((x0 + gap, gap), text='y', fill=(63, 63, 63))

im.save('coordinates.jpg', quality=90)
