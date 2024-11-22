/*
 * Copyright (C) 2024 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {isSuccessful, formatApiResultError} from '../../common/lib/apiResult/ApiResult'
import type {AccountId} from '../model/AccountId'
import type {LtiRegistrationId} from '../model/LtiRegistrationId'
import type {InternalLtiConfiguration} from '../model/internal_lti_configuration/InternalLtiConfiguration'
import {
  convertToLtiConfigurationOverlay,
  createLti1p3RegistrationOverlayStore,
  type Lti1p3RegistrationOverlayStore,
} from './Lti1p3RegistrationOverlayState'
import type {Lti1p3RegistrationWizardService} from './Lti1p3RegistrationWizardService'
import create from 'zustand'

export type Lti1p3RegistrationWizardState = {
  overlayStore: Lti1p3RegistrationOverlayStore
  service: Lti1p3RegistrationWizardService
  _step: Lti1p3RegistrationWizardStep
  reviewing: boolean
  errorMessage?: string
}

export interface Lti1p3RegistrationWizardActions {
  setStep: (step: Lti1p3RegistrationWizardStep) => void
  setReviewing: (reviewing: boolean) => void
  install: (
    onSuccessfulInstallation: () => void,
    accountId: AccountId,
    unifiedToolId?: string
  ) => Promise<void>
  update: (
    onSuccessfulUpdate: () => void,
    accountId: AccountId,
    registrationId: LtiRegistrationId,
    unifiedToolId?: string
  ) => Promise<void>
}

export type Lti1p3RegistrationWizardStep =
  | 'LaunchSettings'
  | 'Permissions'
  | 'DataSharing'
  | 'Placements'
  | 'OverrideURIs'
  | 'Naming'
  | 'Icons'
  | 'Review'
  | 'Installing'
  | 'Updating'
  | 'Success'
  | 'Error'

export type Lti1p3RegistrationWizardStore = {
  state: Lti1p3RegistrationWizardState
} & Lti1p3RegistrationWizardActions

type CreateStoreProps = {
  internalConfig: InternalLtiConfiguration
  service: Lti1p3RegistrationWizardService
  reviewing?: boolean
}

export const createLti1p3RegistrationWizardState = ({
  internalConfig,
  service,
  reviewing = false,
}: CreateStoreProps) =>
  create<Lti1p3RegistrationWizardStore>((set, get) => ({
    state: {
      overlayStore: createLti1p3RegistrationOverlayStore(internalConfig),
      _step: 'LaunchSettings',
      service,
      reviewing,
    },
    setStep: step => set(state => ({state: {...state.state, _step: step}})),
    setReviewing: isReviewing => set(state => ({state: {...state.state, reviewing: isReviewing}})),
    // TODO: Once the two backend create/update endpoints are created, these methods should actually
    // call them, instead of just faking it.
    install: async (onSuccessfulInstallation, accountId, unifiedToolId) => {
      set(state => ({state: {...state.state, _step: 'Installing'}}))

      const overlay = convertToLtiConfigurationOverlay(
        get().state.overlayStore.getState().state,
        internalConfig
      )

      const result = await service.createLtiRegistration(
        accountId,
        internalConfig,
        overlay,
        unifiedToolId
      )

      if (isSuccessful(result)) {
        set(state => ({
          ...state,
          state: {
            ...state.state,
            _step: 'Success',
          },
        }))
        onSuccessfulInstallation()
      } else {
        set(state => ({
          state: {
            ...state.state,
            state: {
              ...state.state,
              _step: 'Error',
              errorMessage: formatApiResultError(result),
            },
          },
        }))
      }
    },
    update: async (onSuccessfulUpdate, accountId, registrationId, unifiedToolId) => {
      set(state => ({state: {...state.state, _step: 'Updating'}}))

      const overlay = convertToLtiConfigurationOverlay(
        get().state.overlayStore.getState().state,
        internalConfig
      )

      const result = await service.updateLtiRegistration(
        accountId,
        registrationId,
        internalConfig,
        overlay,
        unifiedToolId
      )

      if (isSuccessful(result)) {
        set(state => ({
          state: {
            ...state.state,
            _step: 'Success',
          },
        }))
        onSuccessfulUpdate()
      } else {
        set(state => ({
          state: {
            ...state.state,
            _step: 'Error',
            errorMessage: formatApiResultError(result),
          },
        }))
      }
    },
  }))
