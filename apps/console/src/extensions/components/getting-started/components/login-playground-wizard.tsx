/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ContentLoader,
    GenericIcon,
    Heading,
    PrimaryButton,
    SecondaryButton,
    Text
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import React, { Fragment,FunctionComponent, ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Icon, List, Modal } from "semantic-ui-react";
import { createApplication, getApplicationList } from "../../../../features/applications/api";
import { ApplicationManagementConstants } from "../../../../features/applications/constants";
import { ApplicationListInterface, MainApplicationInterface } from "../../../../features/applications/models";
import { AppState, EventPublisher } from "../../../../features/core";
import { TierLimitReachErrorModal } from "../../../../features/core/components/tier-limit-reach-error-modal";
import { getUserDetails } from "../../../../features/users";
import LoginApplicationTemplate from
    "../../../application-templates/templates/single-page-application/login-playground-application.json";
import InformationIcon from "../../../assets/images/illustrations/information-icon.svg";
import { getTryItClientId } from "../../application/utils/try-it-utils";
import { AddConsumerUserWizard } from "../../consumer-users/wizard";

/**
  * Prop types of the `LoginPlaygroundWizard` component.
  */ 
interface LoginPlaygroundWizardPropsInterface extends TestableComponentInterface {
     closeWizard: () => void;
     applicationName: string;
     onApplicationCreate: () => void;
}

const INTERMITTENT_REDIRECTION_TIMEOUT: number = 2000;

/**
 * Login Playground application creation wizard.
 *
 * @returns Login Playground application wizard.
 */
