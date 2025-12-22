<?php
/**
 * Plugin Name:       JE Changelog Block
 * Plugin URI:        https://jeplugins.github.io/changelog-block
 * Description:       Beautiful changelog/release notes block for WordPress. Display your version history with style.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            JE Plugins
 * Author URI:        
 * 
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       je-changelog-block
 */

if (!defined('ABSPATH')) {
    exit;
}

define('JECHANGELOG_VERSION', '1.0.0');
define('JECHANGELOG_PATH', plugin_dir_path(__FILE__));
define('JECHANGELOG_URL', plugin_dir_url(__FILE__));

/**
 * Register blocks
 */
function jechangelog_register_blocks() {
    register_block_type(JECHANGELOG_PATH . 'build/changelog');
    register_block_type(JECHANGELOG_PATH . 'build/changelog-entry');
}
add_action('init', 'jechangelog_register_blocks');

/**
 * Register block category
 */
function jechangelog_block_category($categories) {
    array_unshift($categories, [
        'slug'  => 'jechangelog',
        'title' => 'Changelog',
        'icon'  => 'list-view',
    ]);
    return $categories;
}
add_filter('block_categories_all', 'jechangelog_block_category');

/**
 * Pass data to JavaScript
 */
function jechangelog_editor_assets() {
    wp_localize_script(
        'jechangelog-changelog-editor-script',
        'jechangelogData',
        [
            'isPro' => false,
            'upgradeUrl' => 'https://jeplugins.github.io/changelog-block',
        ]
    );
}
add_action('enqueue_block_editor_assets', 'jechangelog_editor_assets');