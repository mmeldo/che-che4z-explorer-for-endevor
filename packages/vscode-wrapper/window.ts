/*
 * © 2022 Broadcom Inc and/or its subsidiaries; All rights reserved
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Broadcom, Inc. - initial API and implementation
 */

import { UnreachableCaseError } from '@local/endevor/typeHelpers';
import * as vscode from 'vscode';
import {
  Choice,
  MessageLevel,
  MessageWithOptions,
  ProgressingFunction,
  PromptInputOptions,
} from './_doc/window';

export const getActiveTextEditor = (): vscode.TextEditor | undefined => {
  return vscode.window.activeTextEditor;
};

export const getAllOpenedTextEditors = (): ReadonlyArray<vscode.TextEditor> => {
  return vscode.window.visibleTextEditors;
};

export const closeActiveTextEditor = async () => {
  await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
};

export const showMessageWithOptions = async ({
  message,
  options,
}: MessageWithOptions): Promise<Choice | undefined> => {
  return await vscode.window.showInformationMessage(message, ...options);
};

export const showModalWithOptions = async (
  { message, options }: MessageWithOptions,
  level: MessageLevel = MessageLevel.INFO
): Promise<Choice | undefined> => {
  switch (level) {
    case MessageLevel.WARN:
      return await vscode.window.showWarningMessage(
        message,
        { modal: true },
        ...options
      );
    case MessageLevel.ERROR:
      return await vscode.window.showErrorMessage(
        message,
        { modal: true },
        ...options
      );
    case MessageLevel.INFO:
      return await vscode.window.showInformationMessage(
        message,
        { modal: true },
        ...options
      );
    default:
      throw new UnreachableCaseError(level);
  }
};

export const showInputBox = (
  options: PromptInputOptions
): Thenable<string | undefined> =>
  vscode.window.showInputBox({
    ...options,
    ignoreFocusOut: true,
  });

export const showVscodeQuickPick = (
  items: vscode.QuickPickItem[],
  showOptions?: vscode.QuickPickOptions
): Thenable<vscode.QuickPickItem | undefined> => {
  return vscode.window.showQuickPick(items, showOptions);
};

export const createVscodeQuickPick = async <I extends vscode.QuickPickItem>(
  items: I[],
  placeHolder?: string,
  ignoreFocusOut?: boolean
): Promise<vscode.QuickPick<I> | undefined> => {
  const quickpick = vscode.window.createQuickPick<I>();
  quickpick.items = items;
  quickpick.placeholder = placeHolder;
  quickpick.ignoreFocusOut = ignoreFocusOut || false;
  quickpick.show();
  const choice = await new Promise<vscode.QuickPickItem | undefined>(
    (choice) => {
      quickpick.onDidAccept(() => choice(quickpick.activeItems[0]));
      quickpick.onDidHide(() => choice(undefined));
    }
  );
  quickpick.hide();
  return choice ? quickpick : undefined;
};

export const showWebView =
  (webViewType: string) =>
  (title: string, body: string): void => {
    const panelIdentificationType = webViewType;
    const panelLocation = getActiveTextEditor()?.viewColumn || 1;
    const panel = vscode.window.createWebviewPanel(
      panelIdentificationType,
      title,
      panelLocation
    );
    panel.webview.html = body;
  };

// don't forget to validate promise.reject
export const showFileContent = async (fileUri: vscode.Uri): Promise<void> => {
  await vscode.window.showTextDocument(fileUri, { preview: false });
};

// don't forget to validate promise.reject
export const showDocument = async (
  document: vscode.TextDocument
): Promise<void> => {
  await vscode.window.showTextDocument(document, { preview: false });
};

// don't forget to validate promise.reject
export const withNotificationProgress =
  (title: string) =>
  async <R>(task: ProgressingFunction<R>): Promise<R> => {
    return await vscode.window.withProgress(
      {
        title,
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
      },
      async (progress) => {
        return await task(progress);
      }
    );
  };

// don't forget to validate promise.reject
export const withCancellableNotificationProgress =
  (title: string) =>
  async <R>(task: ProgressingFunction<R>): Promise<R | undefined> => {
    return await vscode.window.withProgress(
      {
        title,
        location: vscode.ProgressLocation.Notification,
        cancellable: true,
      },
      async (progress, cancellationToken) => {
        return await Promise.race([
          new Promise<undefined>((resolve) => {
            cancellationToken.onCancellationRequested(() => {
              resolve(undefined);
            });
          }),
          task(progress),
        ]);
      }
    );
  };

// don't forget to validate promise.reject
export const showDiffEditor =
  (resourceToCompareLeft: vscode.Uri) =>
  async (resourceToUpdateRight: vscode.Uri) => {
    await vscode.commands.executeCommand(
      'vscode.diff',
      resourceToCompareLeft,
      resourceToUpdateRight
    );
  };

export const reloadWindow = async () => {
  await vscode.commands.executeCommand('workbench.action.reloadWindow');
};
