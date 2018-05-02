'use strict';

import * as vscode from 'vscode';
// import 'vscode';

export function activate(context: vscode.ExtensionContext) {


    // 👍 formatter implemented using API
    vscode.languages.registerDocumentFormattingEditProvider('xi', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            let edits = [];
            let indentLevel = 0;
            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                let whiteIdx = line.firstNonWhitespaceCharacterIndex;
                const lineText = line.text;
                let numLeft = 0;
                let numRight = 0;
                let firstEncountered = false;
                let inString = null;
                for (const char of line.text) {
                    if (char == '{' && inString == null) {
                        numLeft++;
                        if (!firstEncountered) {
                            firstEncountered = true;
                        }
                    } else if (char == '}' && inString == null) {
                        numRight++;
                        if (!firstEncountered) {
                            firstEncountered = true;
                            edits.push(vscode.TextEdit.replace(new vscode.Range(line.range.start, new vscode.Position(i, whiteIdx)), " ".repeat((indentLevel - 1) * 4)))
                        }
                    }
                    if (char == '"' && inString == null) {
                        inString = '"';
                    } else if (char == "'" && inString == null) {
                        inString = "'";
                    } else if (char == inString) {
                        inString = null;
                    }
                }
                if (numLeft - numRight >= 0) {
                    edits.push(vscode.TextEdit.replace(new vscode.Range(line.range.start, new vscode.Position(i, whiteIdx)), " ".repeat(indentLevel * 4)))
                }
                indentLevel += numLeft - numRight;
            }
            return edits;
        }
    });
}

