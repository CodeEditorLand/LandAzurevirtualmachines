/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	type ComputeManagementClient,
	type VirtualMachine,
} from "@azure/arm-compute";
import { getResourceGroupFromId } from "@microsoft/vscode-azext-azureutils";
import {
	callWithTelemetryAndErrorHandling,
	type IActionContext,
	type ISubscriptionContext,
} from "@microsoft/vscode-azext-utils";
import {
	type AppResource,
	type AppResourceResolver,
} from "@microsoft/vscode-azext-utils/hostapi";

import {
	VirtualMachineTreeItem,
	type ResolvedVirtualMachine,
} from "./tree/VirtualMachineTreeItem";
import { createComputeClient } from "./utils/azureClients";

export class VirtualMachineResolver implements AppResourceResolver {
	// possibly pass down the full tree item, but for now try to get away with just the AppResource
	public async resolveResource(
		subContext: ISubscriptionContext,
		resource: AppResource,
	): Promise<ResolvedVirtualMachine | undefined> {
		return await callWithTelemetryAndErrorHandling(
			"resolveResource",
			async (context: IActionContext) => {
				const client: ComputeManagementClient =
					await createComputeClient([context, subContext]);

				const vm: VirtualMachine = await client.virtualMachines.get(
					getResourceGroupFromId(resource.id),
					resource.name,
					{ expand: "instanceView" },
				);

				return new VirtualMachineTreeItem(subContext, {
					...resource,
					...vm,
				});
			},
		);
	}

	public matchesResource(resource: AppResource): boolean {
		return (
			resource.type.toLowerCase() === "microsoft.compute/virtualmachines"
		);
	}
}
