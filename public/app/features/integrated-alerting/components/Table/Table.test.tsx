import React from 'react';
import { mount } from 'enzyme';
import { dataQa } from '@percona/platform-core';
import { Table } from './Table';

const columns = [
  {
    Header: 'test col 1',
    accessor: 'value',
  },
];

const data = [
  {
    value: 'test value 1',
  },
  {
    value: 'test value 2',
  },
];

const onPaginationChanged = jest.fn();

describe('Table', () => {
  it('should render the table', async () => {
    const wrapper = mount(
      <Table
        totalItems={data.length}
        data={data}
        columns={columns}
        onPaginationChanged={onPaginationChanged}
        pageSize={10}
        pageIndex={0}
      />
    );

    expect(wrapper.find(dataQa('table-thead')).find('tr')).toHaveLength(1);
    expect(wrapper.find(dataQa('table-tbody')).find('tr')).toHaveLength(2);
    expect(wrapper.find(dataQa('table-no-data'))).toHaveLength(0);
  });

  it('should render the loader when data fetch is pending', async () => {
    const wrapper = mount(
      <Table
        totalItems={data.length}
        data={data}
        columns={columns}
        onPaginationChanged={onPaginationChanged}
        pendingRequest
        pageSize={10}
        pageIndex={0}
      />
    );

    expect(wrapper.find(dataQa('table-loading'))).toHaveLength(1);
    expect(wrapper.find(dataQa('table'))).toHaveLength(0);
    expect(wrapper.find(dataQa('table-no-data'))).toHaveLength(0);
  });

  it('should display the noData section when no data is passed', async () => {
    const wrapper = mount(
      <Table
        totalItems={data.length}
        data={[]}
        columns={columns}
        onPaginationChanged={onPaginationChanged}
        emptyMessage="empty"
        pageSize={10}
        pageIndex={0}
      />
    );
    const noData = wrapper.find(dataQa('table-no-data'));

    expect(wrapper.find(dataQa('table-loading'))).toHaveLength(0);
    expect(wrapper.find(dataQa('table'))).toHaveLength(0);
    expect(noData).toHaveLength(1);
    expect(noData.text()).toEqual('empty');
  });
});
