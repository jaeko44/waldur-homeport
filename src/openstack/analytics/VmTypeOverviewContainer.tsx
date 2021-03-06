import * as React from 'react';

import { translate } from '@waldur/i18n';
import { useTitle } from '@waldur/navigation/title';

import { VmOverviewFilterContainer } from './VmOverviewFilterContainer';
import { VmTypeOverview } from './VmTypeOverview';

export const VmTypeOverviewContainer = () => {
  useTitle(translate('VM type overview'));
  return (
    <>
      <VmOverviewFilterContainer />
      <VmTypeOverview />
    </>
  );
};
