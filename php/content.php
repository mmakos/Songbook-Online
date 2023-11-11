<?php
/**
 * Template part for displaying posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Astrid
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>


	<header class="entry-header">
        <div style="overflow: hidden">
		<?php
			if ( is_single() ) {
				the_title( '<h1 class="entry-title" style="float: left">', '</h1>' );
			} else {
				the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
			}
		if ( 'post' === get_post_type() && get_theme_mod('hide_meta') != 1 ) : ?>

        <div class="song-options" style="float: right">
            <button title="Oddal tekst" class="svg-option-button zoom-song"><?php include 'svg.php'; getSvg("lupe"); ?></button>
            <button title="Zgłoś błąd" class="svg-option-button report-error" onclick="location.href='/kontakt/zglos-blad/?song=<?php the_ID(); ?>'"><?php getSvg("error"); ?></button>
            <button title="Chcę zaśpiewać" class="svg-option-button song-in-meeting"><?php getSvg("star"); ?></button>
            <button title="Dodaj do ulubionych" class="svg-option-button favourite-song"><?php getSvg("heart"); ?></button>
        </div>
        </div>
		<div class="entry-meta">
			<?php astrid_posted_on(); ?>
		</div><!-- .entry-meta -->
		<?php
		endif; ?>
	</header><!-- .entry-header -->

	<?php if ( has_post_thumbnail() && ( get_theme_mod( 'featured_image' ) != 1 ) ) : ?>
		<?php if ( is_single() ) : ?>
		<div class="single-thumb">
			<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_post_thumbnail('astrid-large-thumb'); ?></a>
		</div>
		<?php else : ?>
		<div class="entry-thumb">
			<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_post_thumbnail('astrid-medium-thumb'); ?></a>
		</div>
		<?php endif; ?>
	<?php endif; ?>

	<?php if ( is_single() ) : ?>
	<div class="entry-content" id="song-outer">
		<?php the_content(); ?>
	</div>
	<?php else : ?>
	<div class="entry-summary">
		<?php the_excerpt(); ?>
	</div>
	<div class="read-more clearfix">
		<a class="button post-button" href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php esc_html_e('Read more', 'astrid'); ?></a>
	</div>
	<?php endif; ?>

	<?php
		wp_link_pages( array(
			'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'astrid' ),
			'after'  => '</div>',
		) );
	?>

	<?php if ( is_single() && get_theme_mod('hide_meta') != 1 ) : ?>
	<footer class="entry-footer">
		<div class="transposition">
			<span>Transponuj: </span>
			<button style="width: 40px" onclick="transpose(1)">+1</button>
			<button style="width: 40px" onclick="transpose(-1)">-1</button>
			<span id="current-trans"></span>
			<button id="chord-options-button" style="text-transform: none; letter-spacing: 1px;" onclick="showChordOptions()">Więcej <i>(beta)</i></button>
		</div>
		<div id="chord-options" style="display: none; margin-top: 10px;">
		    <fieldset style="margin-bottom: 10px">
                <legend style="font-weight: bold">Gotowe presety:</legend>
                <div><input class="chord-option" name="chord-option" id="preset-beginner" type="radio" onclick="presetBeginner()"><label for="preset-beginner"> Początkujący</label></div>
                <div><input class="chord-option" name="chord-option" id="preset-intermediate" type="radio" onclick="presetIntermediate()"><label for="preset-intermediate"> Średniozaawansowany</label></div>
                <div><input class="chord-option" name="chord-option" id="preset-advanced" type="radio" onclick="presetAdvanced()"><label for="preset-advanced"> Zaawansowany</label></div>
		    </fieldset>
			<div><input class="chord-option" id="hide-uncommon-added-interval" type="checkbox" onclick="hideUncommonAddedInterval()"><span style="color: green;" title="Wspierane w wersji online i w generatorze">&#x2713;</span> Ukryj niestandardowe składniki (<sup>6&gt;</sup>, <sup>2&gt;</sup>, <sup>4&lt;</sup>, <sup>9(&gt;)</sup>) (<b>A<sup>6></sup>/A<sup>9&gt;</sup> → A</b>)</div>
			<div><input class="chord-option" id="aug-and-dim-guitar-mode" type="checkbox" onclick="augAndDimGuitarMode()"><span style="color: green;" title="Wspierane w wersji online i w generatorze">&#x2713;</span> Augmentacje i diminucje w notacji gitarowej (<b>A<sup>7&lt;</sup> e<sup>6&gt;</sup> → A<sup>7+</sup> e<sup>6-</sup></b>)</div>
			<div><input class="chord-option" id="divide-delays" type="checkbox" onclick="divideDelays()"><span style="color: orange;" title="Wspierane tylko w generatorze">&#x26A0;</span> Rozdziel opóźnienia na osobne akordy (<b>A<sup>4-3</sup> → A<sup>4</sup> A</b>)</div>
			<div><input class="chord-option" id="hide-incomplete-chords" type="checkbox" onclick="hideIncompleteChords()"><span style="color: green;" title="Wspierane w wersji online i w generatorze">&#x2713;</span> Ukryj puste kwinty i unison (<b>A<sup>1</sup>/A<sup>5</sup> → A</b>)</div>
			<div><input class="chord-option" id="simplify-multiply" type="checkbox" onclick="simplifyMultiply()"><span style="color: green;" title="Wspierane w wersji online i w generatorze">&#x2713;</span> Wyświetl max. 1 dodany składnik (<b>E<sup>64</sup> → E<sup>4</sup></b>)</div>
			<div><input class="chord-option" id="simplify-aug-to-guitar" type="checkbox" onclick="simplifyAugToGuitar()"><span style="color: green;" title="Wspierane w wersji online i w generatorze">&#x2713;</span> Akordy zmniejszone w notacji gitarowej, ukryj zwiększone (<b>e> → e<sup>0</sup></b>)</div>
			<div><input class="chord-option" id="hide-base" type="checkbox" onclick="hideBase()"><span style="color: green;" title="Wspierane w wersji online i w generatorze">&#x2713;</span> Ukryj składniki w basie (<b>A<sub>3</sub> → A</b>)</div>
			<div><input class="chord-option" id="hide-alternative-key-flag" type="checkbox" onclick="hideAlternativeKey()"><span style="color: green;" title="Wspierane w wersji online i w generatorze">&#x2713;</span> Ukryj alternatywne tonacje</div>
			<div><input class="chord-option" id="hide-key-mark-flag" type="checkbox" onclick="hideKeyMark()"><span style="color: green;" title="Wspierane w wersji online i w generatorze">&#x2713;</span> Ukryj oznaczenie tonacji <b><i>(A→B)</i></b></div>
			<div style="margin-top: 10px;"><button id="update-global-flags" style="padding: 0 5px; text-transform: none; letter-spacing: 1px;" onclick="updateGlobalFlags()">Aktualizuj globalne ustawienia</button>
		</div>
		<?php astrid_entry_footer(); ?>
		<script type="text/javascript" src="/scripts/transpose.js" crossorigin="anonymous"></script>
        <script type="text/javascript" src="/scripts/chordOptions.js" crossorigin="anonymous"></script>
        <script type="text/javascript" src="/scripts/zoomer.js" crossorigin="anonymous"></script>
	</footer><!-- .entry-footer -->
	<?php endif; ?>
</article><!-- #post-## -->
