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

# PREFIX = ["kadra", "pomocnicy"]
PREFIX = ["pomocnicy"]
MAIL_TITLE = "Obóz pomocników 2022 - kwaterka"


info2008 = """
Ponieważ jesteś z rocznika 2008 (oficjalny minimalny wiek uczestnika to 16 lat), a zgłoszeń jest trochę więcej, niż miejsc, to Twoje uczestnictwo w kursie jest warunkowe - oznacza to, że nie możemy Ci w 100% zagwarantować miejsca na kursie i będziemy Ci się baczniej przyglądać na spotkaniach itd. :-)
"""


def createMail(pom: dict) -> str:
    return f"""\
Drog{"a" if isWoman(pom) else "i"} {pom["nameWolacz"]},

Twoja kadra zgłosiła Ciebie na tegoroczny kurs pomocników. Teraz prosimy, abyś Ty wypełnił{"a" if isWoman(pom) else ""} formularz zgłoszeniowy uczestnika, potwierdzając tym samym chęć uczestnictwa. Napisz po kilka znań w miejscach na długą odpowiedź - te ankiety są dla nas bardzo ważne.
Formularz znajduje się tutaj: https://forms.gle/yv8CZ6s1fzguebRg6.
Prosimy, abyś zrobił{"a" if isWoman(pom) else ""} to do końca tygodnia, tj. do 26 marca 2023. Jeżeli to zrobisz, to po weekendzie spodziewaj się odpowiedzi/potwierdzenia oraz dalszych informacji, w tym o pierwszym spotkaniu, które odbędzie się już 2 kwietnia o godzinie 18:30.
{info2008 if pom["year"] == "2008" else ""}
Harmonogram i inne informacje o kursie są dostępne na naszej stronie internetowej: https://pomocnicy.kik.waw.pl/.

Pamiętaj, że obecność na zaplanowanych spotkaniach przed obozem jest obowiązkowa. Jeżeli już teraz wiesz, że na którymś może Cię nie być, to koniecznie daj nam znać. Fajnie, jakbyś zapoznał{"a" if isWoman(pom) else ""} się też z innymi treściami na stronie - opisaliśmy tam jak wygląda kurs, czego można się spodziewać i czego będziemy wymagać.

Pozdrawiamy,
Kadra kursu pomocników 2023:
Jerzy Traczyński
Szymon Święcicki
Emilka Mańczak
Michał Makoś

Mail: pomocnicy@kik.waw.pl
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
                pomocnicy.append({"token": "null",
                                  "name": row[2],
                                  "nameWolacz": row[8],
                                  "lastName": row[3],
                                  "group": row[4],
                                  "mail": row[7],
                                  "year": row[6]})


read_csv()
send_emails(pomocnicy)
# send_discord_msgs()
