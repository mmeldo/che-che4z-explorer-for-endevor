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

import {
  FILTER_DELIMITER,
  FILTER_VALUE_DEFAULT,
  FILTER_WILDCARD_SINGLE,
  FILTER_WILDCARD_ZERO_OR_MORE,
} from '../../constants';
import { askForSearchLocationFilterByElementName } from '../../dialogs/locations/endevorSearchLocationDialogs';
import { logger, reporter } from '../../globals';
import { Action, Actions } from '../../store/_doc/Actions';
import {
  CachedElement,
  ElementFilterType,
  ElementNamesFilter,
  EndevorCacheVersion,
  EndevorId,
} from '../../store/_doc/v2/Store';
import { LocationNode } from '../../tree/_doc/ServiceLocationTree';
import {
  UpdateElementNameFilterCommandCompletedStatus,
  TelemetryEvents,
} from '../../_doc/telemetry/v2/Telemetry';

export const filterSearchLocationByElementNameCommand =
  (
    configurations: {
      getElementNamesFilterValue: (
        serviceId: EndevorId
      ) => (searchLocationId: EndevorId) => ElementNamesFilter | undefined;
      getAllElements: (serviceId: EndevorId) => (
        searchLocationId: EndevorId
      ) =>
        | Readonly<{
            cacheVersion: EndevorCacheVersion;
            elements: ReadonlyArray<CachedElement>;
          }>
        | undefined;
    },
    dispatch: (action: Action) => Promise<void>
  ) =>
  async ({
    name: locationName,
    source: locationSource,
    serviceName,
    serviceSource,
  }: LocationNode): Promise<void> => {
    logger.trace(
      `Set filtering by element name for the ${locationSource} inventory location ${locationName} within the ${serviceSource} Endevor connection ${serviceName}.`
    );
    reporter.sendTelemetryEvent({
      type: TelemetryEvents.COMMAND_UPDATE_ELEMENT_NAME_FILTER_CALLED,
    });
    const serviceId = {
      name: serviceName,
      source: serviceSource,
    };
    const searchLocationId = {
      name: locationName,
      source: locationSource,
    };
    const allElements =
      configurations.getAllElements(serviceId)(searchLocationId)?.elements;
    const existingFilter = configurations
      .getElementNamesFilterValue(serviceId)(searchLocationId)
      ?.value.join(FILTER_DELIMITER);
    const filter = await askForSearchLocationFilterByElementName(
      locationName,
      existingFilter ? existingFilter : FILTER_VALUE_DEFAULT
    )(allElements);
    if (!filter) {
      logger.trace('No filter pattern provided.');
      reporter.sendTelemetryEvent({
        type: TelemetryEvents.COMMAND_UPDATE_ELEMENT_NAME_FILTER_COMPLETED,
        status: UpdateElementNameFilterCommandCompletedStatus.CANCELLED,
      });
      return;
    }
    if (filter === existingFilter) {
      logger.trace('Filter pattern unchanged.');
      reporter.sendTelemetryEvent({
        type: TelemetryEvents.COMMAND_UPDATE_ELEMENT_NAME_FILTER_COMPLETED,
        status: UpdateElementNameFilterCommandCompletedStatus.UNCHANGED,
        elementsFetched: !!allElements,
        patternsCount: existingFilter.split(FILTER_DELIMITER).length,
        wildcardUsed:
          existingFilter.includes(FILTER_WILDCARD_ZERO_OR_MORE) ||
          existingFilter.includes(FILTER_WILDCARD_SINGLE),
      });
      return;
    }
    if (filter === FILTER_VALUE_DEFAULT) {
      dispatch({
        type: Actions.ENDEVOR_SEARCH_LOCATION_FILTERS_CLEARED,
        serviceId,
        searchLocationId,
        filtersCleared: [ElementFilterType.ELEMENT_NAMES_FILTER],
      });
      reporter.sendTelemetryEvent({
        type: TelemetryEvents.COMMAND_UPDATE_ELEMENT_NAME_FILTER_COMPLETED,
        status: UpdateElementNameFilterCommandCompletedStatus.CLEARED,
      });
      return;
    }
    reporter.sendTelemetryEvent({
      type: TelemetryEvents.COMMAND_UPDATE_ELEMENT_NAME_FILTER_COMPLETED,
      status: UpdateElementNameFilterCommandCompletedStatus.SUCCESS,
      elementsFetched: !!allElements,
      patternsCount: filter.split(FILTER_DELIMITER).length,
      wildcardUsed:
        filter.includes(FILTER_WILDCARD_ZERO_OR_MORE) ||
        filter.includes(FILTER_WILDCARD_SINGLE),
    });
    dispatch({
      type: Actions.ELEMENT_NAMES_FILTER_UPDATED,
      serviceId,
      searchLocationId,
      updatedFilter: {
        type: ElementFilterType.ELEMENT_NAMES_FILTER,
        value: filter.split(FILTER_DELIMITER),
      },
    });
  };
