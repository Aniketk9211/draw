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
 * Commands helper for the Moodle tiny_draw plugin.
 *
 * @module      plugintype_pluginname/commands
 * @copyright   2024 Aniket Kumar <aniketkj9211@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import { getButtonImage } from "editor_tiny/utils";
// import {get_string as getString} from 'core/str';
import { component, icon, buttonName } from "./common";
import Config from "core/config";

// function loadScript(url) {
//     return new Promise((resolve, reject) => {
//         var script = document.createElement('script');
//         script.type = 'text/javascript';
//         script.src = url;
//         script.onload = resolve;
//         script.onerror = reject;
        // document.head.appendChild(script);
//     });
// }

function loadScript(url) {
  return new Promise((resolve, reject) => {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = () => {
      console.log(`Successfully loaded: ${url}`);
      resolve();
    };
    script.onerror = () => {
      console.error(`Failed to load script: ${url}`);
      reject(new Error(`Failed to load script: ${url}`));
    };
    document.body.appendChild(script); // Appending to the body instead of the head
  });
}

function loadCSS(url) {
  return new Promise((resolve, reject) => {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

async function loadChemDoodleComponents() {
  try {
    await loadScript(
      `${Config.wwwroot}/lib/editor/tiny/plugins/draw/lib/ChemDoodle/install/ChemDoodleWeb.js`
    );

    await loadCSS(
      `${Config.wwwroot}/lib/editor/tiny/plugins/draw/lib/ChemDoodle/install/ChemDoodleWeb.css`
    );

    await loadCSS(
      `${Config.wwwroot}/lib/editor/tiny/plugins/draw/lib/ChemDoodle/install/is/jquery-ui-1.11.4.css`
    );

    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second

    await loadScript(
      `${Config.wwwroot}/lib/editor/tiny/plugins/draw/lib/ChemDoodle/install/is/ChemDoodleWeb-uis.js`
    );

    console.log("All ChemDoodle components loaded successfully");
  } catch (error) {
    console.error("Failed to load ChemDoodle components:", error);
  }
}

const insertChemicalStructure = (editor, sketcher) => {
  // let molFile = sketcher.getMolecule().toMol();
  let imageData = sketcher.canvas.toDataURL("image/png");
  editor.insertContent(`<img src="${imageData}" />`);
};

const openChemDoodleModal = (editor) => {
  editor.windowManager.open({
    title: "Draw Chemical Structure",
    body: {
      type: "panel",
      items: [
        {
          type: "htmlpanel", // Use htmlpanel or iframe to embed ChemDoodle
          html: '<div id="chemdoodle-draw" style="width: 800px; height: 400px;"></div>',
        },
      ],
    },
    buttons: [
      {
        type: "cancel",
        text: "Close",
      },
      {
        type: "submit",
        text: "Insert",
        primary: true,
      },
    ],
    onSubmit: function (api) {
      insertChemicalStructure(editor);
      api.close();
    },
    onPostRender: function () {
      // Initialize ChemDoodle after the modal is displayed
      // let sketcher = new ChemDoodle.SketcherCanvas('chemdoodle-draw', 500, 300);
      let sketcher = new ChemDoodle.SketcherCanvas(
          800,
          300,
        "chemdoodle-draw",
        { useServices: true }
        
      );
      sketcher.repaint();
    },
  });
};

/**
 * Handle the action for your plugin.
 * @param {TinyMCE.editor} editor The tinyMCE editor instance.
 */

const handleAction = (editor) => {
  // Check if ChemDoodle is already loaded or not
  if (typeof ChemDoodle === "undefined") {
    loadChemDoodleComponents(() => {
      openChemDoodleModal(editor);
    });
  } else {
    openChemDoodleModal(editor);
  }
};

/**
 * Get the setup function for the buttons.
 *
 * This is performed in an async function which ultimately returns the registration function as the
 * Tiny.AddOnManager.Add() function does not support async functions.
 *
 * @returns {function} The registration function to call within the Plugin.add function.
 */

export const getSetup = async () => {
  const buttonImage = await getButtonImage("icon", component);

  return (editor) => {
    // Register the Moodle SVG as an icon suitable for use as a TinyMCE toolbar button.
    editor.ui.registry.addIcon(icon, buttonImage.html);

    // Add a button to the toolbar
    editor.ui.registry.addButton(buttonName, {
      tooltip: buttonName,
      icon: icon,
      onAction: () => handleAction(editor),
    });

    // Add an item to the menubar
    editor.ui.registry.addMenuItem(buttonName, {
      icon,
      text: buttonName,
      context: "tools",
      onAction: () => handleAction(editor),
    });
  };
};
