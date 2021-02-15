import React, { FC, useState, useEffect } from 'react';
import { Column, Row } from 'react-table';
import { logger } from '@percona/platform-core';
import { Button, IconButton, useStyles } from '@grafana/ui';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { Messages } from './StorageLocations.messages';
import { StorageLocation } from './StorageLocations.types';
import { StorageLocationsService } from './StorageLocations.service';
import { formatLocationList } from './StorageLocations.utils';
import { getStyles } from './StorageLocations.styles';
import { StorageLocationDetails } from './StorageLocationDetails';
import { AddStorageLocationModal } from './AddStorageLocationModal';

const { noData, columns } = Messages;
const { name, type, path } = columns;

export const StorageLocations: FC = () => {
  const [pending, setPending] = useState(true);
  const [data, setData] = useState<StorageLocation[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation>();
  const styles = useStyles(getStyles);
  const columns = React.useMemo(
    (): Column[] => [
      {
        Header: name,
        accessor: 'name',
        id: 'name',
        Cell: ({ row, value }) => (
          <div className={styles.nameWrapper} {...row.getToggleRowExpandedProps()}>
            {value}
            {row.isExpanded ? (
              <IconButton data-qa="hide-storage-location-details" name="arrow-up" />
            ) : (
              <IconButton data-qa="show-storage-location-details" name="arrow-down" />
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

  const renderSelectedSubRow = React.useCallback(
    (row: Row) => <StorageLocationDetails location={row.original as StorageLocation} />,
    []
  );

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className={styles.addWrapper}>
        <Button
          size="md"
          icon="plus-square"
          variant="link"
          data-qa="storage-location-add-modal-button"
          onClick={() => {
            setSelectedLocation(null);
            setAddModalVisible(true);
          }}
        >
          {Messages.add}
        </Button>
      </div>
      <Table
        data={data}
        columns={columns}
        emptyMessage={noData}
        pendingRequest={pending}
        renderExpandedRow={renderSelectedSubRow}
      ></Table>
      <AddStorageLocationModal
        location={selectedLocation}
        isVisible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      />
    </>
  );
};
