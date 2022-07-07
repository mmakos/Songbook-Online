import csv
import os

# mail
import ssl
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

import discord

originator = "pomocnicy@kik.waw.pl"
password = os.getenv("mail_pass")

# discord
token = os.getenv('discord_token')

pomocnicy = list()

PREFIX = ["kadra", "pomocnicy"]
MAIL_TITLE = "Obóz pomocników 2022 - kwaterka"


def createMail(pom: dict) -> str:
    return f"""\
Cześć {pom["name"]},

Poszukujemy kilku osób na kwaterkę do obozu pomocników. Jeśli chciał{"a" if isWoman(pom) else ""}byś pojechać, to zgłoś się jak najszybciej (do piątku do wieczora bezpośrednio do mnie, albo odpowiadając na tego maila), gdyż pojadą pewnie tylko ze 4 osoby.
Kwaterka będzie tak jak już kiedyś, na pierwszym spotkaniu mówiliśmy - od 23 lipca, wyjazd w sobotę rano. 

Dużo roboty w tym roku nie będzie, bo będziemy przejmować obóz po poprzedniej grupie, tak więc będziemy musieli jedynie:
- Spakować ewentualne rzeczy (jakiś namiot dodatkowy, kanadyjki itd.) do transportu z Warszawy
- Rozbić 1-2 dodatkowe namioty
- Dobudować/ponaprawiać rzeczy po poprzedniej grupie
- Ewentualnie pomóc wychowawcom w ich kwaterce, jak będą chcieli
- Pochillować sobie nad Morzem Wąpierskim.

Zachęcam w szczególności osoby, które już spodziewają się, że w przyszłości w kadrowaniu to one będą zajmować się kwaterką.

Pozdrawiam,
Michał Makoś w imieniu kadry kursu pomocników 2022
Odwiedź: www.pomocnicy.kik.waw.pl
    """


def isWoman(pomocnik):
    if pomocnik["name"].endswith("a") or pomocnik["name"] == "Ehli":
        return True
    return False


def send_emails(pomocnicy):
    print("SEND MAILS")
    context = ssl.create_default_context()
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.ehlo()
    server.starttls(context=context)
    server.ehlo()
    server.login(originator, password)

    for pomocnik in pomocnicy:
        print(f"""Send to: {pomocnik["name"]} {pomocnik["lastName"]} <{pomocnik["mail"]}>""")

        mime_msg = MIMEMultipart()

        mime_msg['From'] = formataddr(("Pomocnicy", originator))
        mime_msg['To'] = formataddr((f"""{pomocnik["name"]} {pomocnik["lastName"]}""", pomocnik["mail"]))
        mime_msg['Subject'] = MAIL_TITLE
        mime_msg.attach(MIMEText(createMail(pomocnik)))
        print(createMail(pomocnik))

        server.sendmail(originator, pomocnik["mail"], mime_msg.as_string())
    server.quit()
    print()


def send_discord_msgs():
    print("SEND DISCORD MESSAGES")
    intents = discord.Intents.default()
    intents.members = True
    client = discord.Client(intents=intents)

    async def send_to_member(member):
        member_name = member.nick if member.nick is not None else member.name
        if "Domardzki" in member_name:
            member_name = "Ori Domaradzki"
        print(f"Send to: {member_name}")
        try:
            pomocnik = get_pomocnik(member_name)
            if pomocnik is not None:
                msg_to_member = createMail(pomocnik)
                await member.send(msg_to_member)
            else:
                print(f"Unable to send to: {member_name}")

        except Exception:
            print(f"Unable to send to: {member_name}")

    @client.event
    async def on_ready():
        for member in client.get_guild(968811982985785345).members:
            await send_to_member(member)

    client.run(token)


def get_pomocnik(name):
    for pomocnik in pomocnicy:
        if f"""{pomocnik["name"]} {pomocnik["lastName"]}""" == name:
            return pomocnik

    return None


def get_pomocnik_by_token(token):
    for pomocnik in pomocnicy:
        if pomocnik["token"] == token:
            return pomocnik

    return None


def read_csv():
    for prefix in PREFIX:
        with open(f"{prefix}.csv", encoding="UTF-8") as file:
            reader = csv.reader(file, delimiter=',')
            next(reader)

            for row in reader:
                pomocnicy.append({"token": row[0],
                                  "name": row[2],
                                  "lastName": row[1],
                                  "mail": row[6]})


read_csv()
# send_emails(pomocnicy)
send_discord_msgs()