export const LoginPlaygroundWizard: FunctionComponent<LoginPlaygroundWizardPropsInterface> = (
    props: LoginPlaygroundWizardPropsInterface
): ReactElement => {
    const {
        closeWizard,
        [ "data-testid" ]: testId,
        onApplicationCreate
    } = props;

    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const asgardeoLoginPlaygroundURL: string = useSelector((state: AppState) => {
        return state.config?.deployment?.extensions?.asgardeoTryItURL as string;
    });

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const [ showApplicationCreationScreen, setShowApplicationCreationScreen ] = useState<boolean>(false);
    const [ showApplicationRedirectionScreen, setShowApplicationRedirectionScreen ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isUserAdded, setIsUserAdded ] = useState(false);
    const [ addedUserList, setAddedUserList ] = useState<string[]>([]);
    const [ openLimitReachedModal, setOpenLimitReachedModal ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    
    let response: ApplicationListInterface = null;

    
    const addNewUser = (id: string) => {
        setIsLoading(true);
        getUserDetails(id, null)
            .then((response) => {
                if (response.emails && Array.isArray(response.emails) && response.emails.length > 0) {
                    const users = addedUserList;

                    users.push(response.emails[ 0 ] as string);
                    setAddedUserList(users);
                    setIsUserAdded(true);
                }
            })
            .catch(() => {
                // TODO add to notifications
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const renderModalContent = (): ReactElement => {
        const renderApplicationRedirectionScreen = (): ReactElement => {
            return (
                <Modal.Content className="loading-modal">
                    <ContentLoader
                        dimmer
                        size="small"
                        text="Taking you to the Application ..." 
                    />
                </Modal.Content>
            );
        };
        
        const renderApplicationCreatingScreen = (): ReactElement => {
            return (
                <Modal.Content className="loading-modal">
                    <ContentLoader
                        dimmer
                        size="small"
                        text="Creating the Try It Application ..."
                    />
                </Modal.Content>
            );
        };

        if (showApplicationCreationScreen) {
            return renderApplicationCreatingScreen();
        }

        if (showApplicationRedirectionScreen) {
            return renderApplicationRedirectionScreen();
        }

        return  (
            <Fragment>
                <Modal.Content className={ "modal-content" }>        
                    <Grid centered columns={ 1 } className="playground-wizard-grid" >
                        <Grid.Row textAlign="center">
                            <Grid.Column stretched width={ "16" }>
                                <GenericIcon
                                    icon={ InformationIcon }
                                    size="tiny"
                                    className="icon"
                                    transparent
                                    spaced={ "right" }
                                    data-testid={ `${ testId }-image` }
                                />
                            </Grid.Column>  
                        </Grid.Row>
                        <Grid.Row >
                            <Grid.Column stretched width={ "16" }>
                                { isUserAdded 
                                    ? ( <Heading textAlign="center" as="h1">Almost there!</Heading>)
                                    : <Heading textAlign="center" as="h1">Get Set</Heading>
                                }
                            </Grid.Column>  
                        </Grid.Row>
                        <Grid.Row className="row">
                            <Grid.Column stretched textAlign="center" width={ "16" }>
                                { isLoading 
                                    ? (
                                        <ContentLoader/>
                                    )
                                    : (<>
                                        { isUserAdded ? 
                                            ( <>
                                                {
                                                    isLoading ? (
                                                        <ContentLoader/>
                                                    ) :
                                                        addedUserList?.map((user, index) => {
                                                            return (
                                                                <>
                                                                    <List.Item
                                                                        key={ index }
                                                                        className="list-item">
                                                                        <div>
                                                                            <Icon
                                                                                className={ "list-icon" }
                                                                                name={ "check" }
                                                                                color={ "green" }
                                                                            />User <strong>{ user }</strong>
                                                                            { " " }added successfully.
                                                                        </div>
                                                                        <Divider hidden />
                                                                    </List.Item>
                                                                </>
                                                            
                                                            );
                                                        })
                                                }
                                                <Text>Next, we will create the Try It application in your organization.
                                                    You can later change the login flow of this application and
                                                    try different login flows with Asgardeo. Click { " " }
                                                <Text weight="bold" inline> Continue</Text> 
                                                { " " }to proceed. </Text>
                                                <List className="add-user-step-list">
                                                    
                                                </List>
                                            </>
                                            ) : 
                                            (
                                                <>
                                                    <Text>You are about to experience user login with Asgardeo.
                                                        <br />
                                                        Start by { " " }
                                                        <a
                                                            onClick={ () => {
                                                                eventPublisher.
                                                                    publish("application-quick-start-click-add-user");
                                                                setShowWizard(true);
                                                            } }
                                                        >creating a user
                                                        </a>
                                                        { " " } in this organization. If you already have an account, 
                                                        click { " " }<Text weight="bold" inline> Continue</Text>
                                                    </Text>
                                                </>
                                            )
                                        }
                                    </>)
                                }
                            </Grid.Column>  
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <SecondaryButton
                                    data-testid={ `${ testId }-cancel-button` }
                                    floated="left"
                                    onClick={ () => closeWizard() }
                                >
                                    Cancel
                                </SecondaryButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    data-testid={ `${ testId }-next-button` }
                                    floated="right"
                                    onClick={ () => {
                                        isApplicationAlreadyExist(LoginApplicationTemplate.application.name);
                                    } }
                                >
                                    Continue
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Fragment>
        );
    };

    /**
     * Checking if an app is already there called login playground or if not creating one and navigating
     */ 
    const isApplicationAlreadyExist = useCallback(async (data: string) => {

        response = await getApplicationList(null, null, "name eq " + data);
        
        if (response?.applications?.length > 0){
            navigateToAlreadyExistingTryItApp();

            return;
        }
        
        setShowApplicationCreationScreen(true);
        
        const modifiedApplication: MainApplicationInterface = cloneDeep(LoginApplicationTemplate.application);

        modifiedApplication.inboundProtocolConfiguration.oidc.clientId = getTryItClientId(tenantDomain);
        modifiedApplication.inboundProtocolConfiguration.oidc.callbackURLs = [ asgardeoLoginPlaygroundURL ];
        modifiedApplication.inboundProtocolConfiguration.oidc.allowedOrigins = [ asgardeoLoginPlaygroundURL ];
        modifiedApplication.accessUrl = asgardeoLoginPlaygroundURL;

        /**
         * Creating the try it app on demand
         */
        createApplication(modifiedApplication as unknown as MainApplicationInterface)
            .then((response) => {
                if(response.status === 201) {
                    setShowApplicationCreationScreen(false);
                    setShowApplicationRedirectionScreen(true);
                    setTimeout(() => {
                        /**
                         * Navigate to the created playground application
                         */
                        //TODO handle with url builder
                        window.open(asgardeoLoginPlaygroundURL 
                            + "?client_id="+getTryItClientId(tenantDomain)+ "&org=" + tenantDomain);
                        onApplicationCreate();
                        closeWizard();
                    }, INTERMITTENT_REDIRECTION_TIMEOUT);
                    
                    return;
                }
                //TODO handle error
            })
            .catch((error) => {

                if (error.response.status === 403 &&
                    error?.response?.data?.code ===
                    ApplicationManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorCode()) {
                    setOpenLimitReachedModal(true);

                    return;
                } else if (error?.response?.status === 409 && error?.response?.data?.code ===
                    ApplicationManagementConstants.ERROR_CODE_APPLICATION_ALREADY_EXISTS) {
                    navigateToAlreadyExistingTryItApp();

                    return;
                } else {
                    closeWizard();
                    dispatch(addAlert({
                        description: t("extensions:common.quickStart.sections.asgardeoTryIt.errorMessages." +
                            "appCreateGeneric.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:common.quickStart.sections.asgardeoTryIt.errorMessages." +
                            "appCreateGeneric.message")
                    }));

                    return;
                }
            });
    }, []);

    /**
     * This method navigates to a try-it application if there is an already existing one.
     */
    const navigateToAlreadyExistingTryItApp = (): void => {
        setShowApplicationCreationScreen(false);
        setShowApplicationRedirectionScreen(true);

        /**
         * This is used to display the navigation message to the user for some period of time
         */
        setTimeout(() => {
            /**
             * Navigate to the existing applications
             */
            window.open(`${asgardeoLoginPlaygroundURL}?client_id=${getTryItClientId(tenantDomain)}`+
                `&org=${tenantDomain}`);
            closeWizard();
        }, INTERMITTENT_REDIRECTION_TIMEOUT);
    };

    /**
     * Close the wizard.
     */
    const handleWizardClose = (): void => {
        closeWizard();
    };

    /**
     * Close the limit reached modal.
     */
    const handleLimitReachedModalClose = (): void => {
        setOpenLimitReachedModal(false);
        handleWizardClose();
    };

    return (
        <>  
            { openLimitReachedModal && (
                <TierLimitReachErrorModal
                    actionLabel={ t(
                        "console:develop.features.applications.notifications." +
                        "tierLimitReachedError.emptyPlaceholder.action"
                    ) }
                    handleModalClose={ handleLimitReachedModalClose }
                    header={ t(
                        "console:develop.features.applications.notifications.tierLimitReachedError.heading"
                    ) }
                    description={ t(
                        "console:develop.features.applications.notifications." +
                        "tierLimitReachedError.emptyPlaceholder.subtitles"
                    ) }
                    message={ t(
                        "console:develop.features.applications.notifications." +
                        "tierLimitReachedError.emptyPlaceholder.title"
                    ) }
                    openModal={ openLimitReachedModal }
                />
            ) }

            <Modal
                open={ true }
                className="wizard login-playground-wizard"
                dimmer="blurring"
                size="small"
                onClose={ closeWizard }
                closeOnDimmerClick={ false }
                closeOnEscape
            >
                { renderModalContent() }
                {
                    showWizard && (
                        <AddConsumerUserWizard
                            data-testid="user-mgt-add-user-wizard-modal"
                            closeWizard={ () => setShowWizard(false) }
                            onSuccessfulUserAddition={ (id: string) => {
                                eventPublisher.publish("application-finish-adding-user");
                                addNewUser(id);
                            } }
                            emailVerificationEnabled={ false }
                            requiredSteps={ [ "BasicDetails" ] }
                            submitStep={ "BasicDetails" }
                            hiddenFields={ [ "firstName", "lastName" ] }
                            showStepper={ false }
                            requestedPasswordOption="create-password"
                            title="Add User"
                            description="Follow the steps to add a new user"
                        />
                    )
                }
            </Modal>  
        </>  
    );
};
