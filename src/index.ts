import {
    JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
    ICommandPalette
} from '@jupyterlab/apputils';

import {
    IEditorTracker
} from '@jupyterlab/fileeditor';

import {
    INotebookTracker
} from '@jupyterlab/notebook';

import '../style/index.css';


/**
 * Initialization data for the jupyterlab_wakatime extension.
 */
const extension: JupyterLabPlugin<void> = {
    id: 'jupyterlab_wakatime',
    autoStart: true,
    requires: [IEditorTracker, INotebookTracker, ICommandPalette],
    activate: (app: JupyterLab, edit_tracker: IEditorTracker, nb_tracker: INotebookTracker, palette: ICommandPalette) => {
        console.log('JupyterLab extension jupyterlab_wakatime is activated!');
        console.log('The editor tracker is:', edit_tracker);

        // successfully tracks when the editor/notebook changes. Also need to track
        // when content inside the widget changes or when the widget is saved.
        edit_tracker.currentChanged.connect((editor) => { console.log('Editor changed: ', editor) });
        nb_tracker.currentChanged.connect((nb) => { console.log('Notebook changed: ', nb) });

        /* For notebooks the plan is:
          - store a this._current_cell -- update when nb_tracker.activeCellChanged fires
            - use `this._current_cell.editor.addKeydownHandler` to listen for when edits are made to the cell
            - In the handler, we will grab the current notebook and extract any info we need from it so we can send the message to wakatime
        */

        /* For editors:
          - store a this._current_editor -- update when edit_tracker.currentChanged fires
            - use `this._current_editor.addKeydownHandler` to listen for when edits are made to the file
            - In the handler, we will grab the current notebook and extract any info we need from it so we can send the message to wakatime
        */

        const command: string = "wakatime:log_current_editor";
        app.commands.addCommand(command, {
            label: "log current editor",
            execute: () => {
                let editor = edit_tracker.currentWidget;
                console.log("The current widget is:", editor);
                if (editor !== null) {
                    console.log("(T/F) the editor is visible:", editor.isVisible);
                    console.log("(T/F) the editor has focus:", editor.editor.hasFocus());
                } else {
                    console.log("(T/F) the editor is visible:", false);
                    console.log("(T/F) the editor has focus:", false);
                }
            },

        })
        palette.addItem({ command, category: 'Wakatime' });

        const command2: string = "wakatime:log_current_notebook";
        app.commands.addCommand(command2, {
            label: "log current notebook",
            execute: () => {
                let nb = nb_tracker.currentWidget;
                console.log("The current nb widget is:", nb);
                console.log("this.node: ", nb.node);
                console.log("node has focus ", nb.node.contains(document.activeElement));
                if (nb !== null) {
                    console.log("(T/F) the nb is visible:", nb.isVisible);
                    console.log("(T/F) the nb has focus:", nb.notebook.activeCell.editor.hasFocus());
                } else {
                    console.log("(T/F) the nb is visible:", false);
                    console.log("(T/F) the nb has focus:", false);
                }
            },

        })
        palette.addItem({ command: command2, category: 'Wakatime' });
    }
};

export default extension;
