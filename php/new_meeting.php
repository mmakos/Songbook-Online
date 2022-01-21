<?php
    if (isset($_POST['submitted'])) {
        $connection = mysqli_connect("localhost", "mmakos_ahsoka", "f5U-96p(S5", "mmakos_ahsoka");

        if (!$connection) {
            header("Location: https://spiewnik.mmakos.pl/utworz-spotkanie?status=failed");
        } else {
            $meetingid = $_POST['meeting-id'];
            $author = $_POST['author'];
            $password = '';
    
            $sql_select = "SELECT id FROM ahsoka_meetings WHERE id='$meetingid'";
            
            $select_result = mysqli_query($connection, $sql_select);
            if (!select_result) {
                header("Location: https://spiewnik.mmakos.pl/utworz-spotkanie?status=failed");
            } else if ($select_result->num_rows > 0) {
                header("Location: https://spiewnik.mmakos.pl/utworz-spotkanie?status=exists");
            } else {
                $sql_insert = "INSERT INTO ahsoka_meetings(id, pass, author) VALUES ('$meetingid', '$password', '$author')";
                if (!mysqli_query($connection, $sql_insert)) {
                    header("Location: https://spiewnik.mmakos.pl/utworz-spotkanie?status=failed");
                } else {
                    setcookie('meeting', $meetingid, time() + 86400, "/");
                    header("Location: https://spiewnik.mmakos.pl/piosenki");
                }
            }
        }
    } else {
        header("Location: https://spiewnik.mmakos.pl/piosenki");
    }
?>