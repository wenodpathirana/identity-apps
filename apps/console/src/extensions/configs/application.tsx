/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import {
    Code,
    DocumentationLink,
    EmphasizedSegment,
    GenericIcon,
    Heading,
    Popup,
    PrimaryButton,
    ResourceTab,
    Text
} from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { Trans } from "react-i18next";
import { Dispatch } from "redux";
import { Divider, Icon, Message } from "semantic-ui-react";
import { ApplicationGeneralTabOverride } from "./components/application-general-tab-overide";
import { MarketingConsentModalWrapper } from "./components/marketing-consent/components";
import { ApplicationConfig } from "./models";
import {
    ExtendedClaimInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "../../features/applications/components/settings";
import {
    ApplicationInterface,
    ApplicationTabTypes,
    SupportedAuthProtocolTypes,
    additionalSpProperty
} from "../../features/applications/models";
import { ClaimManagementConstants } from "../../features/claims";
import { EventPublisher } from "../../features/core";
import { AppConstants } from "../../features/core/constants";
import { IdentityProviderManagementConstants } from "../../features/identity-providers";
import { getTryItClientId } from "../components/application/utils/try-it-utils";
import { getGettingStartedCardIllustrations } from "../components/getting-started/configs";
import { UsersConstants } from "../components/users/constants";

function isClaimInterface(
    claim: ExtendedClaimInterface | ExtendedExternalClaimInterface
): claim is ExtendedClaimInterface {
    if ((claim as ExtendedExternalClaimInterface).mappedLocalClaimURI == undefined) {
        return true;
    }

    return false;
}

const IS_ENTERPRISELOGIN_MANAGEMENT_APP: string = "isEnterpriseLoginManagementApp";

/**
 * Check whether claims is  identity claims or not.
 *
 * @param claim - claim
 * @returns boolean
 */
const isIdentityClaim = (claim: ExtendedClaimInterface | ExtendedExternalClaimInterface): boolean => {
    const identityRegex: RegExp = new RegExp("wso2.org/claims/identity");

    if (isClaimInterface(claim)) {
        return identityRegex.test(claim.claimURI);
    }

    return identityRegex.test(claim.mappedLocalClaimURI);
};

export const applicationConfig: ApplicationConfig = {
    advancedConfigurations: {
        showEnableAuthorization: false,
        showMyAccount: true,
        showReturnAuthenticatedIdPs: false,
        showSaaS: false
    },
    attributeSettings: {
        advancedAttributeSettings: {
            showIncludeTenantDomain: false,
            showIncludeUserstoreDomainRole: false,
            showIncludeUserstoreDomainSubject: false,
            showRoleAttribute: false,
            showRoleMapping: false,
            showSubjectAttribute: false,
            showUseMappedLocalSubject: false
        },
        attributeSelection: {
            getClaims: (claims: ExtendedClaimInterface[]): ExtendedClaimInterface[] => {
                return claims.filter((claim: ExtendedClaimInterface) => isIdentityClaim(claim) == false);
            },
            getExternalClaims: (claims: ExtendedExternalClaimInterface[]): ExtendedExternalClaimInterface[] => {
                return claims.filter((claim: ExtendedExternalClaimInterface) => isIdentityClaim(claim) == false);
            },
            showAttributePlaceholderTitle: false,
            showShareAttributesHint: (selectedDialect: SelectedDialectInterface): boolean => {
                return selectedDialect.id === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC");
            }
        },
        makeSubjectMandatory: true,
        roleMapping: false
    },
    customApplication: {
        allowedProtocolTypes: [ SupportedAuthProtocolTypes.OAUTH2_OIDC, SupportedAuthProtocolTypes.SAML ],
        defaultTabIndex: 1
    },
    editApplication: {
        extendTabs: true,
        getActions: (clientId: string, tenant: string, testId: string) => {

            const asgardeoLoginPlaygroundURL: string = window[ "AppUtils" ]?.getConfig()?.extensions?.asgardeoTryItURL;

            return (
                clientId === getTryItClientId(tenant)
                    ? (
                        <PrimaryButton
                            data-tourid="button"
                            onClick={ (): void => {
                                EventPublisher.getInstance().publish("tryit-try-login", {
                                    "client-id": clientId
                                });
                                window.open(asgardeoLoginPlaygroundURL+"?client_id="+clientId+"&org="+tenant);
                            } }
                            data-testid={ `${ testId }-playground-button` }
                        >
                            Try Login
                            <Icon name="arrow right"/>
                        </PrimaryButton>
                    ): null
            );
        },
        getOveriddenTab: (clientId: string, tabName: ApplicationTabTypes,
            defaultComponent: ReactElement, appName: string, appId: string, tenantDomain: string) => {
            if (clientId === getTryItClientId(tenantDomain) && tabName === ApplicationTabTypes.GENERAL) {
                return (
                    <ApplicationGeneralTabOverride
                        appId={ appId }
                        appName={ appName }
                        clientId={ clientId }
                    ></ApplicationGeneralTabOverride>
                );
            }

            if (clientId === getTryItClientId(tenantDomain) && tabName === ApplicationTabTypes.USER_ATTRIBUTES){
                return (
                    <ResourceTab.Pane controlledSegmentation>
                        <EmphasizedSegment padded="very">
                            <div className="form-container with-max-width">
                                <Heading ellipsis as="h4">User Attributes</Heading>
                                <Heading as="h6" color="grey" compact>
                                User attributes that are allowed to be shared with this application.
                                </Heading>
                                <Divider hidden />
                                <div className="authenticator-dynamic-properties">
                                    <div className="authenticator-dynamic-property">
                                        <div className="authenticator-dynamic-property-name-container">
                                            <GenericIcon
                                                square
                                                inline
                                                transparent
                                                icon={ <Icon name="mail"/> }
                                                size="micro"
                                                className="scope-icon"
                                                spaced="right"
                                                verticalAlign="top"
                                            />
                                            <div>
                                            Email
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="authenticator-dynamic-properties">
                                    <div className="authenticator-dynamic-property">
                                        <div className="authenticator-dynamic-property-name-container">
                                            <GenericIcon
                                                square
                                                inline
                                                transparent
                                                icon={ <Icon name="user"/> }
                                                size="micro"
                                                className="scope-icon"
                                                spaced="right"
                                                verticalAlign="top"
                                            />
                                            <div>
                                            First Name
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="authenticator-dynamic-properties">
                                    <div className="authenticator-dynamic-property">
                                        <div className="authenticator-dynamic-property-name-container">
                                            <GenericIcon
                                                square
                                                inline
                                                transparent
                                                icon={ <Icon name="user"/> }
                                                size="micro"
                                                className="scope-icon"
                                                spaced="right"
                                                verticalAlign="top"
                                            />
                                            <div>
                                            Last Name
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Message visible>
                                    <Text>
                                        These attributes are pre-configured for the
                                        { " " }<Text inline weight="bold"> Asgardeo Try It</Text> application.
                                    You can configure more attributes when you integrate your applications to Asgardeo.
                                        <DocumentationLink
                                            link={ "develop.applications"+
                                            ".editApplication.oidcApplication.attributes.learnMore" }
                                            isLinkRef={ true }
                                        >
                                            <Trans
                                                i18nKey={ "extensions:common.learnMore" }
                                            >
                                                Learn More
                                            </Trans>
                                        </DocumentationLink>
                                    </Text>
                                </Message>
                                <Divider hidden />
                            </div>
                        </EmphasizedSegment>
                    </ResourceTab.Pane>
                );
            }

            return defaultComponent;
        },
        getOverriddenDescription: (clientId: string, tenantDomain: string, _templateName: string) => {
            if (clientId === getTryItClientId(tenantDomain)){
                return (
                    <div className="ellipsis">
                        <Popup
                            content={ (
                                <Trans
                                    i18nKey=
                                        { "extensions:develop.applications.asgardeoTryit.description" }
                                >
                                    You can try out different login flows of Asgardeo with our Try It app.
                                </Trans>
                            ) }
                            trigger={ (
                                <span>
                                    <Trans
                                        i18nKey=
                                            { "extensions:develop.applications.asgardeoTryit.description" }
                                    >
                                        You can try out different login flows of Asgardeo with our Try It app.
                                    </Trans>
                                </span>
                            ) }
                        />
                    </div>
                );
            }

            return null;
        },
        getOverriddenImage: (clientId: string, tenantDomain: string) => {
            if(clientId === getTryItClientId(tenantDomain)) {
                return (
                    <GenericIcon
                        floated="left"
                        size="tiny"
                        transparent
                        icon={ getGettingStartedCardIllustrations().tryItApplication }
                    />
                );
            }

            return null;
        },
        getStrongAuthenticationFlowTabIndex: (
            clientId: string,
            tenantDomain: string,
            templateId: string,
            customApplicationTemplateId: string
        ): number => {
            if (clientId === getTryItClientId(tenantDomain)) {
                return 2; // For Asgardeo Try It App
            } else if (templateId === customApplicationTemplateId) {
                return 3; // For other apps built on Custom Application Templates
            } else {
                return 4; // Anything else
            }
        },
        getTabPanelReadOnlyStatus: (tabPanelName: string, application: ApplicationInterface): boolean => {
            // Restrict modifying configurations for Enterprise IDP Login Applications.
            let isEnterpriseLoginMgt: string;

            if (application?.advancedConfigurations?.additionalSpProperties?.length > 0) {
                application?.advancedConfigurations?.additionalSpProperties?.
                    forEach((item: additionalSpProperty) => {
                        if (item.name === IS_ENTERPRISELOGIN_MANAGEMENT_APP && item.value === "true") {
                            isEnterpriseLoginMgt = "true";
                        }
                    });
            }
            if (application.name.startsWith("WSO2_LOGIN_FOR_") || isEnterpriseLoginMgt==="true") {
                return [
                    "APPLICATION_EDIT_GENERAL_SETTINGS",
                    "APPLICATION_EDIT_ACCESS_CONFIG",
                    "APPLICATION_EDIT_PROVISIONING_SETTINGS"
                ].includes(tabPanelName);
            }

            return false;
        },
        isTabEnabledForApp: (clientId: string, tabType: ApplicationTabTypes, tenantDomain: string): boolean => {
            if(clientId === getTryItClientId(tenantDomain)) {
                if(tabType === ApplicationTabTypes.PROVISIONING
                    || tabType === ApplicationTabTypes.INFO
                    || tabType === ApplicationTabTypes.PROTOCOL){
                    return false;
                }
            }

            return true;
        },
        renderHelpPanelItems: () => {
            return (
                <>
                    <Divider hidden />
                    <Heading ellipsis as="h5">
                        <strong>
                            Add User
                        </strong>
                    </Heading>
                    <div>
                        <p>
                            You will need a user account to log in to the applications.
                        </p>
                        <p>
                            { " " }
                            Do not have a user account?{ " " }<a
                                onClick={ () => {
                                    window.open(AppConstants.getClientOrigin()
                                    + UsersConstants.getPaths().get("USERS_PATH"),
                                    "",
                                    "noopener");
                                } }
                                className="external-link link pointing primary"
                            >Create Account <Icon name="external"/></a>
                        </p>
                    </div>
                </>
            );
        },
        showApplicationShare: true,
        showDangerZone: (application: ApplicationInterface): boolean => {
            // Hide danger zone for Enterprise IDP Login Applications.
            let isEnterpriseLoginMgt: string;

            if (application?.advancedConfigurations?.additionalSpProperties?.length > 0) {
                application?.advancedConfigurations?.additionalSpProperties?.
                    forEach((item: additionalSpProperty) => {
                        if (item.name === IS_ENTERPRISELOGIN_MANAGEMENT_APP && item.value === "true") {
                            isEnterpriseLoginMgt = "true";
                        }
                    });
            }

            return !(application.name.startsWith("WSO2_LOGIN_FOR_") || isEnterpriseLoginMgt === "true");
        },
        showDeleteButton: (application: ApplicationInterface): boolean => {
            // Hide delete button for Enterprise IDP Login Applications.
            let isEnterpriseLoginMgt: string;

            if (application?.advancedConfigurations?.additionalSpProperties?.length > 0) {
                application?.advancedConfigurations?.additionalSpProperties?.
                    forEach((item: additionalSpProperty) => {
                        if (item.name === IS_ENTERPRISELOGIN_MANAGEMENT_APP && item.value === "true") {
                            isEnterpriseLoginMgt = "true";
                        }
                    });
            }

            return !(application.name.startsWith("WSO2_LOGIN_FOR_") || isEnterpriseLoginMgt === "true");
        },
        showProvisioningSettings: false
    },
    excludeIdentityClaims: true,
    excludeSubjectClaim: true,
    generalSettings: {
        getFieldReadOnlyStatus: (application: ApplicationInterface, fieldName: string): boolean => {
            let isEnterpriseLoginMgt: string;

            if (application?.advancedConfigurations?.additionalSpProperties?.length > 0) {
                application?.advancedConfigurations?.additionalSpProperties?.
                    forEach((item: additionalSpProperty) => {
                        if (item.name === IS_ENTERPRISELOGIN_MANAGEMENT_APP && item.value === "true") {
                            isEnterpriseLoginMgt = "true";
                        }
                    });
            }

            // Allow access url edit even for Enterprise login given `General section is read-only.
            if (application.name.startsWith("WSO2_LOGIN_FOR_") || isEnterpriseLoginMgt==="true") {

                if (fieldName == "ACCESS_URL") {
                    return false;
                }
            }

            return true;
        }
    },
    inboundOIDCForm: {
        disabledGrantTypes: {
            "custom-application": [ "urn:ietf:params:oauth:grant-type:device_code" ]
        },
        shouldValidateCertificate: true,
        showBackChannelLogout: false,
        showCertificates: true,
        showClientSecretMessage: false,
        showFrontChannelLogout: false,
        showIdTokenEncryption: true,
        showNativeClientSecretMessage: false,
        showRequestObjectSignatureValidation: false,
        showReturnAuthenticatedIdPList: false,
        showScopeValidators: false
    },
    inboundSAMLForm: {
        artifactBindingAllowed:false,
        showApplicationQualifier: false,
        showAttributeConsumingServiceIndex: false,
        showQueryRequestProfile: false
    },
    marketingConsent: {
        getBannerComponent: (): ReactElement =>
            !window[ "AppUtils" ].getConfig().organizationName && <MarketingConsentModalWrapper />
    },
    signInMethod: {
        authenticatorSelection: {
            customAuthenticatorAdditionValidation: (
                authenticatorID: string,
                stepIndex: number,
                dispatch: Dispatch
            ): boolean => {
                // Prevent FIDO2 from being added as a second factor
                if (
                    [
                        IdentityProviderManagementConstants.FIDO_AUTHENTICATOR,
                        IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID
                    ].includes(authenticatorID)
                    && stepIndex > 0
                ) {
                    dispatch(
                        addAlert({
                            description: I18n.instance.t(
                                "console:develop.features.applications.notifications." +
                                "firstFactorAuthenticatorToSecondStep.genericError.description"
                            ),
                            level: AlertLevels.WARNING,
                            message: I18n.instance.t(
                                "console:develop.features.applications.notifications." +
                                "firstFactorAuthenticatorToSecondStep.genericError.message"
                            )
                        })
                    );

                    return false;
                }

                return true;
            },
            messages: {
                secondFactorDisabled: (
                    <Trans
                        i18nKey={
                            "extensions:develop.applications.edit.sections.signInMethod.sections." +
                            "authenticationFlow.sections.stepBased.secondFactorDisabled"
                        }
                    >
                        Second factor authenticators can only be used if <Code>Username & Password
                        </Code>, <Code>Social Login</Code> or <Code>Security Key/Biometrics</Code>
                        is present in a previous step.
                    </Trans>
                ),
                secondFactorDisabledInFirstStep: null
            }
        }
    },
    templates:{
        custom: true,
        mobile: true,
        oidc: true,
        saml: false,
        spa: true,
        windows: false
    }
};
