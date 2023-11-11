from PyPDF2 import PdfFileWriter, PdfFileReader
from argparse import ArgumentParser
from pathlib import Path

parser = ArgumentParser()
parser.add_argument("file_path", type=str)
parser.add_argument("replace_path", type=str)
parser.add_argument("start_page", type=int)
arguments, _ = parser.parse_known_args()

print("Loading pdf files...")
pdf_reader = PdfFileReader(arguments.file_path)
pdf_replace_reader = PdfFileReader(arguments.replace_path)
print("Pdf loaded")
pdf_writer = PdfFileWriter()

replace_position = arguments.start_page
replace_pages = pdf_replace_reader.pages

for i, page in enumerate(pdf_reader.pages):
    if i < replace_position - 1 or i >= len(replace_pages) + replace_position - 1:
        pdf_writer.addPage(page)
    else:
        pdf_writer.addPage(replace_pages[i - replace_position + 1])

with Path(arguments.file_path[:-4] + "_replaced" + arguments.file_path[-4:]).open(mode="wb") as output:
    pdf_writer.write(output)
    print("Pdf replaced into file:", arguments.file_path[:-4] + "_replaced" + arguments.file_path[-4:])
