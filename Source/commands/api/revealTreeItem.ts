/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	callWithTelemetryAndErrorHandling,
	type AzExtTreeItem,
	type IActionContext,
} from "@microsoft/vscode-azext-utils";

import { ext } from "../../extensionVariables";

export async function revealTreeItem(resourceId: string): Promise<void> {
	return await callWithTelemetryAndErrorHandling(
		"api.revealTreeItem",
		async (context: IActionContext) => {
			// https://github.com/microsoft/vscode-azurevirtualmachines/issues/70
			resourceId = resourceId.toLowerCase();

			const node: AzExtTreeItem | undefined =
				await ext.rgApi.appResourceTree.findTreeItem(resourceId, {
					...context,
					loadAll: true,
				});

			if (node) {
				await ext.rgApi.appResourceTreeView.reveal(node, {
					select: true,
					focus: true,
					expand: true,
				});
			}
		},
	);
}
