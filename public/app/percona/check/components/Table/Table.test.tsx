import React from 'react';
import { shallow } from 'enzyme';
import { COLUMNS } from 'app/percona/check/CheckPanel.constants';
import { activeCheckStub } from 'app/percona/check/__mocks__/stubs';
import { Table, TableBody, TableHeader } from 'app/percona/check/components/Table';

describe('Table::', () => {
  it('should display a custom message if STT is enabled and data is empty', () => {
    const root = shallow(<Table columns={COLUMNS} data={[]} />);

    const emptyDiv = root.find('[data-testid="db-check-panel-table-empty"]');

    expect(emptyDiv.length).toEqual(1);
    expect(emptyDiv.text()).toEqual('No failed checks.');
  });

  it('should render the table with a header and a body if STT is enabled and data is not empty', () => {
    const root = shallow(<Table columns={COLUMNS} data={activeCheckStub} />);

    const table = root.find('[data-testid="db-check-panel-table"]');

    expect(table.length).toEqual(1);
    expect(table.find(TableHeader).length).toEqual(1);
    expect(table.find(TableBody).length).toEqual(1);
  });
});
