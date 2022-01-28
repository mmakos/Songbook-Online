<?php
function getSvg($svgName)
{
    if ($svgName == "star") {
        echo '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="svg-click-icon meeting-star">
    <polyline points="60.000,5.000 75.870,38.157 112.308,43.004 85.679,68.343 92.328,104.496 60.000,87.000 27.672,104.496 34.321,68.343 7.692,43.004 44.130,38.157 60.000,5.000 75.870,38.157" />
</svg>';
    } elseif ($svgName == "heart") {
        echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-30 0 530 470" class="svg-click-icon favourite-heart">
    <g>
        <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1
		c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3
		l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4
		C471.801,124.501,458.301,91.701,433.601,67.001z"/>
    </g>
</svg>';
    } elseif ($svgName == "lupe") {
        echo '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="svg-click-icon zoom-lupe">
    <circle cx="250" cy="150" r="135"/>
    <line x1="20" y1="380" x2="155" y2="245" />
    <line class="zoom-in-plus-vline" stroke="none" x1="250" y1="70" x2="250" y2="230" />
    <line x1="330" y1="150" x2="170" y2="150" />
</svg>';
    }
}
