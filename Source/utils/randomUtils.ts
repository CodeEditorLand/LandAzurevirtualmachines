/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as crypto from "crypto";

export function getRandomHexString(length: number = 10): string {
	const buffer: Buffer = crypto.randomBytes(Math.ceil(length / 2));

	return buffer.toString("hex").slice(0, length);
}
