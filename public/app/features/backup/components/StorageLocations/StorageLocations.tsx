import React, { FC, useState, useEffect } from 'react';
import { Column } from 'react-table';
import { logger } from '@percona/platform-core';
import { IconButton, useStyles } from '@grafana/ui';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { Messages } from './StorageLocations.messages';
import { StorageLocation } from './StorageLocations.types';
import { StorageLocationsService } from './StorageLocations.service';
import { formatLocationList } from './StorageLocations.utils';
import { getStyles } from './StorageLocations.styles';

const { noData, columns } = Messages;
const { name, type, path } = columns;

export const StorageLocations: FC = () => {
  const [pending, setPending] = useState(true);
  const [data, setData] = useState<StorageLocation[]>([]);
  const styles = useStyles(getStyles);
  const columns = React.useMemo(
    (): Column[] => [
      {
        Header: name,
        accessor: 'name',
        id: 'location-expander',
        Cell: ({ row, value }) => (
          <div className={styles.nameWrapper}>
            {value}
            {row.isExpanded ? (
              <IconButton
                {...row.getToggleRowExpandedProps()}
                data-qa="hide-storage-location-details"
                name="arrow-up"
              />
            ) : (
              <IconButton
                {...row.getToggleRowExpandedProps()}
                data-qa="show-storage-location-details"
                name="arrow-down"
              />
            )}
          </div>
        ),
      },
      {
        Header: type,
        accessor: 'type',
      },
      {
        Header: path,
        accessor: 'path',
      },
    ],
    []
  );

  const getData = async () => {
    setPending(true);
    try {
      const rawData = await StorageLocationsService.list();
      setData(formatLocationList(rawData));
    } catch (e) {
      logger.error(e);
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return <Table data={data} columns={columns} emptyMessage={noData} pendingRequest={pending}></Table>;
};
