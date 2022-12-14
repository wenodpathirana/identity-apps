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
import { GenericIcon, Heading, PageLayout, Popup, Text } from "@wso2is/react-components";
import axios from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, Card, Grid, Label, Placeholder } from "semantic-ui-react";
import { CardExpandedNavigationButton } from "./card-expanded-navigation-button";
import { LoginPlaygroundWizard } from "./login-playground-wizard";
import {
    getApplicationDetails,
    getInboundProtocolConfig,
    useApplicationList
} from "../../../../features/applications/api";
import { MinimalAppCreateWizard } from "../../../../features/applications/components";
import { ApplicationManagementConstants } from "../../../../features/applications/constants";
import {
    ApplicationListItemInterface,
    ApplicationTemplateListItemInterface
} from "../../../../features/applications/models";
import { ApplicationManagementUtils } from "../../../../features/applications/utils";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    EventPublisher,
    FeatureConfigInterface,
    history,
    setActiveView
} from "../../../../features/core";
import { UsersList } from "../../../../features/users";
import { useUsersList } from "../../../../features/users/api";
import { AppViewExtensionTypes } from "../../../configs";
import { TryItApplicationConstants } from "../../application/constants";
import { getTryItClientId } from "../../application/utils/try-it-utils";
import { CONSUMER_USERSTORE } from "../../users/constants";
import { DynamicApplicationContextCard } from "../components/dynamic-application-context-card";
import { getGettingStartedCardIllustrations } from "../configs";

/**
 * Proptypes for the overview page component.
 */
interface AdvanceUserViewInterface extends IdentifiableComponentInterface {
    onApplicationCreate: () => void;
}

/**
 * Overview page.
 *
 * @param props - Props injected to the component.
 *
 * @returns AdvanceUserView component
 */
