<?php
    if (isset($_COOKIE['meeting'])) {
        $meetingid = $_COOKIE['meeting'];
        
        $connection = mysqli_connect("localhost", "mmakos_ahsoka", "f5U-96p(S5", "mmakos_ahsoka");
        if ($connection) {
            $sql_select = "SELECT song_id, post_title, post_content, flags, transposition, song_url, song_name FROM ahsoka_meeting_songs INNER JOIN ahsoka_posts WHERE meeting_id='$meetingid' AND ahsoka_meeting_songs.song_id = ahsoka_posts.ID ORDER BY add_date";
            $select_result = mysqli_query($connection, $sql_select);
            
            if ($select_result and $select_result->num_rows > 0) {
                $html_file = "<smm><body>";
                
                while($row = mysqli_fetch_array($select_result)) {
                    $song_id = $row['song_id'];
                    $content = $row['post_content'];
                    $title = $row['post_title'];
                    $flags = $row['flags'];
                    $transposition = $row['transposition'];
                    $songbook = "mmakos";
                    if ($song_id == 1) {
                        $songbook = "wywrota";
                        $content = '<div id="song"><song>' . get_wywrota_song($row['song_url']) . '</song></div>';
                        $title = $row['song_name'];
                    }

                    $split_content = explode('>', $content, 2);
                    if (count($split_content) > 1) {
                        $html_file = $html_file . $split_content[0] . " songbook='$songbook'><flags>$flags</flags><transposition>$transposition</transposition><h2>$title</h2>" . $split_content[1];
                    }
                }
                $html_file = $html_file . "</body></smm>";
                $zipped_html = gzencode($html_file);
                
                header('Content-disposition: attachment;filename=spiewnik_' . $meetingid . '.smm');
                echo $zipped_html;
            }
        }
    }
    header("Location: " . explode("?", $_SERVER['HTTP_REFERER'])[0]);

    function get_wywrota_song($url) {
        $html = file_get_contents($url);
        $song_start = strpos($html, '<div class="interpretation-content">');
        $song_start += strlen('<div class="interpretation-content">');
        $html = substr($html, $song_start);
        $song_end = strpos($html, '<div class="chord-boxes');
        $html = substr($html, 0, $song_end);
        $song_end = strpos($html, '<div class="login-banner');
        $html = substr($html, 0, $song_end);
        $song_end = strrpos($html, '</div>');
        $html = substr($html, 0, $song_end);
        return $html;
    }
?>