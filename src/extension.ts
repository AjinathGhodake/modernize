import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // Command to select the file to write to
  let disposable = vscode.commands.registerCommand(
    'modernize.helloWorld',
    async () => {
      // Ask the user to choose a file location
      const uri = await vscode.window.showSaveDialog({
        saveLabel: 'Select or create a file to write to',
        filters: {
          'Text Files': ['txt'],
          'All Files': ['*'],
        },
      });

      if (uri) {
        const selectedFilePath = uri.fsPath;
        vscode.window.showInformationMessage(
          `Selected file: ${selectedFilePath}`
        );

        // Trigger code to write Python code to this specific file when Python code is executed
        vscode.debug.onDidStartDebugSession((session) => {
          if (session.type === 'python') {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'python') {
              const pythonCode = editor.document.getText(); // Get the Python code

              // Write the code to the selected file
              fs.writeFile(selectedFilePath, pythonCode, (err) => {
                if (err) {
                  vscode.window.showErrorMessage(
                    'Error writing to the selected file.'
                  );
                } else {
                  vscode.window.showInformationMessage(
                    'Python code written to the selected file.'
                  );
                }
              });
            }
          }
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
