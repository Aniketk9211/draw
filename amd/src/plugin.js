// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Tiny tiny_draw for Moodle.
 *
 * @module      plugintype_pluginname/plugin
 * @copyright   2024 Aniket Kumar <aniketkj9211@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


import {getTinyMCE} from 'editor_tiny/loader';
import {getPluginMetadata} from 'editor_tiny/utils';

import {component, pluginName} from './common';
import {getSetup as getCommandSetup} from './commands';
import * as Configuration from './configuration';


// Asynchronously initialize the plugin configuration and setup
/**
 * Initializes the TinyMCE plugin with configurations and command setups.
 * This function handles the asynchronous loading of necessary TinyMCE configurations
 * and setups the plugin with the editor.
 *
 * @async
 * @returns {Promise<[string, object]>} A promise that resolves to the plugin name and its configuration.
 */
async function initPlugin() {
    const [tinyMCE, pluginMetadata, setupCommands] = await Promise.all([
        getTinyMCE(),
        getPluginMetadata(component, pluginName),
        getCommandSetup(),  // Make sure this is awaited correctly
    ]);

    // Function to add the plugin to TinyMCE's PluginManager
    tinyMCE.PluginManager.add(pluginName, (editor) => {
        // Setup commands such as buttons, menu items, etc.
        console.log("Setting up commands...");  // remove
        console.log("setupCommands is:", setupCommands); //remove

        setupCommands(editor);

        // Return the pluginMetadata object, used by TinyMCE for the help link
        return pluginMetadata;
    });

    return [pluginName, Configuration];
}

// Export the initialized plugin
export default initPlugin();

