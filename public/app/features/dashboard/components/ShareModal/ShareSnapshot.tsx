import React, { PureComponent } from 'react';
import { Button, ClipboardButton, Icon, Spinner, Select, Input, Field } from '@grafana/ui';
import { AppEvents, SelectableValue } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { DashboardModel, PanelModel } from 'app/features/dashboard/state';
import { getTimeSrv } from 'app/features/dashboard/services/TimeSrv';
import { appEvents } from 'app/core/core';
import { VariableRefresh } from '../../../variables/types';

const snapshotApiUrl = '/api/snapshots';

const expireOptions: Array<SelectableValue<number>> = [
  { label: 'Never', value: 0 },
  { label: '1 Hour', value: 60 * 60 },
  { label: '1 Day', value: 60 * 60 * 24 },
  { label: '7 Days', value: 60 * 60 * 24 * 7 },
  { label: '90 Days', value: 60 * 60 * 24 * 90 },
];

interface Props {
  dashboard: DashboardModel;
  panel?: PanelModel;
  onDismiss(): void;
}

interface State {
  isLoading: boolean;
  step: number;
  snapshotName: string;
  selectedExpireOption: SelectableValue<number>;
  snapshotExpires?: number;
  snapshotUrl: string;
  deleteUrl: string;
  timeoutSeconds: number;
  externalEnabled: boolean;
  sharingButtonText: string;
}

export class ShareSnapshot extends PureComponent<Props, State> {
  private dashboard: DashboardModel;

  constructor(props: Props) {
    super(props);
    this.dashboard = props.dashboard;
    this.state = {
      isLoading: false,
      step: 1,
      selectedExpireOption: expireOptions[4],
      snapshotExpires: expireOptions[4].value,
      snapshotName: props.dashboard.title,
      timeoutSeconds: 30,
      snapshotUrl: '',
      deleteUrl: '',
      externalEnabled: false,
      sharingButtonText: '',
    };
  }

  componentDidMount() {
    this.getSnaphotShareOptions();
  }

  async getSnaphotShareOptions() {
    const shareOptions = await getBackendSrv().get('/api/snapshot/shared-options');
    this.setState({
      sharingButtonText: shareOptions['externalSnapshotName'],
      externalEnabled: shareOptions['externalEnabled'],
    });
  }

  createSnapshot = (external?: boolean) => () => {
    const { timeoutSeconds } = this.state;
    this.dashboard.snapshot = {
      timestamp: new Date(),
    };

    if (!external) {
      this.dashboard.snapshot.originalUrl = window.location.href;
    }

    // @ts-ignore
    window.forceRefresh = true;
    this.setState({ isLoading: true });
    this.dashboard.startRefresh();

    setTimeout(() => {
      this.saveSnapshot(this.dashboard, external);
      // @ts-ignore
      window.forceRefresh = false;
    }, timeoutSeconds * 1000);
  };

