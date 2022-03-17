import numpy as np
from PIL import Image


chord_types = ["dur", "moll", "maj7", "min7", "maj7aug", "maj6", "min6", "min6dim", "maj4", "min2", "dim", "dominant9dim"]
chords = ["c", "cis", "d", "es", "e", "f", "fis", "g", "gis", "a", "b", "h"]

images = np.asarray([[Image.open(f"png/{chord_type}/{chord}.png") for chord in chords] for chord_type in chord_types])

widths = np.max(np.vectorize(lambda i: i.size[0])(images), axis=1)
heights = np.max(np.vectorize(lambda i: i.size[1])(images), axis=0)

print(widths)
print(heights)

result = Image.new("RGBA", (np.sum(widths), np.sum(heights)))
print(result.size)
for i, _ in enumerate(images):
    for j, image in enumerate(images[i]):
        result.paste(image, (np.sum(widths[:j]), np.sum(heights[:i])))

result.save("test.png")

