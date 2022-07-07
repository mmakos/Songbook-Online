import base64
import csv
import hashlib
import os
import smtplib
import ssl
import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

import discord

PREFIX = ["kadra", "pomocnicy"]
vote_end = datetime.datetime(2022, 6, 24, 23, 59, 59)

# mail
originator = "pomocnicy@kik.waw.pl"
password = os.getenv("mail_pass")

# discord
token = os.getenv('discord_token')

# message
msg = """\
Cześć {voter_name},

Chcemy, abyś miał wpływ na piosenki, które wylądują w śpiewniku pomocników tego roku.
Dlatego zapraszamy do odwiedzenia strony https://spiewnik.mmakos.pl/pomocnicy-2022 gdzie mozesz zgłosić maksymalnie 3 propozycje od siebie, oraz oddać maksymalnie 7 głosów na piosenki zgłaszane przez innych uczestników.

Termin zgłaszania piosenek i glosowania jest do końca roku szkolnego, czyli do 24 czerwca (zostało {time_left}). Polecam najpierw pozgłaszać wszystkie piosenki w miarę szybko, a głosować, jak już będzie dużo piosenek zgłoszonych.

Po wprowadzeniu swojego tokena dostępu będziesz mógł dodać 3 piosenki (operacja nieodwracalna) oraz będziesz miał dostęp do listy zgłoszonych przez wszystkich piosenek.
Każda piosenka ma po lewej stronie checkbox'a. Aby zagłosować, należy zaznaczyć wybrane piosenki, oraz wcisnąć "Głosuj". Swoje głosy możesz w każdej chwili edytować.
Przy zgłaszaniu piosenki, upewnij się, że nie ma jej już na liście oraz nie zapomnij podać linku do nagrania, tak aby inni mogli łatwo odsłuchać twojej propozycji.
Piosenki, które były rok temu w śpiewniku pomocników (https://spiewnik.mmakos.pl/pomocnicy-2021), zostaną w tym roku automatycznie przeniesione, więc nie ma sensu zgłaszać ich tutaj - poza drobnymi wyjątkami, które nie wypaliły i nikt ich nie zna.

Twój token dostępu to: {voter_token}
Możesz również kliknąć w ten link (wtedy zostaniesz automatycznie zalogowany): https://spiewnik.mmakos.pl/pomocnicy-2022/?token={voter_token}

Pozdrawiamy,
Kadra kursu pomocników 2022
Odwiedź: www.pomocnicy.kik.waw.pl
"""

voters = list()
voters_dict = dict()


def generate_voters():
    global voters_dict, voters
    for prefix in PREFIX:
        with open(f"{prefix}.csv", encoding="UTF-8") as file:
            reader = csv.reader(file, delimiter=',')
            next(reader)
            for row in reader:
                voter = [row[2], row[1], row[6]]
                hashed = hashlib.sha1(",".join(voter).encode("UTF-8")).hexdigest()
                key = base64.b64encode(hashed.encode("UTF-8"))
                key = key.decode("ascii")
                voter.append("".join((key[i] for i in (17, 31, 4, 12, 7, 24, 11, 20))))
                voters.append(tuple(voter))
    voters_dict = {f"{voter[0]} {voter[1]}": voter for voter in voters}


def print_voters_sql():
    print("SQL:\n")
    for voter in voters:
        sql = f"INSERT INTO ahsoka_vote_users(name, last_name, mail, id) VALUES ('{voter[0]}', '{voter[1]}', '{voter[2]}', '{voter[3]}');"
        print(sql)
    print("\n")


def send_emails():
    print("SEND MAILS")
    context = ssl.create_default_context()
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.ehlo()
    server.starttls(context=context)
    server.ehlo()
    server.login(originator, password)

    for addressee in voters:
        print(f"Send to: {addressee[0]} {addressee[1]} <{addressee[2]}>")

        mime_msg = MIMEMultipart()

        text = msg.format(voter_name=addressee[0], voter_token=addressee[3], time_left=get_time_diff())

        mime_msg['From'] = formataddr(("Pomocnicy", originator))
        mime_msg['To'] = formataddr((f"{addressee[0]} {addressee[1]}", addressee[2]))
        mime_msg['Subject'] = "Głosowanie na piosenki do śpiewnika pomocników 2022"
        mime_msg.attach(MIMEText(text))

        server.sendmail(originator, addressee[2], mime_msg.as_string())
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
            voter = voters_dict[member_name]
            msg_to_member = msg.format(voter_name=voter[0], voter_token=voter[3], time_left=get_time_diff())
            await member.send(msg_to_member)

        except Exception:
            print(f"Unable to send to: {member_name}")

    @client.event
    async def on_ready():
        for member in client.get_guild(968811982985785345).members:
            await send_to_member(member)

    client.run(token)


def get_time_diff() -> str:
    now = datetime.datetime.now()
    time_left = vote_end - now
    hours, remainder = divmod(time_left.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{time_left.days} dni, {int(hours)} godzin, {int(minutes)} minut, {int(seconds)} sekund"


generate_voters()
print_voters_sql()
send_emails()
send_discord_msgs()
