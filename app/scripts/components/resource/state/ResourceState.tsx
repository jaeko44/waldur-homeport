import * as React from 'react';

import { Tooltip } from '@waldur/core/Tooltip';
import { withTranslation, TranslateProps } from '@waldur/i18n';
import { connectAngularComponent } from '@waldur/store/connect';

import { Resource, StateIndicator } from './types';
import { getResourceState } from './utils';

interface ResourceStateProps extends TranslateProps {
  resource: Resource;
}

export const ResourceStateIndicator = (props: StateIndicator) => {
  const stateIndicator = (
    <div className={`progress ${props.movementClassName} state-indicator m-b-none`}>
      <span className={`progress-bar ${props.className} p-w-sm full-width`}>
        {props.label.toUpperCase()}
      </span>
    </div>);
  if (props.tooltip) {
    return (
      <Tooltip label={props.tooltip} id="resourceState">
        {stateIndicator}
      </Tooltip>
    );
  }
  return stateIndicator;
};

// TODO: remove extra check after resources list is migrated to ReactJS
export const PureResourceState = (props: ResourceStateProps) => props.resource ? (
  <ResourceStateIndicator {...getResourceState(props.resource, props.translate)}/>
) : null;

export const ResourceState = withTranslation(PureResourceState);

export default connectAngularComponent(ResourceState, ['resource']);
