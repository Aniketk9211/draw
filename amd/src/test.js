import {component} from './common';

const openChemDoodleModal = (editor) => {
    editor.windowManager.open({
        title: 'Draw Chemical Structure',
        body: {
            type: 'panel',
            items: [
                {
                    type: 'htmlpanel',
                    html: '<div id="chemdoodle-draw" style="width: 400px; height: 400px;"></div>'
                }
            ]
        },
        buttons: [
            {
                type: 'cancel',
                text: 'Close'
            },
            {
                type: 'submit',
                text: 'Insert',
                primary: true
            }
        ],
        onAction: function (api) {
            insertChemicalStructure(editor);
            api.close();
        },
        onPostRender: function () {
            // Initialize ChemDoodle after the modal is displayed
            let sketcher = new ChemDoodle.SketcherCanvas('chemdoodle-draw', 400, 400);
            sketcher.repaint();
        }
    });
};
