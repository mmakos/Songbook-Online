import os
import glob


def write_to_new_file(svg: str, filename: str):
    new_filename = filename.replace("origin", "changed")
    os.makedirs(os.path.dirname(new_filename), exist_ok=True)
    with open(new_filename, "w") as file:
        file.write(svg)


def remove_none_fill_circle_from_file(filename):
    with open(filename, "r") as file:
        svg = file.read()
        start = len(svg)
        while True:
            end = svg.rfind("</circle>", 0, start) + len("</circle>")
            start = svg.rfind("<circle", 0, start)
            if start < 0 or end < 0:
                break
            if "fill=\"none\"" in svg[start:end]:
                svg = svg[:start] + svg[end:]
        return svg


for file in glob.glob("origin/*/*", recursive=True):
    write_to_new_file(remove_none_fill_circle_from_file(file), file)
