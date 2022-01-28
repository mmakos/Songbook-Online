from math import cos, sin, radians

o = (60, 60)


def xy(alpha, r):
    return o[0] + r * cos(radians(alpha)), o[1] + r * sin(radians(alpha))


points = list()
for a in range(5):
    points.append(xy(a * 72 - 90, 55))


inner = list()
for a in range(5):
    inner.append(xy(a * 72 - 90 + 36, 27))


result = [tuple()]*(len(points)+len(inner))
result[::2] = points
result[1::2] = inner

for point in result:
    print("%.3f,%.3f" % (point[0], point[1]), end=' ')
print("%.3f,%.3f" % (result[0][0], result[0][1]), end=' ')
print("%.3f,%.3f" % (result[1][0], result[1][1]), end='')
