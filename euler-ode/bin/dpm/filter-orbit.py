# run data filter as `python filter-orbit.py`
import sys

print("t", "\t", "q1", "\t", "p1", "\t", "dE")
for line in sys.stdin:
    a = line.split(" ")
    t = a[0]
    q = a[1].split(",")
    p = a[2].split(",")
    if not 'e0' in vars():
        e0 = float(a[3])
    print(t, "\t", q[0], "\t", p[0], "\t", float(a[3]) - e0)
