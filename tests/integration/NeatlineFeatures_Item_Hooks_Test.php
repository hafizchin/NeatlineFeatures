<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * PHP version 5
 *
 * @package     omeka
 * @subpackage  nlfeatures
 * @author      Scholars' Lab <>
 * @author      Eric Rochester <erochest@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?><?php

require_once 'NeatlineFeatures_Test.php';
require_once 'application/helpers/FormFunctions.php';
require_once 'lib/NeatlineFeatures/Utils/View.php';
require_once 'models/NeatlineFeatureTable.php';

/**
 * This tests that item update and delete hooks are working properly.
 **/
class NeatlineFeatures_Item_Hooks_Test extends NeatlineFeatures_Test
{

    /**
     * This performs a little set up for this set of tests.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function setUp()
    {
        parent::setUp();
    }

    /**
     * This tears down after the tests.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function tearDown()
    {
        parent::tearDown();
    }

    /**
     * This tests that the item INSERT/UPDATE hook works properly.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function testInsertHook()
    {
        $item = new Item;
        $item->save();
        $this->toDelete($item);

        $text = $this->addElementText($item, $this->_title,
            '<b>testInsertHook</b>', TRUE);
        $this->toDelete($text);
        $text = $this->addElementText($item, $this->_coverage,
            "WKT: POINT(123, 456)\n\nSomthing", FALSE);
        $this->toDelete($text);

        $_POST['Elements'][(string)$this->_cutil->getElementId()] = array(
            '0' => array(
                'mapon' => '1',
                'text'  => ''
            )
        );
        $item->save();

        $features = $this
            ->db
            ->getTable('NeatlineFeature')
            ->createOrGetRecord($item);

        $this->assertTrue($features->isMap());
    }

    /**
     * This tests that the DELETE hook works properly.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function testDeleteHook()
    {
        $item = new Item;
        $item->save();

        $text = $this->addElementText($item, $this->_title,
            '<b>testDeleteHook</b>', TRUE);
        $this->toDelete($text);
        $text = $this->addElementText($item, $this->_coverage,
            "WKT: POINT(123, 456)\n\nSomthing", FALSE);
        $this->toDelete($text);

        $_POST['Elements'][(string)$this->_cutil->getElementId()] = array(
            '0' => array(
                'mapon' => '1',
                'text'  => ''
            )
        );
        $item->save();

        $item_id = $item->id;
        $item->delete();

        $results = $this
            ->db
            ->getTable('NeatlineFeature')
            ->findBy(array( 'item_id' => $item_id ));

        $this->assertNull($results);
    }

}

