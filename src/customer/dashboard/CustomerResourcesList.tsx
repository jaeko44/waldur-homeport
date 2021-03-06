import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { formatDateTime } from '@waldur/core/dateUtils';
import { translate } from '@waldur/i18n';
import { ResourceNameField } from '@waldur/marketplace/resources/list/ResourceNameField';
import { ResourceStateField } from '@waldur/marketplace/resources/list/ResourceStateField';
import { Resource } from '@waldur/marketplace/resources/types';
import { Table, connectTable, createFetcher } from '@waldur/table-react';
import { getCustomer } from '@waldur/workspace/selectors';
import { Customer } from '@waldur/workspace/types';

interface FieldProps {
  row: Resource;
}

export const TableComponent = props => {
  const columns = [
    {
      title: translate('Name'),
      render: ResourceNameField,
      orderField: 'name',
    },
    {
      title: translate('Project'),
      render: ({ row }: FieldProps) => row.project_name,
    },
    {
      title: translate('Category'),
      render: ({ row }: FieldProps) => row.category_title,
    },
    {
      title: translate('Offering'),
      render: ({ row }: FieldProps) => row.offering_name,
    },
    {
      title: translate('Created at'),
      render: ({ row }: FieldProps) => formatDateTime(row.created),
      orderField: 'created',
    },
    {
      title: translate('State'),
      render: ResourceStateField,
    },
  ];

  return (
    <Table
      {...props}
      columns={columns}
      verboseName={translate('Resources')}
      initialSorting={{ field: 'created', mode: 'desc' }}
    />
  );
};

const TableOptions = {
  table: 'CustomerResourcesList',
  fetchData: createFetcher('marketplace-resources'),
  mapPropsToFilter: props =>
    props.customer
      ? {
          customer_uuid: props.customer.uuid,
          state: ['Creating', 'OK', 'Erred', 'Updating', 'Terminating'],
        }
      : {},
};

const mapStateToProps = state => ({
  customer: getCustomer(state),
});

interface StateProps {
  customer: Customer;
}

const enhance = compose(
  connect<StateProps>(mapStateToProps),
  connectTable(TableOptions),
);

export const CustomerResourcesList = enhance(TableComponent);
