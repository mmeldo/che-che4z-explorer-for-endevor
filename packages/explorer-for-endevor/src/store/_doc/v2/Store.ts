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

import { Element, ServiceApiVersion } from '@local/endevor/_doc/Endevor';
import { EndevorMap, SubsystemMapPathId } from '../../../_doc/Endevor';
import {
  ConnectionKey,
  ConnectionName,
  Id,
  InventoryLocationKey,
  InventoryLocationName,
  Connection,
  Credential,
  ConnectionLocations,
  InventoryLocation,
} from '../../storage/_doc/Storage';

// internal types
export type EndevorServiceName = ConnectionName;
export type EndevorLocationName = InventoryLocationName;

export type EndevorId = Id;

// composite keys: source + name
export type EndevorServiceKey = ConnectionKey;
export type EndevorLocationKey = InventoryLocationKey;

export const enum EndevorCacheVersion {
  UP_TO_DATE = 'UP_TO_DATE',
  OUTDATED = 'OUTDATED',
}

export type CachedEndevorMap = Readonly<{
  cacheVersion: EndevorCacheVersion;
  value: EndevorMap;
}>;

export type CachedElement = {
  element: Element;
  lastRefreshTimestamp: number;
};
export type ElementId = string;
export type CachedElements = Readonly<{
  [id: ElementId]: CachedElement;
}>;

export type EndevorCachedElements = Readonly<{
  cacheVersion: EndevorCacheVersion;
  elements: CachedElements;
}>;

// key based on service name and search location name
type CompositeKey = string;
type EndevorMapItem = SubsystemMapPathId;
export type CacheItem = {
  endevorMap: CachedEndevorMap;
  mapItemsContent: Readonly<{
    [endevorMapItem: EndevorMapItem]: EndevorCachedElements | undefined;
  }>;
};
export type EndevorCache = Readonly<{
  [id: CompositeKey]: CacheItem | undefined;
}>;

export type EndevorApiVersion = ServiceApiVersion.V1 | ServiceApiVersion.V2;
export const enum EndevorConnectionStatus {
  VALID = 'VALID',
  INVALID = 'INVALID',
  UNKNOWN = 'UNKNOWN',
}
export type ValidEndevorConnection = Readonly<{
  status: EndevorConnectionStatus.VALID;
  value: Connection['value'] & {
    apiVersion: ServiceApiVersion;
  };
}>;
export type InvalidEndevorConnection = Readonly<{
  status: EndevorConnectionStatus.INVALID;
  value: Connection['value'];
}>;
export type UnknownEndevorConnection = Readonly<{
  status: EndevorConnectionStatus.UNKNOWN;
  value: Connection['value'];
}>;
export type EndevorConnection =
  | UnknownEndevorConnection
  | ValidEndevorConnection
  | InvalidEndevorConnection;

export const enum EndevorCredentialStatus {
  VALID = 'VALID',
  INVALID = 'INVALID',
  UNKNOWN = 'UNKNOWN',
}
export type ValidEndevorCredential = Readonly<{
  status: EndevorCredentialStatus.VALID;
  value: Credential['value'];
}>;
export type InvalidEndevorCredential = Readonly<{
  status: EndevorCredentialStatus.INVALID;
  value: Credential['value'];
}>;
export type UnknownEndevorCredential = Readonly<{
  status: EndevorCredentialStatus.UNKNOWN;
  value: Credential['value'];
}>;
export type EndevorCredential =
  | UnknownEndevorCredential
  | ValidEndevorCredential
  | InvalidEndevorCredential;

export const enum ElementFilterType {
  ELEMENT_NAMES_FILTER = 'ELEMENT_NAMES_FILTER',
  ELEMENT_CCIDS_FILTER = 'ELEMENT_CCIDS_FILTER',
  ELEMENTS_UP_THE_MAP_FILTER = 'ELEMENTS_UP_THE_MAP_FILTER',
}

type Pattern = string;
export type ElementNamesFilter = {
  type: ElementFilterType.ELEMENT_NAMES_FILTER;
  value: ReadonlyArray<Pattern>;
};

export type ElementCcidsFilter = {
  type: ElementFilterType.ELEMENT_CCIDS_FILTER;
  value: ReadonlyArray<Pattern>;
};

export type ElementsUpTheMapFilter = {
  type: ElementFilterType.ELEMENTS_UP_THE_MAP_FILTER;
  value: boolean;
};

