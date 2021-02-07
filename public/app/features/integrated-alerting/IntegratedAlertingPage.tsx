import React, { FC, useMemo, useState } from 'react';
import { TabsBar, TabContent, Tab, useStyles } from '@grafana/ui';
import { Messages } from './IntegratedAlerting.messages';
import { getStyles } from './IntegratedAlerting.styles';
import { TabKeys } from './IntegratedAlerting.types';
import { Alerts, AlertRuleTemplate, AlertRules, NotificationChannel } from './components';

const IntegratedAlertingPage: FC = () => {
  const styles = useStyles(getStyles);
  const [activeTab, setActiveTab] = useState(TabKeys.alerts);
  const tabs = useMemo(
    () => [
      {
        label: Messages.tabs.alerts,
        key: TabKeys.alerts,
        component: <Alerts key={TabKeys.alerts} />,
      },
      {
        label: Messages.tabs.alertRules,
        key: TabKeys.alertRules,
        component: <AlertRules key={TabKeys.alertRules} />,
      },
      {
        label: Messages.tabs.alertRuleTemplates,
        key: TabKeys.alertRuleTemplates,
        component: <AlertRuleTemplate key={TabKeys.alertRuleTemplates} />,
      },
      {
        label: Messages.tabs.notificationChannels,
        key: TabKeys.notificationChannels,
        component: <NotificationChannel key={TabKeys.notificationChannels} />,
      },
    ],
    []
  );

  return (
    <div className={styles.integratedAlertingWrapper}>
      <TabsBar>
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            label={tab.label}
            active={tab.key === activeTab}
            onChangeTab={() => setActiveTab(tab.key)}
          />
        ))}
      </TabsBar>
      <TabContent>{tabs.find((tab) => tab.key === activeTab)?.component || null}</TabContent>
    </div>
  );
};

export default IntegratedAlertingPage;
