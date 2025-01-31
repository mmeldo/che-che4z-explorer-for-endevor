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

import { LocationNode } from '../tree/_doc/ServiceLocationTree';
import {
  chooseFileUriFromFs,
  getFileContent,
} from '@local/vscode-wrapper/workspace';
import { isError, parseFilePath } from '../utils';
import {
  isConnectionError,
  isDuplicateElementError,
  isWrongCredentialsError,
} from '@local/endevor/utils';
import { logger, reporter } from '../globals';
import { withNotificationProgress } from '@local/vscode-wrapper/window';
import {
  askForChangeControlValue,
  dialogCancelled as changeControlDialogCancelled,
} from '../dialogs/change-control/endevorChangeControlDialogs';
import {
  askForUploadLocation as askForAddLocation,
  dialogCancelled as addLocationDialogCancelled,
} from '../dialogs/locations/endevorUploadLocationDialogs';
import {
  ActionChangeControlValue,
  ChangeControlValue,
  ElementMapPath,
  ElementSearchLocation,
  Service,
} from '@local/endevor/_doc/Endevor';
import { addElement } from '../endevor';
import { Action, Actions } from '../store/_doc/Actions';
import { TextDecoder } from 'util';
import { Uri } from 'vscode';
import { ENCODING } from '../constants';
import { FileExtensionResolutions } from '../settings/_doc/v2/Settings';
import {
  AddElementCommandCompletedStatus,
  TelemetryEvents,
} from '../_doc/Telemetry';
import {
  EndevorConfiguration,
  EndevorConnectionStatus,
  EndevorCredentialStatus,
  EndevorId,
  ValidEndevorConnection,
  ValidEndevorCredential,
} from '../store/_doc/v2/Store';
import { getFileExtensionResolution } from '../settings/settings';
import { UnreachableCaseError } from '@local/endevor/typeHelpers';

export const addElementFromFileSystem = async (
  getConnectionDetails: (
    id: EndevorId
  ) => Promise<ValidEndevorConnection | undefined>,
  getEndevorConfiguration: (
    serviceId?: EndevorId,
    searchLocationId?: EndevorId
  ) => Promise<EndevorConfiguration | undefined>,
  getCredential: (
    connection: ValidEndevorConnection,
    configuration: EndevorConfiguration
  ) => (credentialId: EndevorId) => Promise<ValidEndevorCredential | undefined>,
  getElementLocation: (
    searchLocationId: EndevorId
  ) => Promise<Omit<ElementSearchLocation, 'configuration'> | undefined>,
  dispatch: (action: Action) => Promise<void>,
  searchLocationNode: LocationNode
): Promise<void> => {
  reporter.sendTelemetryEvent({
    type: TelemetryEvents.COMMAND_ADD_ELEMENT_CALLED,
  });
  const fileUri = await chooseFileUriFromFs();
  if (!fileUri) {
    return;
  }
  const { fileName, fullFileName } = parseFilePath(fileUri.path);
  if (!fileName) {
    logger.error(`Unable to add the element ${fileName}.`);
    return;
  }
  const content = await readElementContent(fileUri.path);
  if (isError(content)) {
    const error = content;
    reporter.sendTelemetryEvent({
      type: TelemetryEvents.ERROR,
      errorContext: TelemetryEvents.COMMAND_ADD_ELEMENT_CALLED,
      status: AddElementCommandCompletedStatus.GENERIC_ERROR,
      error,
    });
    logger.error(
      `Unable to read the element content.`,
      `Unable to read the element content because of error ${error.message}.`
    );
    return;
  }
  const serviceId = resolveServiceId(searchLocationNode);
  if (!serviceId) {
    logger.error(`Unable to add the element ${fileName}.`);
    return;
  }
  const connectionDetails = await getConnectionDetails(serviceId);
  if (!connectionDetails) {
    logger.error(`Unable to add the element ${fileName}.`);
    return;
  }
  const searchLocationId = resolveSearchLocationId(searchLocationNode);
  if (!searchLocationId) {
    logger.error(`Unable to add the element ${fileName}.`);
    return;
  }
  const configuration = await getEndevorConfiguration(
    serviceId,
    searchLocationId
  );
  if (!configuration) {
    logger.error(`Unable to add the element ${fileName}.`);
    return;
  }
  const credential = await getCredential(
    connectionDetails,
    configuration
  )(serviceId);
  if (!credential) {
    logger.error(`Unable to add the element ${fileName}.`);
    return;
  }
  const service = {
    ...connectionDetails.value,
    credential: credential.value,
  };
  const searchLocation = await getElementLocation(searchLocationId);
  if (!searchLocation) {
    logger.error(`Unable to add the element ${fileName}.`);
    return;
  }
  const fileNameToShow = selectFileNameToShow(fileName, fullFileName);
  const addValues = await askForAddValues(
    {
      configuration,
      ...searchLocation,
    },
    fileNameToShow
  );
  if (isError(addValues)) {
    const error = addValues;
    logger.error(error.message);
    return;
  }
  const [addLocation, actionControlValue] = addValues;
  const addResult = await addNewElement(service)({
    ...addLocation,
  })(actionControlValue)(content);
  if (isDuplicateElementError(addResult)) {
    const error = addResult;
    logger.error(
      `Unable to add the element ${fileName} because an element with this name already exists.`,
      `${error.message}.`
    );
    reporter.sendTelemetryEvent({
      type: TelemetryEvents.ERROR,
      errorContext: TelemetryEvents.COMMAND_ADD_ELEMENT_CALLED,
      status: AddElementCommandCompletedStatus.DUPLICATED_ELEMENT_ERROR,
      error,
    });
    return;
  }
  if (isConnectionError(addResult)) {
    const error = addResult;
    logger.error(
      `Unable to add the element ${fileName} because of invalid connection.`,
      `${error.message}.`
    );
    reporter.sendTelemetryEvent({
      type: TelemetryEvents.ERROR,
      errorContext: TelemetryEvents.COMMAND_ADD_ELEMENT_CALLED,
      status: AddElementCommandCompletedStatus.GENERIC_ERROR,
      error,
    });
    await dispatch({
      type: Actions.ENDEVOR_CONNECTION_TESTED,
      connectionId: serviceId,
      status: {
        status: EndevorConnectionStatus.INVALID,
      },
    });
    return;
  }
  if (isWrongCredentialsError(addResult)) {
    const error = addResult;
    logger.error(
      `Unable to add the element ${fileName} because of invalid credentials.`,
      `${error.message}.`
    );
    reporter.sendTelemetryEvent({
      type: TelemetryEvents.ERROR,
      errorContext: TelemetryEvents.COMMAND_ADD_ELEMENT_CALLED,
      status: AddElementCommandCompletedStatus.GENERIC_ERROR,
      error,
    });
    await dispatch({
      type: Actions.ENDEVOR_CREDENTIAL_TESTED,
      credentialId: serviceId,
      status: EndevorCredentialStatus.INVALID,
    });
    return;
  }
  if (isError(addResult)) {
    const error = addResult;
    logger.error(`Unable to add the element ${fileName}.`, `${error.message}.`);
    reporter.sendTelemetryEvent({
      type: TelemetryEvents.ERROR,
      errorContext: TelemetryEvents.COMMAND_ADD_ELEMENT_CALLED,
      status: AddElementCommandCompletedStatus.GENERIC_ERROR,
      error,
    });
    return;
  }
  await dispatch({
    type: Actions.ELEMENT_ADDED,
    serviceId,
    searchLocationId,
    element: {
      configuration: addLocation.configuration,
      environment: addLocation.environment,
      stageNumber: addLocation.stageNumber,
      system: addLocation.system,
      subSystem: addLocation.subSystem,
      type: addLocation.type,
      name: addLocation.name,
      lastActionCcid: actionControlValue.ccid.toUpperCase(),
    },
  });
  reporter.sendTelemetryEvent({
    type: TelemetryEvents.COMMAND_ADD_ELEMENT_COMPLETED,
    status: AddElementCommandCompletedStatus.SUCCESS,
  });
  logger.info('Add successful!');
};

