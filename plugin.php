<?php

/**
 * @version $Id$
 * @copyright
 * @package neatline
 **/

define('NEATLINEFEATURES_PLUGIN_VERSION', get_plugin_ini('NeatlineFeatures', 'version'));
define('NEATLINEFEATURES_PLUGIN_DIR', dirname(__FILE__));


add_plugin_hook('install', 'neatlinefeatures_install');
add_plugin_hook('uninstall', 'neatlinefeatures_uninstall');
add_plugin_hook('define_routes', 'neatlinefeatures_routes');
add_plugin_hook('define_acl', 'neatlinefeatures_define_acl');
//add_filter(array('Form','Item','Dublin Core','Coverage'),"neatlinefeatures_map_widget");

function neatlinefeatures_uninstall()
{
	delete_option('neatlinefeatures_plugin_version');
}

function neatlinefeatures_install()
{
	$writer = new Zend_Log_Writer_Stream(LOGS_DIR . DIRECTORY_SEPARATOR . "neatline.log");
	$logger = new Zend_Log($writer);
	set_option('neatlinefeatures_version', NEATLINEFEATURES_PLUGIN_VERSION);

}

/**
 * Add the routes from routes.ini in this plugin folder.
 *
 * @return void
 **/
function neatlinefeatures_routes($router)
{
	$router->addConfig(new Zend_Config_Ini(NEATLINEFEATURES_PLUGIN_DIR .
	DIRECTORY_SEPARATOR . 'routes.ini', 'routes'));
}

function neatlinefeatures_define_acl($acl)
{
	// only allow super users and admins to edit shapes
	$acl->loadResourceList(array(
                                    'NeatlineFeatures_Features' => array('edit')
	));
}

function neatlinefeatures_map_widget($html,$inputNameStem,$value,$options,$record,$element)
{
	return "<div>WINNNN!!!!</div>";
}

