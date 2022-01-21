import re


def get_text_without_classes(string: str):
    result = str(string)
    while True:
        begin = result.find("<")
        end = result.find(">") + 1
        if begin == -1 or end == -1:
            result = re.sub(r'[0-9]+\.', '', result)
            return result.replace("&nbsp;", "").replace("\n", " ").strip()
        result = result[:begin] + result[end:]


def get_authors_without_classes(string: str):
    single_authors = re.split(r"</p>", string)
    authors_list = [re.sub(r' +', ' ', get_text_without_classes(author)) for author in single_authors]
    return [author for author in authors_list if len(author) > 0]


def get_authors(path: str):
    with open(path, "r", encoding="windows-1250") as file:
        html = file.read()
        headers = list()
        while True:
            start = html.find("<h2")
            if start == -1: break
            end = html.find("</h2>")
            headers.append(html[start:end + 5])
            html = html[end + 5:]

        authors = dict()
        for header in headers:
            begin = header.rfind("</v:shape>")
            if begin > -1:
                begin += len("</v:shape>")
            else:
                begin = 0
            title = get_text_without_classes(header[begin:-5])

            begin = header.find("<v:textbox")
            end = header.find("</v:textbox>")
            if begin < 0:
                authors[title] = None
            else:
                authors[title] = get_authors_without_classes(header[begin:end + len("</v:textbox>")])

    return authors


print(get_authors("docx/Śpiewnik-4.1.4.htm"))
