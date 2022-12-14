/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, Heading, Text } from "@wso2is/react-components";
import classNames from "classnames";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Divider, Grid } from "semantic-ui-react";
import { CategoryItem } from "./app-category-item";
import { CardExpandedNavigationButton } from "./card-expanded-navigation-button";
import { getApplicationTemplateIllustrations } from "../../../../features/applications/configs";
import CustomApplicationTemplate from
    "../../../../features/applications/data/application-templates/templates/custom-application/custom-application.json";
import {
    ApplicationListItemInterface,
    ApplicationTemplateListItemInterface
} from "../../../../features/applications/models";
import { ApplicationTemplateManagementUtils } from "../../../../features/applications/utils";
import { AppConstants, AppState, EventPublisher, history } from "../../../../features/core";

export type DynamicApplicationContextCardPropsInterface = {
    applications: ApplicationListItemInterface[];
    isApplicationsFetchRequestLoading?: boolean;
    isApplicationsAvailable?: boolean;
    onTemplateSelected: (group: ApplicationTemplateListItemInterface) => void;
} & IdentifiableComponentInterface;

export type Context = "TEMPLATES" | "RECENT_APPS";

export const DynamicApplicationContextCard: FC<DynamicApplicationContextCardPropsInterface> = (
    props: DynamicApplicationContextCardPropsInterface
) => {

    const {
        isApplicationsFetchRequestLoading,
        onTemplateSelected,
        ["data-componentid"]: testId
    } = props;

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state?.application?.groupedTemplates
    );
    const [ context, setContext ] = useState<Context | undefined>(undefined);

    /**
     * Figure out which context should be shown initially.
     * If there's one or more applications is available then
     * we show the recent apps view.
     */
    useEffect(() => {
        setContext("TEMPLATES");
    }, []);

    /**
     * Fetch the application templates if
     * {@link applicationTemplates} is unavailable.
     */
    useEffect(() => {
        if (applicationTemplates === undefined) {
            ApplicationTemplateManagementUtils.getApplicationTemplates().finally();
        }
    }, [ applicationTemplates ]);

    const handleTemplateSelection = (templateId: string): void => {

        if (!applicationTemplates) return;

        let selected: ApplicationTemplateListItemInterface =
            applicationTemplates.find(({ templateId: matcher }) => matcher === templateId);

        if (!selected) return;

        if (templateId === CustomApplicationTemplate.id) {
            selected = cloneDeep(CustomApplicationTemplate);
        }

        eventPublisher.publish("application-click-create-new", {
            source: "getting-started-page",
            type: selected.templateId
        });

        onTemplateSelected(selected);
    };

    /**
     * Handler for view all applications button.
     */
    const onViewAllApplicationsClick = (e: React.SyntheticEvent): void => {
        e?.preventDefault();
        eventPublisher.publish("console-getting-started-view-all-applications-path");
        history.push({
            pathname: AppConstants.getPaths().get("APPLICATIONS")
        });
    };

    const tile1 = (
        <CategoryItem
            data-componentid={ `${ testId }-single-page-application-creation-tile` }
            style={ { animationDuration: "350ms", backgroundColor: "#D0DBDA4A", border: "none" } }
            className={
                classNames("ui scale transition", {
                    "animating in visible": context === "TEMPLATES",
                    "hidden animating out": context !== "TEMPLATES"
                })
            }
            onClick={ () => {
                handleTemplateSelection(
                    "single-page-application"
                );
            } }
            iconSize="tiny"
            techStackIcons={ [
                getApplicationTemplateIllustrations().spa
            ] }
            categoryName="Single-Page Application"
        />
    );

    const tile2 = (
        <CategoryItem
            data-componentid={ `${ testId }-traditional-web-application-creation-tile` }
            style={ { animationDuration: "350ms", backgroundColor: "#D0DBDA4A", border: "none" } }
            className={
                classNames("ui scale transition", {
                    "animating in visible": context === "TEMPLATES",
                    "hidden animating out": context !== "TEMPLATES"
                })
            }
            onClick={ () => {
                handleTemplateSelection(
                    "traditional-web-application"
                );
            } }
            iconSize="tiny"
            techStackIcons={ [
                getApplicationTemplateIllustrations().oidcWebApp
            ] }
            categoryName="Traditional Web Application"
        />
    );

    const tile3 = (
        <CategoryItem
            data-componentid={ `${ testId }-mobile-application-creation-tile` }
            style={ { animationDuration: "350ms", backgroundColor: "#D0DBDA4A", border: "none" } }
            onClick={ () => {
                handleTemplateSelection(
                    "mobile-application"
                );
            } }
            iconSize="tiny"
            className={
                classNames("ui scale transition", {
                    "animating in visible": context === "TEMPLATES",
                    "hidden animating out": context !== "TEMPLATES"
                })
            }
            techStackIcons={ [
                getApplicationTemplateIllustrations().oidcMobile
            ] }
            categoryName="Mobile Application"
        />
    );

    const tile4 = (
        <CategoryItem
            data-componentid={ `${ testId }-custom-application-creation-tile` }
            onClick={ () => {
                handleTemplateSelection(
                    "custom-application"
                );
            } }
            iconSize="tiny"
            style={ { animationDuration: "350ms", backgroundColor: "#D0DBDA4A", border: "none" } }
            className={
                classNames("ui scale transition", {
                    "animating in visible": context === "TEMPLATES",
                    "hidden animating out": context !== "TEMPLATES"
                })
            }
            techStackIcons={ [
                getApplicationTemplateIllustrations().customApp
            ] }
            categoryName="Standard-Based Application"
        />
    );

    return (
        <Card
            fluid
            data-componentid="application-integration-card"
            data-testid="application-integration-card"
            className="basic-card no-hover context-card">
            { /*Card Heading*/ }
            <Card.Content extra className="no-borders mb-0 pb-0">
                <div className="card-heading mb-1">
                    <Heading className="mb-1" as="h2">
                        Onboard and manage apps
                    </Heading>
                    <Text muted>
                        Choose the type of application
                    </Text>
                </div>
            </Card.Content>
            <Divider className="0.5x" hidden/>
            { /*Card Body*/ }
            <Card.Content className="pt-0 px-2 no-borders">
                <Grid>
                    <Grid.Row columns={ 2 } style={ { rowGap: "13px" } }>
                        {
                            [ tile1, tile2, tile3, tile4 ].map((tile, index) => (
                                <Grid.Column width={ 8 } key={ `tile-${ index }` }>
                                    <Text weight="600">{ tile }</Text>
                                </Grid.Column>
                            ))
                        }
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <CardExpandedNavigationButton
                                data-componentid={ `${
                                    testId
                                }-navigate-to-application-list-button` }
                                onClick={ onViewAllApplicationsClick }
                                text="View all applications"
                                icon="angle right"
                                iconPlacement="right"
                                className="primary-action-button"
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card.Content>
            { isApplicationsFetchRequestLoading && <ContentLoader /> }
        </Card>
    );

};

/**
 * Default props of {@link DynamicApplicationContextCard}
 */
DynamicApplicationContextCard.defaultProps = {
    "data-componentid": "dynamic-application-context-card"
};