  saveSnapshot = async (dashboard: DashboardModel, external?: boolean) => {
    const { snapshotExpires } = this.state;
    const dash = this.dashboard.getSaveModelClone();
    this.scrubDashboard(dash);

    const cmdData = {
      dashboard: dash,
      name: dash.title,
      expires: snapshotExpires,
      external: external,
    };

    try {
      const results: { deleteUrl: any; url: any } = await getBackendSrv().post(snapshotApiUrl, cmdData);
      this.setState({
        deleteUrl: results.deleteUrl,
        snapshotUrl: results.url,
        step: 2,
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  scrubDashboard = (dash: DashboardModel) => {
    const { panel } = this.props;
    const { snapshotName } = this.state;
    // change title
    dash.title = snapshotName;

    // make relative times absolute
    dash.time = getTimeSrv().timeRange();

    // Remove links
    dash.links = [];

    // remove panel queries & links
    dash.panels.forEach((panel) => {
      panel.targets = [];
      panel.links = [];
      panel.datasource = null;
    });

    // remove annotation queries
    const annotations = dash.annotations.list.filter((annotation) => annotation.enable);
    dash.annotations.list = annotations.map((annotation: any) => {
      return {
        name: annotation.name,
        enable: annotation.enable,
        iconColor: annotation.iconColor,
        snapshotData: annotation.snapshotData,
        type: annotation.type,
        builtIn: annotation.builtIn,
        hide: annotation.hide,
      };
    });

    // remove template queries
    dash.getVariables().forEach((variable: any) => {
      variable.query = '';
      variable.options = variable.current ? [variable.current] : [];
      variable.refresh = VariableRefresh.never;
    });

    // snapshot single panel
    if (panel) {
      const singlePanel = panel.getSaveModel();
      singlePanel.gridPos.w = 24;
      singlePanel.gridPos.x = 0;
      singlePanel.gridPos.y = 0;
      singlePanel.gridPos.h = 20;
      dash.panels = [singlePanel];
    }

    // cleanup snapshotData
    delete this.dashboard.snapshot;
    this.dashboard.forEachPanel((panel: PanelModel) => {
      delete panel.snapshotData;
    });
    this.dashboard.annotations.list.forEach((annotation) => {
      delete annotation.snapshotData;
    });
  };

  deleteSnapshot = async () => {
    const { deleteUrl } = this.state;
    await getBackendSrv().get(deleteUrl);
    this.setState({ step: 3 });
  };

  getSnapshotUrl = () => {
    return this.state.snapshotUrl;
  };

  onSnapshotNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ snapshotName: event.target.value });
  };

  onTimeoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ timeoutSeconds: Number(event.target.value) });
  };

  onExpireChange = (option: SelectableValue<number>) => {
    this.setState({
      selectedExpireOption: option,
      snapshotExpires: option.value,
    });
  };

  onSnapshotUrlCopy = () => {
    appEvents.emit(AppEvents.alertSuccess, ['Content copied to clipboard']);
  };

  renderStep1() {
    const { onDismiss } = this.props;
    const {
      snapshotName,
      selectedExpireOption,
      timeoutSeconds,
      isLoading,
      sharingButtonText,
      externalEnabled,
    } = this.state;

    return (
      <>
        <div>
          <p className="share-modal-info-text">
            A snapshot is a way to securely share your dashboard with Percona. When created, we{' '}
            <strong>strip sensitive data </strong>
            like queries (metrics, template variables, and annotations) along with panel links. The shared dashboard
            will only be available for viewing by Percona Engineers, and the content on the dashboard will assist
            Percona Engineers in troubleshooting your case.
          </p>
          <p className="share-modal-info-text">
            You can safely leave the defaults set as they are, but for further information:
          </p>
          <p className="share-modal-info-text">
            <ul>
              <li>
                <strong>Snapshot Name:</strong> Give the snapshot a name so that Percona can distinguish your dashboard.
              </li>
              <li>
                <strong>Expire:</strong> The time before snapshot expires. Configure lower if required. Percona
                automatically purge shared dashboards after 90 days.
              </li>
              <li>
                <strong>Timeout (seconds):</strong> Time the dashboard takes to load before the snapshot is generated.
              </li>
            </ul>
          </p>
          <p className="share-modal-info-text">
            <strong>What to do next: </strong> Once you click <i>Share with Percona</i>, wait for the dashboard to be
            generated, and you will be provided with a unique URL that then needs to be communicated to Percona via your
            ticket.
          </p>
        </div>
        <Field label="Snapshot name">
          <Input width={30} value={snapshotName} onChange={this.onSnapshotNameChange} />
        </Field>
        <Field label="Expire">
          <Select width={30} options={expireOptions} value={selectedExpireOption} onChange={this.onExpireChange} />
        </Field>
        <Field
          label="Timeout (seconds)"
          description="You may need to configure the timeout value if it takes a long time to collect your dashboard's
            metrics."
        >
          <Input type="number" width={21} value={timeoutSeconds} onChange={this.onTimeoutChange} />
        </Field>

        <div className="gf-form-button-row">
          <Button variant="primary" disabled={isLoading} onClick={this.createSnapshot()}>
            Local Snapshot
          </Button>
          {externalEnabled && (
            <Button variant="secondary" disabled={isLoading} onClick={this.createSnapshot(true)}>
              {sharingButtonText}
            </Button>
          )}
          <Button variant="secondary" onClick={onDismiss}>
            Cancel
          </Button>
        </div>
      </>
    );
  }

  renderStep2() {
    const { snapshotUrl } = this.state;

    return (
      <>
        <div className="gf-form" style={{ marginTop: '40px' }}>
          <div className="gf-form-row">
            <a href={snapshotUrl} className="large share-modal-link" target="_blank" rel="noreferrer">
              <Icon name="external-link-alt" /> {snapshotUrl}
            </a>
            <br />
            <ClipboardButton variant="secondary" getText={this.getSnapshotUrl} onClipboardCopy={this.onSnapshotUrlCopy}>
              Copy Link
            </ClipboardButton>
          </div>
        </div>
      </>
    );
  }

  renderStep3() {
    return (
      <div className="share-modal-header">
        <p className="share-modal-info-text">
          The snapshot has now been deleted. If you have already accessed it once, it might take up to an hour before it
          is removed from browser caches or CDN caches.
        </p>
      </div>
    );
  }

  render() {
    const { isLoading, step } = this.state;

    return (
      <div className="share-modal-body">
        <div className="share-modal-header">
          {isLoading ? (
            <div className="share-modal-big-icon">
              <Icon name="fa fa-spinner" className="fa-spin" />
            </div>
          ) : (
            <Icon name="camera" className="share-modal-big-icon" size="xxl" />
          )}
          <div className="share-modal-content">
            {step === 1 && this.renderStep1()}
            {step === 2 && this.renderStep2()}
            {step === 3 && this.renderStep3()}
            {isLoading && <Spinner inline={true} />}
          </div>
        </div>
      </div>
    );
  }
}