export type ElementFilter =
  | ElementNamesFilter
  | ElementCcidsFilter
  | ElementsUpTheMapFilter;

export type ServiceLocationFilters = Partial<{
  [key in ElementFilterType]: ElementFilter;
}>;

export type ElementFilters = {
  [id: CompositeKey]: ServiceLocationFilters;
};

export type EndevorSession = Partial<{
  connection: EndevorConnection;
  credentials: EndevorCredential;
}>;

export type EndevorSessions = {
  [key: EndevorServiceKey]: EndevorSession | undefined;
};

export type EndevorService = Connection &
  Partial<{
    credential: Credential;
  }>;
export type EndevorServices = {
  [key: EndevorServiceKey]: EndevorService | undefined;
};

export type EndevorSearchLocation = InventoryLocation;
export type EndevorSearchLocations = {
  [key: EndevorLocationKey]: EndevorSearchLocation | undefined;
};

export type State = {
  filters: ElementFilters;
  sessions: EndevorSessions;
  caches: EndevorCache;
  services: EndevorServices;
  searchLocations: EndevorSearchLocations;
  serviceLocations: ConnectionLocations;
};

// external types
export const enum EndevorServiceStatus {
  VALID = 'VALID',

  NON_EXISTING = 'NON_EXISTING',

  INVALID_CREDENTIAL = 'INVALID_CREDENTIALS',
  UNKNOWN_CREDENTIAL = 'UNKNOWN_CREDENTIAL',

  INVALID_CONNECTION = 'INVALID_CONNECTION',
  UNKNOWN_CONNECTION = 'UNKNOWN_CONNECTION',
}

export type ValidEndevorServiceDescription = Readonly<{
  status:
    | EndevorServiceStatus.VALID
    | EndevorServiceStatus.UNKNOWN_CONNECTION
    | EndevorServiceStatus.UNKNOWN_CREDENTIAL;
  duplicated: boolean;
  id: EndevorId;
  url: string;
}>;

export type InvalidEndevorServiceDescription = Readonly<{
  status:
    | EndevorServiceStatus.INVALID_CONNECTION
    | EndevorServiceStatus.INVALID_CREDENTIAL;
  duplicated: boolean;
  id: EndevorId;
  url: string;
}>;

export type NonExistingServiceDescription = Readonly<{
  status: EndevorServiceStatus.NON_EXISTING;
  duplicated: boolean;
  id: EndevorId;
}>;

export type EndevorServiceDescription =
  | ValidEndevorServiceDescription
  | InvalidEndevorServiceDescription
  | NonExistingServiceDescription;

export type ExistingEndevorServiceDescriptions = {
  [key: EndevorLocationKey]:
    | ValidEndevorServiceDescription
    | InvalidEndevorServiceDescription;
};

export type EndevorServiceDescriptions = {
  [key: EndevorLocationKey]: EndevorServiceDescription;
};

export type EndevorConfiguration = string;

export const enum EndevorSearchLocationStatus {
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export type ValidEndevorSearchLocationDescription = Readonly<{
  status: EndevorSearchLocationStatus.VALID;
  duplicated: boolean;
  id: EndevorId;
  path: string;
  searchForFirstFoundElements: boolean;
}>;

export type InvalidEndevorSearchLocationDescription = Readonly<{
  status: EndevorSearchLocationStatus.INVALID;
  duplicated: boolean;
  id: EndevorId;
}>;

export type EndevorSearchLocationDescription =
  | ValidEndevorSearchLocationDescription
  | InvalidEndevorSearchLocationDescription;

export type ValidEndevorSearchLocationDescriptions = {
  [key: EndevorLocationKey]: ValidEndevorSearchLocationDescription;
};

export type InvalidEndevorSearchLocationDescriptions = {
  [key: EndevorLocationKey]: InvalidEndevorSearchLocationDescription;
};

export type EndevorSearchLocationDescriptions = {
  [key: EndevorLocationKey]: EndevorSearchLocationDescription;
};

export type EndevorServiceLocation = {
  value: EndevorSearchLocationDescriptions;
} & EndevorServiceDescription;

export type EndevorServiceLocations = {
  [key: EndevorServiceKey]: EndevorServiceLocation;
};

export type ElementsPerRoute = Readonly<{
  [searchLocation: SubsystemMapPathId]: ReadonlyArray<CachedElement>;
}>;
