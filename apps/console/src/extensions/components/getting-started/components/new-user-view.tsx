/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { resolveUserDisplayName } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { Heading, PageLayout } from "@wso2is/react-components";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid, Placeholder } from "semantic-ui-react";
import { ApplicationTemplateCard } from "./application-template-card";
import { PlaygroundApplicationCard } from "./playground-app-card";
import { MinimalAppCreateWizard } from "../../../../features/applications/components";
import { ApplicationManagementConstants } from "../../../../features/applications/constants";
import {
    ApplicationListItemInterface,
    ApplicationTemplateListItemInterface
} from "../../../../features/applications/models";
import { AppState, ConfigReducerStateInterface } from "../../../../features/core";
import { FeatureConfigInterface } from "../../../../features/core/models";

export type NewUserViewContextCardPropsInterface = {
    applications: ApplicationListItemInterface[];
    isApplicationsFetchRequestLoading?: boolean;
    isApplicationsAvailable?: boolean;
    onApplicationCreate: () => void;
} & IdentifiableComponentInterface;

export const NewUserView: FC<NewUserViewContextCardPropsInterface> = (props: NewUserViewContextCardPropsInterface) => {
    const {
        applications,
        isApplicationsAvailable,
        isApplicationsFetchRequestLoading,
        onApplicationCreate,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const isProfileInfoLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoRequestLoading);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const username: string = useSelector((state: AppState) => state.auth.fullName);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<ApplicationTemplateListItemInterface>(null);

    return (
        <PageLayout
            padded={ false }
            contentTopMargin={ false }
            data-componentid={ `${componentId}-layout` }
            className="getting-started-page"
        >
            <div
                className="new-user-greeting-container"
            >
                <Heading
                    ellipsis
                    compact
                    as="h1"
                    bold="500"
                    data-testid="welcome-greeting-header"
                    data-componentid="welcome-greeting-header"
                    data-suppress=""
                >
                    {
                        isProfileInfoLoading
                            ? (
                                <Placeholder
                                    data-testid="welcome-greeting-placeholder"
                                    data-componentid="welcome-greeting-placeholder"
                                >
                                    <Placeholder.Header>
                                        <Placeholder.Line length="very long"/>
                                    </Placeholder.Header>
                                </Placeholder>
                            )
                            : t("extensions:common.quickStart.greeting.heading", {
                                username: isPrivilegedUser ? username : resolveUserDisplayName(profileInfo)
                            })
                    }
                </Heading>
                <Heading
                    subHeading
                    ellipsis
                    as="h5"
                    data-testid="welcome-greeting-sub-header"
                    data-componentid="welcome-greeting-sub-header"
                >
                    { "Let's onboard your apps or try out how your login looks like using the Try It app" }
                </Heading>
            </div>
            <div className="new-user-view-cards-wrapper">
                <Grid stackable>
                    <Grid.Row relaxed="very">
                        <Show
                            when={ [
                                AccessControlConstants.APPLICATION_WRITE,
                                AccessControlConstants.APPLICATION_READ
                            ] }
                        >
                            <Grid.Column width={ featureConfig.tryIt?.enabled ? 7 : 16 }>
                                <ApplicationTemplateCard
                                    applications={ applications }
                                    isApplicationsAvailable={ isApplicationsAvailable }
                                    isApplicationsFetchRequestLoading={ isApplicationsFetchRequestLoading }
                                    onTemplateSelected={ (template) => {
                                        setSelectedTemplate(template);
                                        setShowWizard(true);
                                    } }
                                />
                            </Grid.Column>

                            { featureConfig.tryIt?.enabled && (
                                <>
                                    <Grid.Column width={ 2 }>
                                        <Divider className="vertical-divider-with-no-border" vertical>
                                            Or
                                        </Divider>
                                    </Grid.Column>
                                    <Grid.Column width={ 7 }>
                                        <PlaygroundApplicationCard onApplicationCreate={ onApplicationCreate } />
                                    </Grid.Column>
                                </>
                            ) }
                        </Show>
                    </Grid.Row>
                </Grid>
            </div>
            { showWizard && (
                <MinimalAppCreateWizard
                    title={ selectedTemplate?.name }
                    subTitle={ selectedTemplate?.description }
                    closeWizard={ (): void => {
                        setShowWizard(false);
                        setSelectedTemplate(undefined);
                    } }
                    template={ selectedTemplate }
                    showHelpPanel={ true }
                    subTemplates={ selectedTemplate?.subTemplates }
                    subTemplatesSectionTitle={ selectedTemplate?.subTemplatesSectionTitle }
                    addProtocol={ false }
                    templateLoadingStrategy={
                        config.ui.applicationTemplateLoadingStrategy
                        ?? ApplicationManagementConstants.DEFAULT_APP_TEMPLATE_LOADING_STRATEGY
                    }
                />
            ) }
        </PageLayout>
    );
};

/**
 * Default props of {@link DynamicApplicationContextCard}
 */
NewUserView.defaultProps = {
    "data-componentid": "dynamic-application-context-card"
};
