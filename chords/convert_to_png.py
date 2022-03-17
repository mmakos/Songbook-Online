import os
import glob
from cairosvg import svg2png
from PIL import Image


def convert_and_write(filename: str):
    new_filename = filename.replace("changed", "png")
    os.makedirs(os.path.dirname(new_filename), exist_ok=True)
    svg2png(url=filename, write_to=new_filename[:-4] + ".png", scale=0.5)

    img = Image.open(new_filename[:-4] + ".png")
    img_trimmed = img.crop(img.getbbox())
    img_trimmed.save(new_filename[:-4] + ".png")


for file in glob.glob("changed/*/*", recursive=True):
    convert_and_write(file)
