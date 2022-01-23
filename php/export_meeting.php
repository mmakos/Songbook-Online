<?php
    if (isset($_COOKIE['meeting'])) {
        $meetingid = $_COOKIE['meeting'];
        
        $connection = mysqli_connect("localhost", "mmakos_ahsoka", "f5U-96p(S5", "mmakos_ahsoka");
        if ($connection) {
            $sql_select = "SELECT post_title, post_content FROM ahsoka_meeting_songs INNER JOIN ahsoka_posts WHERE meeting_id='$meetingid' AND ahsoka_meeting_songs.song_id = ahsoka_posts.ID ORDER BY post_title";
            $select_result = mysqli_query($connection, $sql_select);
            
            if ($select_result and $select_result->num_rows > 0) {
                $html_file = "<html><head>
    <meta charset=\"UTF-8\">
    <style>
    #song h2 {
        color: black;
        font-weight: bold;
        font-family: arial;
        font-size: 133%;
    }

    #song .author {
        line-height: 140%;
        font-size: 90%;
        margin-bottom: 20px;
        padding-left: 6px;
        font-family: verdana;
        border-left: 1px solid;
        margin-left: 12px
    }

    #song span {
        color: black;
        font-family: verdana;
    }

    #song sup {
        font-size: 0.6em;
    }

    #song sub {
        font-size: 0.6em;
    }

    #song td {
        padding-right: 20px;
        border: 0px;
        line-height: 1.25;
        white-space: nowrap;
        width: 1%;
    }

    #song td:last-child {
        width: 100%
    }

    #song table {
        border: 0px;
        letter-spacing: 0;
    }
    </style>
</head><body>";
                
                while($row = mysqli_fetch_array($select_result)) {
                    $content = $row['post_content'];
                    $title = $row['post_title'];

                    $split_content = explode('>', $content, 2);
                    if (count($split_content) > 1) {
                        $html_file = $html_file . $split_content[0] . "><h2>$title</h2>" . $split_content[1];
                    }
                }
                $html_file = $html_file . "</body></html>";
                
                header('Content-disposition: attachment;filename=spiewnik_' . $meetingid . '.html');
                echo $html_file;
            }
        }
    }
    header("Location: " . explode("?", $_SERVER['HTTP_REFERER'])[0]);
?>