const AdvanceUserView: FunctionComponent<AdvanceUserViewInterface> = (
    props: AdvanceUserViewInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        onApplicationCreate
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const isProfileInfoLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoRequestLoading);
    const asgardeoTryItURL: string = useSelector((state: AppState) =>
        state.config.deployment.extensions.asgardeoTryItURL) as string;
    const activeView: string = useSelector((state: AppState) => state.global.activeView);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const username: string = useSelector((state: AppState) => state.auth.fullName);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    const [ , setIsConsumersAvailable ] = useState<boolean>(undefined);
    const [ isApplicationsAvailable, setIsApplicationsAvailable ] = useState<boolean>(undefined);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<ApplicationTemplateListItemInterface>(null);
    const [ isPlaygroundExist, setisPlaygroundExist ] = useState(undefined);
    const [ showWizardLogin, setShowWizardLogin ] = useState<boolean>(false);
    const [ inboundProtocolConfig, setInboundProtocolConfig ] = useState<any>(undefined);
    const [
        isTryItApplicationSearchRequestLoading,
        setIsTryItApplicationSearchRequestLoading
    ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const {
        data: applicationList,
        isLoading: isApplicationListFetchRequestLoading,
        error: applicationListFetchRequestError
    } = useApplicationList(null, null, null, null);

    const {
        data: tryItApplicationSearchResults,
        isLoading: _isTryItApplicationSearchRequestLoading,
        error: tryItApplicationSearchRequestError
    } = useApplicationList(null, null, null, `name eq ${ TryItApplicationConstants.DISPLAY_NAME }`);

    const {
        data: userList,
        error: userListFetchRequestError
    } = useUsersList(null, null, null, "id", CONSUMER_USERSTORE);

    useEffect(() => {
        checkTryItApplicationExistence();
    }, [ tryItApplicationSearchResults ]);

    /**
     * Make sure `QUICKSTART` tab is highlighed when this page is in use.
     */
    useEffect(() => {
        if (activeView === AppViewExtensionTypes.QUICKSTART) {
            return;
        }

        dispatch(setActiveView(AppViewExtensionTypes.QUICKSTART));
    }, []);

    useEffect(() => {

        if (!applicationList) {
            return;
        }

        setIsApplicationsAvailable(applicationList.totalResults > 0);
    }, [ applicationList ]);

    useEffect(() => {
        // Add debug logs here one a logger is added.
        // Tracked here https://github.com/wso2/product-is/issues/11650.
    }, [ applicationListFetchRequestError ]);

    useEffect(() => {
        // Add debug logs here one a logger is added.
        // Tracked here https://github.com/wso2/product-is/issues/11650.
    }, [ tryItApplicationSearchRequestError ]);

    useEffect(() => {
        if (!userList) {
            return;
        }

        setIsConsumersAvailable(userList.totalResults > 0);
    }, [ UsersList ]);

    useEffect(() => {
        // Add debug logs here one a logger is added.
        // Tracked here https://github.com/wso2/product-is/issues/11650.
    }, [ userListFetchRequestError ]);

    /**
     * Monitor `profileInfo.id` and publish the event to avoid an event without `UUID`.
     */
    useEffect(() => {
        if (!profileInfo?.id) {
            return;
        }

        // TODO: Move this to the `extensions/configs/common`.
        // Tracked here https://github.com/wso2-enterprise/asgardeo-product/issues/7742#issuecomment-939960128.
        eventPublisher.publish("console-click-getting-started-menu-item");
    }, [ profileInfo?.id ]);

    const handleTryLoginClick = () => {
        if(isPlaygroundExist){
            window.open(asgardeoTryItURL+"?client_id="+getTryItClientId(tenantDomain)+"&org="+tenantDomain);
            eventPublisher.publish("tryit-try-login-overview", {
                "client-id": inboundProtocolConfig?.oauth2?.clientId
            });
        } else{
            eventPublisher.publish("application-quick-start-click-add-user");
            setShowWizardLogin(true);
        }
    };

    const onCustomizeLoginFlowNavigate = (): void => {
        eventPublisher.publish("tryit-customize-login-flow", {
            "client-id": getTryItClientId(tenantDomain)
        });
        history.push(AppConstants.getPaths()
            .get("APPLICATION_EDIT").replace(":id", `${ tryItApplicationSearchResults.applications[0].id }#tab=2`) );
    };

    /**
     * Checking whether the playground application already exist or not
     */
    const checkTryItApplicationExistence = () => {

        setIsTryItApplicationSearchRequestLoading(true);

        if (!tryItApplicationSearchResults?.applications) {
            return;
        }

        if (tryItApplicationSearchResults.applications.length <= 0) {
            setisPlaygroundExist(false);
            setIsTryItApplicationSearchRequestLoading(false);

            return;
        }

        const applicationDetailPromises: Promise<any>[] = [];
        let protocolConfigs: any = {};

        tryItApplicationSearchResults.applications.forEach((application: ApplicationListItemInterface) => {
            applicationDetailPromises.push(getApplicationDetails(application.id));
        });

        axios.all(applicationDetailPromises)
            .then(axios.spread((...responses: any[]) => {
                getInboundProtocolConfig(
                    responses[0].id,
                    ApplicationManagementUtils.mapProtocolTypeToName(responses[0].inboundProtocols[0].type)
                )
                    .then((response: any) => {
                        protocolConfigs = {
                            ...protocolConfigs,[responses[0].inboundProtocols[0].type]:response
                        };
                        setInboundProtocolConfig(protocolConfigs);
                    })
                    .finally(() =>{
                        if (protocolConfigs?.oauth2?.clientId === getTryItClientId(tenantDomain)) {
                            setisPlaygroundExist(true);
                        } else{
                            setisPlaygroundExist(false);
                        }
                    });
            }))
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            })
            .finally(() => {
                setIsTryItApplicationSearchRequestLoading(false);
            });
    };

    const renderManageUsersCard = (): ReactElement => (
        <Grid.Column
            stretched
            mobile={ 16 }
            tablet={ 16 }
            computer={ 8 }
            largeScreen={ 8 }
            widescreen={ 8 }
        >
            <Card
                fluid
                className="basic-card no-hover getting-started-card manage-users-card"
            >
                <Card.Content extra className="description-container">
                    <div className="card-heading mb-1">
                        <Heading as="h2">
                            Manage users
                        </Heading>
                    </div>
                    <Text muted>
                        Manage users in your organization who will access the  applications
                    </Text>
                </Card.Content>
                <Card.Content style={ { borderTop: "none" } } className="illustration-container">
                    <GenericIcon
                        relaxed="very"
                        size="small"
                        transparent
                        className="onboard-users-animated-illustration mb-5"
                        icon={ getGettingStartedCardIllustrations().onboardUsers }
                    />
                </Card.Content>
                <Card.Content className="action-container" extra>
                    <CardExpandedNavigationButton
                        data-testid="getting-started-page-add-user-button"
                        data-componentid="getting-started-page-add-user-button"
                        onClick={ () => {
                            eventPublisher.publish("console-getting-started-add-users-path");
                            history.push(AppConstants.getPaths().get("USERS"));
                        } }
                        text="View users"
                        icon="angle right"
                        iconPlacement="right"
                        className="primary-action-button"
                    />
                </Card.Content>
            </Card>
        </Grid.Column>
    );

    const renderConnectionsCard = (): ReactElement => (
        <Grid.Column
            stretched
            mobile={ 16 }
            tablet={ 16 }
            computer={ 8 }
            largeScreen={ 8 }
            widescreen={ 8 }
        >
            <Card
                fluid
                className="basic-card no-hover getting-started-card social-connections-card"
            >
                <Card.Content extra className="description-container">
                    <div className="card-heading mb-1">
                        <Heading as="h2">
                            Enhance app login
                        </Heading>
                    </div>
                    <Text muted>
                        { t("extensions:common.quickStart.sections.addSocialLogin.description") }
                    </Text>
                </Card.Content>
                <Card.Content style={ { borderTop: "none" } } className="illustration-container">
                    <GenericIcon
                        relaxed="very"
                        size="small"
                        transparent
                        className="social-connections-animated-illustration mb-5"
                        icon={ getGettingStartedCardIllustrations().setupSocialConnections }
                    />
                </Card.Content>
                <Card.Content extra className="action-container">
                    <CardExpandedNavigationButton
                        data-testid="develop-getting-started-page-add-social-login"
                        data-componentid="develop-getting-started-page-add-social-login"
                        onClick={ () => {
                            eventPublisher.publish("console-getting-started-add-social-connection-path");
                            history.push({
                                pathname: AppConstants.getPaths().get("CONNECTIONS")
                            });
                        } }
                        text="Set up social connections"
                        icon="angle right"
                        iconPlacement="right"
                        className="primary-action-button"
                    />
                </Card.Content>
            </Card>
        </Grid.Column>
    );

    const renderTryItCard = (): ReactElement => (
        <Grid.Row>
            <Grid.Column>
                <Card
                    fluid
                    className="basic-card no-hover"
                >
                    <Card.Content>
                        <div className="try-it-card">
                            <div className="try-it-card-icon">
                                <GenericIcon
                                    style={ {
                                        height: "91.3px",
                                        width: "111.26px"
                                    } }
                                    floated="left"
                                    transparent
                                    icon={
                                        getGettingStartedCardIllustrations()
                                            .tryItApplication
                                    }
                                />
                            </div>
                            <div className="try-it-card-content">
                                <div className="card-heading pt-3 mb-1">
                                    <Heading as="h2">
                                        Try login with the Try It app
                                        <Label
                                            color="purple"
                                            size="mini"
                                            className="feature-status-label new ml-2"
                                        >
                                            NEW
                                        </Label>
                                    </Heading>
                                </div>
                                <Text muted>
                                    Use the hosted sample application to try basic and
                                    customized login flows of Asgardeo.
                                </Text>
                            </div>
                            <div className="try-it-card-actions">
                                {
                                    (isTryItApplicationSearchRequestLoading || isPlaygroundExist === undefined)
                                        ?  (
                                            <Button
                                                loading
                                                floated="right"
                                                data-componentid={
                                                    "develop-getting-started-page-try-it-loading"
                                                }
                                                className={
                                                    "primary-action-button loading mr-3"
                                                }
                                            />
                                        )
                                        : (
                                            <>
                                                <Popup
                                                    position="top center"
                                                    trigger={ (
                                                        <Button
                                                            data-testid="develop-getting-started-page-try-it"
                                                            data-componentid="develop-getting-started-page-try-it"
                                                            onClick={ handleTryLoginClick }
                                                            icon="angle right"
                                                            iconPlacement="right"
                                                            className="primary-action-button mr-3"
                                                            size="large"
                                                        />
                                                    ) }
                                                    content="Try It"
                                                    inverted
                                                />
                                                {
                                                    isPlaygroundExist && (
                                                        <Popup
                                                            position="top center"
                                                            trigger={ (
                                                                <Button
                                                                    data-testid={
                                                                        "develop-getting-started-page-cutomize-try-it"
                                                                    }
                                                                    data-componentid={
                                                                        "develop-getting-started-page-cutomize-try-it"
                                                                    }
                                                                    onClick={ onCustomizeLoginFlowNavigate }
                                                                    icon="setting"
                                                                    iconPlacement="right"
                                                                    size="large"
                                                                    className="primary-action-button"
                                                                />
                                                            ) }
                                                            content="Customize Login Flow"
                                                            inverted
                                                        />
                                                    )
                                                }
                                            </>
                                        )
                                }
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </Grid.Column>
        </Grid.Row>
    );

    return (
        <PageLayout
            padded={ false }
            contentTopMargin={ false }
            data-componentid={ `${componentId}-layout` }
            className="getting-started-page"
        >
            <div className="advance-user-view-cards-wrapper">
                <div className="greeting">
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
                </div>
                <Grid stackable>
                    <Grid.Row columns={ 2 }>
                        <Show
                            when={
                                [ AccessControlConstants.APPLICATION_WRITE, AccessControlConstants.APPLICATION_READ ]
                            }
                        >
                            <Grid.Column
                                stretched
                                mobile={ 16 }
                                tablet={ 16 }
                                computer={ 6 }
                                largeScreen={ 6 }
                                widescreen={ 6 }
                            >
                                <DynamicApplicationContextCard
                                    applications={ applicationList?.applications }
                                    isApplicationsAvailable={ isApplicationsAvailable }
                                    isApplicationsFetchRequestLoading={ isApplicationListFetchRequestLoading }
                                    onTemplateSelected={ (template: ApplicationTemplateListItemInterface) => {
                                        setSelectedTemplate(template);
                                        setShowWizard(true);
                                    } }
                                />
                            </Grid.Column>
                        </Show>
                        <Grid.Column
                            stretched
                            mobile={ 16 }
                            tablet={ 16 }
                            computer={ 10 }
                            largeScreen={ 10 }
                            widescreen={ 10 }
                        >
                            <Grid stackable>
                                <Grid.Row columns={ 2 }>
                                    <Show when={ AccessControlConstants.USER_READ }>
                                        { renderManageUsersCard() }
                                    </Show>
                                    <Show when={ AccessControlConstants.IDP_READ }>
                                        { renderConnectionsCard() }
                                    </Show>
                                </Grid.Row>
                                <Show when={ AccessControlConstants.APPLICATION_WRITE }>
                                    { featureConfig.tryIt?.enabled && renderTryItCard() }
                                </Show>

                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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
                {
                    showWizardLogin && (
                        <LoginPlaygroundWizard
                            data-componentId="login-playground-wizard-modal"
                            closeWizard={ () => setShowWizardLogin(false) }
                            applicationName="Asgardeo Login Playground"
                            onApplicationCreate={ () => {
                                setisPlaygroundExist(true);
                                onApplicationCreate();
                            } }
                        />
                    )
                }
            </div>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
AdvanceUserView.defaultProps = {
    "data-componentid": "getting-started-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AdvanceUserView;
