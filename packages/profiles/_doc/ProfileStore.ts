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

import { ProfileResponses, ProfileTypes } from '../_ext/Profile';
import { ProfileStoreAPIError } from './Error';

export type ProfileStore = Readonly<{
  getProfiles(
    profileType: ProfileTypes
  ): Promise<ProfileResponses | ProfileStoreAPIError>;
}>;