const addNewElement =
  (service: Service) =>
  (element: ElementMapPath) =>
  (uploadChangeControlValue: ChangeControlValue) =>
  async (elementContent: string): Promise<void | Error> => {
    const addResult = await withNotificationProgress(
      `Adding element: ${element.name}.`
    )((progressReporter) => {
      return addElement(progressReporter)(service)(element)(
        uploadChangeControlValue
      )(elementContent);
    });
    return addResult;
  };

const askForAddValues = async (
  searchLocation: ElementSearchLocation,
  name: string
): Promise<Error | [ElementMapPath, ActionChangeControlValue]> => {
  const addLocation = await askForAddLocation({
    environment: searchLocation.environment,
    stageNumber: searchLocation.stageNumber,
    system: searchLocation.system,
    subsystem: searchLocation.subsystem,
    type: searchLocation.type,
    element: name,
    configuration: searchLocation.configuration,
  });
  if (addLocationDialogCancelled(addLocation)) {
    return new Error(`Add location must be specified to add element ${name}.`);
  }

  const addChangeControlValue = await askForChangeControlValue({
    ccid: searchLocation.ccid,
    comment: searchLocation.comment,
  });
  if (changeControlDialogCancelled(addChangeControlValue)) {
    return new Error(
      `CCID and Comment must be specified to add element ${addLocation.name}.`
    );
  }
  return [addLocation, addChangeControlValue];
};

const readElementContent = async (
  elementTempFilePath: string
): Promise<string | Error> => {
  try {
    return new TextDecoder(ENCODING).decode(
      await getFileContent(Uri.file(elementTempFilePath))
    );
  } catch (error) {
    return error;
  }
};

const resolveServiceId = (
  serviceLocationArg: LocationNode
): EndevorId | undefined => {
  return {
    name: serviceLocationArg.serviceName,
    source: serviceLocationArg.serviceSource,
  };
};

const resolveSearchLocationId = (
  serviceLocationArg: LocationNode
): EndevorId | undefined => {
  return {
    name: serviceLocationArg.name,
    source: serviceLocationArg.source,
  };
};

const selectFileNameToShow = (
  fileName: string,
  fullFileName: string
): string => {
  const fileExtResolution = getFileExtensionResolution();
  switch (fileExtResolution) {
    case FileExtensionResolutions.FROM_TYPE_EXT_OR_NAME:
      return fileName;
    case FileExtensionResolutions.FROM_TYPE_EXT:
      return fileName;
    case FileExtensionResolutions.FROM_NAME:
      return fullFileName;
    default:
      throw new UnreachableCaseError(fileExtResolution);
  }
};
