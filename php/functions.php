<?php
/**
 * Astrid functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Astrid
 */

if ( ! function_exists( 'astrid_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function astrid_setup() {
	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on Astrid, use a find and replace
	 * to change 'astrid' to the name of your theme in all the template files.
	 */
	load_theme_textdomain( 'astrid', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );
	add_image_size('astrid-large-thumb', 700);
	add_image_size('astrid-medium-thumb', 520);
	add_image_size('astrid-small-thumb', 360);
	add_image_size('astrid-project-thumb', 500, 310, true);
	add_image_size('astrid-client-thumb', 250);
	add_image_size('astrid-testimonial-thumb', 100);

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' 	=> esc_html__( 'Primary', 'astrid' ),
		'footer' 	=> esc_html__( 'Footer', 'astrid' ),
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	/*
	 * Enable support for Post Formats.
	 * See https://developer.wordpress.org/themes/functionality/post-formats/
	 */
	add_theme_support( 'post-formats', array(
		'aside',
		'image',
		'video',
		'quote',
		'link',
	) );

	// Set up the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( 'astrid_custom_background_args', array(
		'default-color' => 'f5f9f8',
		'default-image' => '',
	) ) );

	add_theme_support( 'custom-logo', array(
		'height'      => 80,
		'width'       => 200,
		'flex-height' => true,
	) );
}
endif;
add_action( 'after_setup_theme', 'astrid_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function astrid_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'astrid_content_width', 640 );
}
add_action( 'after_setup_theme', 'astrid_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function astrid_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'astrid' ),
		'id'            => 'sidebar-1',
		'description'   => '',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );

	//Register widget areas for the Widgetized page template
	$pages = get_pages(array(
		'meta_key' => '_wp_page_template',
		'meta_value' => 'page-templates/page_widgetized.php',
	));

	foreach($pages as $page){
		register_sidebar( array(
			'name'          => esc_html__( 'Page - ', 'astrid' ) . $page->post_title,
			'id'            => 'widget-area-' . strtolower($page->post_name),
			'description'   => esc_html__( 'Use this widget area to build content for the page: ', 'astrid' ) . $page->post_title,
			'before_widget' => '<section id="%1$s" class="widget %2$s"><div class="atblock container">',
			'after_widget'  => '</div></section>',
			'before_title'  => '<h2 class="widget-title"><span class="title-decoration"></span>',
			'after_title'   => '</h2>',
		) );
	}

	//Footer widget areas
	$widget_areas = get_theme_mod('footer_widget_areas', '3');
	for ($i=1; $i<=$widget_areas; $i++) {
		register_sidebar( array(
			'name'          => __( 'Footer ', 'astrid' ) . $i,
			'id'            => 'footer-' . $i,
			'description'   => '',
			'before_widget' => '<aside id="%1$s" class="widget %2$s">',
			'after_widget'  => '</aside>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		) );
	}

	register_widget( 'Atframework_Services' );
	register_widget( 'Atframework_Skills' );
	register_widget( 'Atframework_Facts' );
	register_widget( 'Atframework_Employees' );
	register_widget( 'Atframework_Projects' );
	register_widget( 'Atframework_Testimonials' );
	register_widget( 'Atframework_Clients' );
	register_widget( 'Atframework_Posts' );
	register_widget( 'Atframework_Video' );
	register_widget( 'Atframework_Recent_Posts' );
	register_widget( 'Atframework_Social' );

}
add_action( 'widgets_init', 'astrid_widgets_init' );

//Homepage widgets
$astrid_widgets = array('services', 'skills', 'facts', 'employees', 'projects', 'testimonials', 'clients', 'posts');
foreach ( $astrid_widgets as $astrid_widget) {
	locate_template( '/inc/framework/widgets/front-' . $astrid_widget . '.php', true, false );
}

//Sidebar widgets
require get_template_directory() . "/inc/framework/widgets/video-widget.php";
require get_template_directory() . "/inc/framework/widgets/posts-widget.php";
require get_template_directory() . "/inc/framework/widgets/social-widget.php";

/**
 * Enqueue scripts and styles.
 */
function astrid_scripts() {
	wp_enqueue_style( 'astrid-style', get_stylesheet_uri() );

	$body_font 		= get_theme_mod('body_font_name', '//fonts.googleapis.com/css?family=Open+Sans:300,300italic,600,600italic');
	$headings_font 	= get_theme_mod('headings_font_name', '//fonts.googleapis.com/css?family=Josefin+Sans:300italic,300');
	$remove 		= array("<link href='", "' rel='stylesheet' type='text/css'>", "https:", "http:");
	$body_url 		= str_replace($remove, '', $body_font);
	$headings_url 	= str_replace($remove, '', $headings_font);

	wp_enqueue_style( 'astrid-body-fonts', esc_url($body_url) );

	wp_enqueue_style( 'astrid-headings-fonts', esc_url($headings_url) );

	wp_enqueue_style( 'font-awesome', get_template_directory_uri() . '/fonts/font-awesome.min.css' );

	wp_enqueue_script( 'astrid-main', get_template_directory_uri() . '/js/main.js', array('jquery'), '', true );

	wp_enqueue_script( 'astrid-scripts', get_template_directory_uri() . '/js/scripts.min.js', array('jquery'), '20210510', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	if ( astrid_blog_layout() == 'masonry-layout' && (is_home() || is_archive()) ) {
		wp_enqueue_script( 'astrid-masonry-init', get_template_directory_uri() . '/js/masonry-init.js', array('masonry'), '', true );
	}

	wp_enqueue_script( 'astrid-html5shiv', get_template_directory_uri() . '/js/html5shiv.js', array(), '', true );
    wp_script_add_data( 'astrid-html5shiv', 'conditional', 'lt IE 9' );

}
add_action( 'wp_enqueue_scripts', 'astrid_scripts' );

/**
 * Enqueue Bootstrap
 */
function astrid_enqueue_bootstrap() {
	wp_enqueue_style( 'bootstrap', get_template_directory_uri() . '/css/bootstrap/bootstrap.min.css', array(), true );
}
add_action( 'wp_enqueue_scripts', 'astrid_enqueue_bootstrap', 9 );


/**
 * Customizer styles
 */
function astrid_customizer_styles($hook) {
    if ( ( 'customize.php' != $hook ) && ( 'widgets.php' != $hook ) ) {
        return;
    }
	wp_enqueue_style( 'astrid-customizer-styles', get_template_directory_uri() . '/inc/framework/css/customizer.css' );
}
add_action( 'admin_enqueue_scripts', 'astrid_customizer_styles' );

/**
 * Blog layout
 */
function astrid_blog_layout() {
	$layout = get_theme_mod('blog_layout','list');
	return $layout;
}

/**
 * Remove archives labels
 */
function astrid_category_label($title) {
    if ( is_category() ) {
        $title = '<i class="fa fa-folder-o"></i>' . single_cat_title( '', false );
    } elseif ( is_tag() ) {
        $title = '<i class="fa fa-tag"></i>' . single_tag_title( '', false );
    } elseif ( is_author() ) {
		$title = '<span class="vcard"><i class="fa fa-user"></i>' . get_the_author() . '</span>';
	}
    return $title;
}
add_filter('get_the_archive_title', 'astrid_category_label');

/**
 * Header image check
 */
function astrid_has_header() {
	$front_header = get_theme_mod('front_header_type' ,'image');
	$site_header = get_theme_mod('site_header_type', 'nothing');
	global $post;
	if ( !is_404() || !is_search() ) {
		$single_toggle = get_post_meta( $post->ID, '_astrid_single_header_shortcode', true );
	} else {
		$single_toggle = false;
	}

	if ($single_toggle != '') {
		return 'has-single';
	} else {
		if ( get_header_image() && ( $front_header == 'image' && is_front_page() ) || ( $site_header == 'image' && !is_front_page() ) ) {
			return 'has-header';
		} elseif ( ($front_header == 'shortcode' && is_front_page()) || ($site_header == 'shortcode' && !is_front_page()) ) {
			return 'has-shortcode';
		} elseif ( ($front_header == 'video' && is_front_page()) || ($site_header == 'video' && !is_front_page()) ) {
			return 'has-video';
		}
	}
}

/**
 * Full width single posts
 */
function astrid_fullwidth_singles($classes) {
	if ( function_exists('is_woocommerce') ) {
		$woocommerce = is_woocommerce();
	} else {
		$woocommerce = false;
	}

	$single_layout = get_theme_mod('fullwidth_single', 0);
	if ( is_single() && !$woocommerce && $single_layout ) {
		$classes[] = 'fullwidth-single';
	}
	return $classes;
}
add_filter('body_class', 'astrid_fullwidth_singles');

/**
 * Polylang compatibility
 */
if ( function_exists('pll_register_string') ) :
function astrid_polylang() {
	pll_register_string('Header text', get_theme_mod('header_text'), 'Astrid');
	pll_register_string('Header subtext', get_theme_mod('header_subtext'), 'Astrid');
	pll_register_string('Header button', get_theme_mod('header_button'), 'Astrid');
}
add_action( 'admin_init', 'astrid_polylang' );
endif;

/**
 * Header text
 */
function astrid_header_text() {

	if ( !function_exists('pll_register_string') ) {
		$header_text 		= get_theme_mod('header_text');
		$header_subtext 	= get_theme_mod('header_subtext');
		$header_button		= get_theme_mod('header_button');
	} else {
		$header_text 		= pll__(get_theme_mod('header_text'));
		$header_subtext 	= pll__(get_theme_mod('header_subtext'));
		$header_button		= pll__(get_theme_mod('header_button'));
	}
	$header_button_url	= get_theme_mod('header_button_url');

	echo '<div class="header-info">
			<div class="container">
				<h4 class="header-subtext">' . wp_kses_post($header_subtext) . '</h4>
				<h3 class="header-text">' . wp_kses_post($header_text) . '</h3>';
				if ($header_button_url) {
					echo '<a class="button header-button" href="' . esc_url($header_button_url) . '">' . esc_html($header_button) . '</a>';
				}
	echo 	'</div>';
	echo '</div>';
}

/**
 * Site branding
 */
if ( ! function_exists( 'astrid_branding' ) ) :
function astrid_branding() {
	$site_logo = get_theme_mod('site_logo');
	if ( function_exists( 'the_custom_logo' ) && has_custom_logo() ) {
		the_custom_logo();
	} elseif ( $site_logo ) {
		echo '<a href="' . esc_url( home_url( '/' ) ) . '" title="' . esc_attr(get_bloginfo('name')) . '"><img class="site-logo" src="' . esc_url($site_logo) . '" alt="' . esc_attr(get_bloginfo('name')) . '" /></a>';
	} else {
		if ( is_front_page() && is_home() ) {
			echo '<h1 class="site-title"><a href="' . esc_url( home_url( '/' ) ) . '" rel="home">' . esc_html(get_bloginfo('name')) . '</a></h1>';
		} else {
			echo '<p class="site-title"><a href="' . esc_url( home_url( '/' ) ) . '" rel="home">' . esc_html(get_bloginfo('name')) . '</a></p>';
		}
		echo '<p class="site-description">' . esc_html(get_bloginfo( 'description' )) . '</p>';
	}
}
endif;

/**
 * Footer site branding
 */
if ( ! function_exists( 'astrid_footer_branding' ) ) :
function astrid_footer_branding() {
	$footer_logo = get_theme_mod('footer_logo');
	echo '<div class="footer-branding">';
	if ( $footer_logo ) :
		echo '<a href="' . esc_url( home_url( '/' ) ) . '" title="' . esc_attr(get_bloginfo('name')) . '"><img class="footer-logo" src="' . esc_url($footer_logo) . '" alt="' . esc_attr(get_bloginfo('name')) . '" /></a>';
	else :
		echo '<h2 class="site-title-footer"><a href="' . esc_url( home_url( '/' ) ) . '" rel="home">' . esc_html(get_bloginfo('name')) . '</a></h1>';
	endif;
	echo '</div>';
}
endif;

/**
 * Footer contact
 */
if ( ! function_exists( 'astrid_footer_contact' ) ) :
function astrid_footer_contact() {
	$footer_contact_address = get_theme_mod('footer_contact_address');
	$footer_contact_email   = antispambot(get_theme_mod('footer_contact_email'));
	$footer_contact_phone 	= get_theme_mod('footer_contact_phone');

	echo '<div class="footer-contact">';
	if ($footer_contact_address) {
		echo '<div class="footer-contact-block">';
		echo 	'<i class="fa fa-home"></i>';
		echo 	'<span>' . esc_html($footer_contact_address) . '</span>';
		echo '</div>';
	}
	if ($footer_contact_email) {
		echo '<div class="footer-contact-block">';
		echo 	'<i class="fa fa-envelope"></i>';
		echo 	'<span><a href="mailto:' . esc_attr($footer_contact_email) . '">' . esc_html($footer_contact_email) . '</a></span>';
		echo '</div>';
	}
	if ($footer_contact_phone) {
		echo '<div class="footer-contact-block">';
		echo 	'<i class="fa fa-phone"></i>';
		echo 	'<span>' . esc_html($footer_contact_phone) . '</span>';
		echo '</div>';
	}
	echo '</div>';

}
endif;

/**
 * Clearfix posts
 */
function astrid_clearfix_posts( $classes ) {
	$classes[] = 'clearfix';
	return $classes;
}
add_filter( 'post_class', 'astrid_clearfix_posts' );

/**
 * Excerpt length
 */
function astrid_excerpt_length( $length ) {
  $excerpt = get_theme_mod('exc_length', '40');
  return absint($excerpt);
}
add_filter( 'excerpt_length', 'astrid_excerpt_length', 99 );

/**
* Footer credits
*/
function astrid_footer_credits() {
	echo '<a href="' . esc_url( __( 'https://wordpress.org/', 'astrid' ) ) . '">';
		printf( __( 'Powered by %s', 'astrid' ), 'WordPress' );
	echo '</a>';
	echo '<span class="sep"> | </span>';
	printf( __( 'Theme: %2$s by %1$s.', 'astrid' ), 'aThemes', '<a href="http://athemes.com/theme/astrid" rel="nofollow">Astrid</a>' );
}
add_action( 'astrid_footer', 'astrid_footer_credits' );

function astrid_remove_page_template() {

	if ( !function_exists('astrid_pro_load_widgets') ) {

	    global $pagenow;
	    if ( in_array( $pagenow, array( 'post-new.php', 'post.php') ) && get_post_type() == 'page' ) { ?>
	        <script type="text/javascript">
	            (function($){
	                $(document).ready(function(){
	                    $('#page_template option[value="single-event.php"]').remove();
	                    $('#page_template option[value="single-pricing.php"]').remove();
	                })
	            })(jQuery)
	        </script>
	    <?php
	    }
	}
}
add_action('admin_footer', 'astrid_remove_page_template', 10);

/*
 * Disable Elementor globals
 */
function astrid_disable_elementor_globals() {

	update_option( 'elementor_disable_color_schemes', 'yes' );
	update_option( 'elementor_disable_typography_schemes', 'yes' );

}
add_action('after_switch_theme', 'astrid_disable_elementor_globals');

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';

/**
 * Widget options
 */
require get_template_directory() . '/inc/framework/widget-options.php';

/**
 * Styles
 */
require get_template_directory() . '/inc/styles.php';

/**
 * Woocommerce
 */
require get_template_directory() . '/woocommerce/woocommerce.php';


/**
 * Gutenberg
 */
add_theme_support( 'align-wide' );

function astrid_editor_styles() {
	wp_enqueue_style( 'astrid-block-editor-styles', get_theme_file_uri( '/astrid-gutenberg-editor-styles.css' ), '', '1.0', 'all' );

	$body_font 		= get_theme_mod('body_font_name', '//fonts.googleapis.com/css?family=Open+Sans:300,300italic,600,600italic');
	$headings_font 	= get_theme_mod('headings_font_name', '//fonts.googleapis.com/css?family=Josefin+Sans:300italic,300');
	$remove 		= array("<link href='", "' rel='stylesheet' type='text/css'>", "https:", "http:");
	$body_url 		= str_replace($remove, '', $body_font);
	$headings_url 	= str_replace($remove, '', $headings_font);

	wp_enqueue_style( 'astrid-body-fonts', esc_url($body_url) );

	wp_enqueue_style( 'astrid-headings-fonts', esc_url($headings_url) );

	//Dynamic styles
	$custom = '';

	//Fonts
	$body_fonts 	= get_theme_mod('body_font_family');
	$headings_fonts = get_theme_mod('headings_font_family');
	if ( $body_fonts !='' ) {
		$custom .= ".editor-block-list__layout, .editor-block-list__layout .editor-block-list__block { font-family:" . $body_fonts . ";}"."\n";
	}
	if ( $headings_fonts !='' ) {
		$custom .= ".editor-post-title__block .editor-post-title__input, .editor-block-list__layout .editor-post-title__input, .editor-block-list__layout h1, .editor-block-list__layout h2, .editor-block-list__layout h3, .editor-block-list__layout h4, .editor-block-list__layout h5, .editor-block-list__layout h6 { font-family:" . $headings_fonts . ";}"."\n";
	}


	//H1 size
	$h1_size = get_theme_mod( 'h1_size','36' );
	if ($h1_size) {
		$custom .= ".editor-block-list__layout h1 { font-size:" . intval($h1_size) . "px; }"."\n";
	}
	//H2 size
	$h2_size = get_theme_mod( 'h2_size','30' );
	if ($h2_size) {
		$custom .= ".editor-block-list__layout h2 { font-size:" . intval($h2_size) . "px; }"."\n";
	}
	//H3 size
	$h3_size = get_theme_mod( 'h3_size','24' );
	if ($h3_size) {
		$custom .= ".editor-block-list__layout h3 { font-size:" . intval($h3_size) . "px; }"."\n";
	}
	//H4 size
	$h4_size = get_theme_mod( 'h4_size','16' );
	if ($h4_size) {
		$custom .= ".editor-block-list__layout h4 { font-size:" . intval($h4_size) . "px; }"."\n";
	}
	//H5 size
	$h5_size = get_theme_mod( 'h5_size','14' );
	if ($h5_size) {
		$custom .= ".editor-block-list__layout h5 { font-size:" . intval($h5_size) . "px; }"."\n";
	}
	//H6 size
	$h6_size = get_theme_mod( 'h6_size','12' );
	if ($h6_size) {
		$custom .= ".editor-block-list__layout h6 { font-size:" . intval($h6_size) . "px; }"."\n";
	}
	//Body size
	$body_size = get_theme_mod( 'body_size', '14' );
	if ($body_size) {
		$custom .= ".editor-block-list__block, .editor-block-list__block p { font-size:" . intval($body_size) . "px; }"."\n";
	}

	//Body
	$body_text = get_theme_mod( 'body_text_color', '#656D6D' );
	$custom .= ".editor-block-list__layout, .editor-block-list__layout .editor-block-list__block { color:" . esc_attr($body_text) . "}"."\n";

	//Small screens font sizes
	$custom .= "@media only screen and (max-width: 780px) {
		h1 { font-size: 32px;}
		h2 { font-size: 28px;}
		h3 { font-size: 22px;}
		h4 { font-size: 18px;}
		h5 { font-size: 16px;}
		h6 { font-size: 14px;}
	}" . "\n";


	//Output all the styles
	wp_add_inline_style( 'astrid-block-editor-styles', $custom );

}
add_action( 'enqueue_block_editor_assets', 'astrid_editor_styles' );


// MOJE FUNKCJE
function myplugins_ajaxurl() {

   echo '<script type="text/javascript">
           var ajaxurl = "' . admin_url('admin-ajax.php') . '";
         </script>';
}
add_action('wp_head', 'myplugins_ajaxurl');

function get_database_connection() {
    return mysqli_connect("localhost", "mmakos_ahsoka", "f5U-96p(S5", "mmakos_ahsoka");
}

function set_cookie_if_allowed($name, $value, $expire) {
    if ($_COOKIE['cookie_notice_accepted'] == 'true') {
        setcookie($name, $value, $expire, "/");
    }
}

function leave_meeting() {
    set_cookie_if_allowed("meeting", "", time() - 3600);
}
add_action('wp_ajax_leave_meeting', 'leave_meeting');
add_action('wp_ajax_nopriv_leave_meeting', 'leave_meeting');

function join_meeting() {
    $connection = get_database_connection();

    if ($connection) {
        $meeting_id = $_REQUEST['meeting-id'];
        $sql_select = "SELECT id FROM ahsoka_meetings WHERE id='$meeting_id'";

        $select_result = mysqli_query($connection, $sql_select);
        if (!$select_result || $select_result->num_rows < 1) {
            echo json_encode(array(
                'status' => 'failed'
            ));
        } else {
            set_cookie_if_allowed('meeting', $meeting_id, time() + 86400);
            echo json_encode(array(
                'status' => 'success',
                'meeting_id' => $meeting_id
            ));
        }
    }
    die();
}
add_action('wp_ajax_join_meeting', 'join_meeting');
add_action('wp_ajax_nopriv_join_meeting', 'join_meeting');

function get_songs_with_ids() {
    $ids = explode(",", $_REQUEST['song-ids']);
    $result = "";
    foreach ($ids as $song) {
        $title = get_the_title($song);
        if (strlen($title) > 0) {
            $url = "https://spiewnik.mmakos.pl/?p=" . $song;
            $result = $result . '<a href="' . $url . '">' . $title . '</a>';
        }
    }
    echo json_encode(array("favourites" => $result));
    die();
}
add_action('wp_ajax_get_songs_with_ids', 'get_songs_with_ids');
add_action('wp_ajax_nopriv_get_songs_with_ids', 'get_songs_with_ids');

function get_meeting_songs() {
    get_meeting_songs_with_arguments();
}

function get_meeting_songs_with_arguments($addArgs=array()) {
    $connection = get_database_connection();

    if ($connection && isset($_COOKIE['meeting'])) {
        $meeting_id = $_COOKIE['meeting'];
        $sql_select = "SELECT post_title, song_id, add_date FROM ahsoka_meeting_songs INNER JOIN ahsoka_posts WHERE meeting_id='$meeting_id' AND ahsoka_meeting_songs.song_id = ahsoka_posts.ID ORDER BY add_date";
        $select_result = mysqli_query($connection, $sql_select);
        if ($select_result) {
            if ($select_result->num_rows > 0) {
                $result = '';

                $isCurrentInMeeting = false;
                $currentSong = url_to_postid( wp_get_referer() );
                while ($row = mysqli_fetch_array($select_result)) {
                    $id = $row['song_id'];
                    $name = $row['post_title'];
                    $url = "https://spiewnik.mmakos.pl/?p=" . $id;
                    $result = $result . '<a class="dropzone" draggable="true" href="' . $url . '" id="song:' . $id . '">' . $name . '</a>';

                    if ($currentSong == $id) {
                        $isCurrentInMeeting = true;
                    }
                }
                echo json_encode(array_merge(array("queue" => $result, "song-in-meeting" => $isCurrentInMeeting), $addArgs));
            }
            else {
                echo json_encode(array_merge(array("info" => "Na tym spotkaniu nie ma ??adnych piosenek w kolejce."), $addArgs));
            }
        } else {
            echo json_encode(array_merge(array("info" => "Nie uda??o si?? pobra?? piosenek dla spotkania $meeting_id"), $addArgs));
        }
    }
    die();
}
add_action('wp_ajax_get_meeting_songs', 'get_meeting_songs');
add_action('wp_ajax_nopriv_get_meeting_songs', 'get_meeting_songs');

function song_in_meeting_action() {
    $connection = get_database_connection();

    if ($connection && isset($_COOKIE['meeting'])) {
        $meeting_id = $_COOKIE['meeting'];
        $url = wp_get_referer();
        $song_id = url_to_postid( $url );

        $sql = "";
        if ($_REQUEST['song-action'] == 'add') {
            $time = DateTime::createFromFormat('U.u', number_format(microtime(true), 6, '.', ''))->format("Y-m-d H:i:s.u");
            $sql = "INSERT INTO ahsoka_meeting_songs(meeting_id, song_id, add_date) VALUES ('$meeting_id', $song_id, '$time')";
        } else if ($_REQUEST['song-action'] == 'remove') {
            $sql = "DELETE FROM ahsoka_meeting_songs WHERE meeting_id='$meeting_id' AND song_id=$song_id";
        }

        $result = mysqli_query($connection, $sql);
        if (!$result) {
            get_meeting_songs_with_arguments(array("info" => "Nie uda??o si?? zmodyfikowa?? kolejki w bazie danych.", "status" => "failed"));
        } else {
            get_meeting_songs_with_arguments(array("status" => "success"));
        }
    } else {
        echo json_encode(array("info" => "Nie uda??o si?? po????czy?? z baz?? danych.", "status" => "failed"));
    }

    die();
}
add_action('wp_ajax_song_in_meeting_action', 'song_in_meeting_action');
add_action('wp_ajax_nopriv_song_in_meeting_action', 'song_in_meeting_action');

function order_meeting() {
    $connection = get_database_connection();

    if ($connection && isset($_COOKIE['meeting'])) {
        $meeting_id = $_COOKIE['meeting'];
        $song_list = $_REQUEST['song-order'];
        $sql = "";

        $time = microtime(true);
        foreach ($song_list as $song) {
            $song_ids = explode(':', $song);
            if (count($song_ids) > 1) {
                $song_id = $song_ids[1];
                $now = DateTime::createFromFormat('U.u', number_format($time, 6, '.', ''))->format("Y-m-d H:i:s.u");
                $sql .= "UPDATE ahsoka_meeting_songs SET add_date = '$now' WHERE meeting_id = '$meeting_id' AND song_id = $song_id;";
                $time += 0.000001;
            }
        }

        $connection->multi_query($sql);
    } else {
        echo "Nie uda??o si?? po????czy?? z baz?? danych";
    }

    die();
}
add_action('wp_ajax_order_meeting', 'order_meeting');
add_action('wp_ajax_nopriv_order_meeting', 'order_meeting');