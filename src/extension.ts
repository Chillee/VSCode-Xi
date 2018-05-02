'use strict';

import * as vscode from 'vscode';
// import 'vscode';

export function activate(context: vscode.ExtensionContext) {


    // 👍 formatter implemented using API
    vscode.languages.registerDocumentFormattingEditProvider('xi', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            // const whitespace
            let edits = [];
            let indentLevel = 0;
            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                let whiteIdx = line.firstNonWhitespaceCharacterIndex;
                const lineText = line.text;
                let numLeft = 0;
                let numRight = 0;
                let onlyRights = true;
                let inString = null;
                let curEdit = null;
                for (const char of line.text) {
                    if (char == '{' && inString == null) {
                        numLeft++;
                        if (onlyRights) {
                            onlyRights = false;
                        }
                    } else if (char == '}' && inString == null) {
                        numRight++;
                        if (onlyRights) {
                            curEdit = vscode.TextEdit.replace(new vscode.Range(line.range.start, new vscode.Position(i, whiteIdx)), " ".repeat((indentLevel - numRight) * 4))
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
                    curEdit = vscode.TextEdit.replace(new vscode.Range(line.range.start, new vscode.Position(i, whiteIdx)), " ".repeat(indentLevel * 4))
                }
                indentLevel += numLeft - numRight;
                if (curEdit) {
                    edits.push(curEdit);
                }
            }
            return edits;
        }
    });
}

