const vscode = require('vscode');

function activate(context) {

    const COLOR_DECORATION_TYPE = vscode.window.createTextEditorDecorationType({});
    const hexRegex = /-\[#([0-9a-fA-F]{3,8})\]/g;

    function updateDecorations(editor) {
        if (!editor || editor.document.languageId !== 'svelte') return;

        const text = editor.document.getText();
        const colorInfos = [];

        for (const match of text.matchAll(hexRegex)) {
            const hex = match[1];
            const hashOffset = match[0].indexOf('#');
            if (hashOffset === -1) continue;

            const index = match.index + hashOffset;
            const startPos = editor.document.positionAt(index);
            const endPos = startPos.with(undefined, startPos.character + hex.length + 1);

            colorInfos.push({
                range: new vscode.Range(startPos, endPos),
                color: hexToColor('#' + hex)
            });
        }

        editor.setDecorations(COLOR_DECORATION_TYPE, colorInfos);
    }


    function hexToColor(hex) {
        try {
            if (hex.length === 4) {
                // #rgb
                const r = parseInt(hex[1] + hex[1], 16) / 255;
                const g = parseInt(hex[2] + hex[2], 16) / 255;
                const b = parseInt(hex[3] + hex[3], 16) / 255;
                return new vscode.Color(r, g, b, 1);
            }

            if (hex.length === 5) {
                // #rgba
                const r = parseInt(hex[1] + hex[1], 16) / 255;
                const g = parseInt(hex[2] + hex[2], 16) / 255;
                const b = parseInt(hex[3] + hex[3], 16) / 255;
                const a = parseInt(hex[4] + hex[4], 16) / 255;
                return new vscode.Color(r, g, b, a);
            }

            if (hex.length === 7) {
                // #rrggbb
                const r = parseInt(hex.substr(1, 2), 16) / 255;
                const g = parseInt(hex.substr(3, 2), 16) / 255;
                const b = parseInt(hex.substr(5, 2), 16) / 255;
                return new vscode.Color(r, g, b, 1);
            }

            if (hex.length === 9) {
                // #rrggbbaa
                const r = parseInt(hex.substr(1, 2), 16) / 255;
                const g = parseInt(hex.substr(3, 2), 16) / 255;
                const b = parseInt(hex.substr(5, 2), 16) / 255;
                const a = parseInt(hex.substr(7, 2), 16) / 255;
                return new vscode.Color(r, g, b, a);
            }
        } catch (e) {}

        return new vscode.Color(0, 0, 0, 1);
    }

    vscode.languages.registerColorProvider(['svelte'], {
        provideDocumentColors(document) {
            const text = document.getText();
            const colors = [];
            let match;

            while ((match = hexRegex.exec(text))) {
                const hex = match[1];
                const fullHex = '#' + hex;

                const startPos = document.positionAt(match.index + match[0].indexOf('#'));
                const endPos = startPos.translate(0, hex.length + 1);
                const range = new vscode.Range(startPos, endPos);

                colors.push(new vscode.ColorInformation(range, hexToColor(fullHex)));
            }

            return colors;
        },

        provideColorPresentations(color, context) {
            const r = Math.round(color.red * 255);
            const g = Math.round(color.green * 255);
            const b = Math.round(color.blue * 255);
            const a = Math.round(color.alpha * 255);

            let hex;
            if (color.alpha < 1) {
                hex = `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
            } else {
                hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            }

            return [new vscode.ColorPresentation(hex)];
        }
    });

    function toHex(n) {
        return n.toString(16).padStart(2, '0');
    }

    // Listeners
    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
    }

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) updateDecorations(editor);
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                updateDecorations(editor);
            }
        })
    );
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
