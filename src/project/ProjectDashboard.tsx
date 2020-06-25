import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import { Panel } from '@waldur/core/Panel';
import { Widget } from '@waldur/core/Widget';
import { CategoryResourcesList } from '@waldur/dashboard/CategoryResourcesList';
import { DashboardHeader } from '@waldur/dashboard/DashboardHeader';
import { translate } from '@waldur/i18n';
import { ComplianceChecklists } from '@waldur/marketplace-checklist/ComplianceChecklists';
import { useTitle } from '@waldur/navigation/title';
import { User, Project } from '@waldur/workspace/types';

import { ProjectActions } from './ProjectActions';
import { ProjectCounters } from './ProjectCounters';
import { ProjectResourcesList } from './ProjectResourcesList';

interface ProjectDashboardProps {
  user: User;
  project: Project;
  canAddUser: boolean;
  marketplaceChecklistEnabled: boolean;
}

export const ProjectDashboard = (props: ProjectDashboardProps) => {
  useTitle(translate('Dashboard'));

  if (!props.project) {
    return null;
  }

  return (
    <>
      <DashboardHeader
        title={translate('Welcome, {user}!', { user: props.user.full_name })}
        subtitle={translate('Overview of {project} project', {
          project: props.project.name,
        })}
      />
      <>
        <Row>
          <Col md={9}>
            <ProjectCounters project={props.project} />
          </Col>
          <Col md={3}>
            <Widget className="no-padding">
              <ProjectActions {...props} />
            </Widget>
          </Col>
        </Row>
        {props.marketplaceChecklistEnabled && (
          <Panel title={translate('Compliance checklists')}>
            <ComplianceChecklists />
          </Panel>
        )}
        <Panel title={translate('Resources')}>
          <ProjectResourcesList />
        </Panel>
        <CategoryResourcesList scopeType="project" scope={props.project} />
      </>
    </>
  );
};
