from PyPDF2 import PdfFileWriter, PdfFileReader
from argparse import ArgumentParser
from pathlib import Path

parser = ArgumentParser()
parser.add_argument("file_path", type=str)
parser.add_argument("pages", type=str, nargs='+')
arguments, _ = parser.parse_known_args()

print("Loading pdf file...")
pdf_reader = PdfFileReader(arguments.file_path)
print("Pdf loaded")
pdf_writer = PdfFileWriter()

page_numbers = list()
for page in arguments.pages:
    pages_interval = page.split(":", 1)
    if len(pages_interval) == 1:
        page_numbers.append(int(pages_interval[0]) - 1)
    else:
        for number in range(int(pages_interval[0]), int(pages_interval[1]) + 1):
            page_numbers.append(number - 1)

for page_number in page_numbers:
    pdf_writer.addPage(pdf_reader.getPage(page_number))

with Path(arguments.file_path[:-4] + "_splitted" + arguments.file_path[-4:]).open(mode="wb") as output:
    pdf_writer.write(output)
    print("Pdf splitted into file:", arguments.file_path[:-4] + "_splitted" + arguments.file_path[-4:])
