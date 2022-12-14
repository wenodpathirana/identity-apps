/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ReactElement, ReactNode } from "react";
import { Dispatch } from "redux";
import {
    ExtendedClaimInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "../../../features/applications/components/settings";
import { ApplicationInterface, ApplicationTabTypes } from "../../../features/applications/models";

export interface ApplicationConfig {
    advancedConfigurations: {
        showEnableAuthorization: boolean;
        showMyAccount: boolean;
        showSaaS: boolean;
        showReturnAuthenticatedIdPs: boolean;
    };
    generalSettings: {
        getFieldReadOnlyStatus: (application: ApplicationInterface, fieldName: string) => boolean;
    };
    attributeSettings: {
        advancedAttributeSettings: {
            showIncludeTenantDomain: boolean;
            showIncludeUserstoreDomainRole: boolean;
            showIncludeUserstoreDomainSubject: boolean;
            showRoleAttribute: boolean;
            showRoleMapping: boolean;
            showUseMappedLocalSubject: boolean;
            showSubjectAttribute: boolean;
        };
        attributeSelection: {
            getClaims: (claims: ExtendedClaimInterface[]) => ExtendedClaimInterface[];
            getExternalClaims: (claims: ExtendedExternalClaimInterface[]) => ExtendedExternalClaimInterface[];
            showAttributePlaceholderTitle: boolean;
            showShareAttributesHint: (selectedDialect: SelectedDialectInterface) => boolean;
        };
        makeSubjectMandatory: boolean;
        roleMapping: boolean;
    };
    editApplication: {
        extendTabs: boolean; //should be true for cloud
        showProvisioningSettings: boolean;
        renderHelpPanelItems: () => ReactNode;
        showDangerZone: (application: ApplicationInterface) => boolean;
        showDeleteButton: (application: ApplicationInterface) => boolean;
        getTabPanelReadOnlyStatus: (tabPanelName: string, application: ApplicationInterface) => boolean;
        isTabEnabledForApp: (clientId: string, tabType: ApplicationTabTypes, tenantDomain: string) => boolean;
        getActions: (
            clientId: string,
            tenant: string,
            testId: string
        ) => ReactElement;
        getOverriddenDescription: (
            clientId: string,
            tenantDomain: string,
            templateName: string
        ) => ReactElement,
        getOverriddenImage: (clientId: string, tenantDomain: string) => ReactElement;
        getOveriddenTab: (
            clientId: string,
            tabName: any,
            defaultComponent: ReactElement,
            appName: string,
            appId: string,
            tenantDomain: string
        ) => ReactNode;
        showApplicationShare: boolean;
        getStrongAuthenticationFlowTabIndex: (
            clientId: string,
            tenantDomain: string,
            templateId: string,
            customApplicationTemplateId: string
        ) => number
    };
    inboundOIDCForm: {
        shouldValidateCertificate: boolean;
        showClientSecretMessage: boolean;
        showFrontChannelLogout: boolean;
        showScopeValidators: boolean;
        showNativeClientSecretMessage: boolean;
        showIdTokenEncryption: boolean;
        showBackChannelLogout: boolean;
        showRequestObjectSignatureValidation: boolean;
        showCertificates: boolean;
        showReturnAuthenticatedIdPList: boolean;
        disabledGrantTypes: {
            "custom-application": string[]
        };
    };
    inboundSAMLForm: {
        showApplicationQualifier: boolean;
        showAttributeConsumingServiceIndex: boolean;
        showQueryRequestProfile: boolean;
        artifactBindingAllowed: boolean;
    };
    marketingConsent: {
        getBannerComponent: () => ReactElement
    };
    signInMethod: {
        authenticatorSelection: {
            customAuthenticatorAdditionValidation(
                authenticatorID: string,
                stepIndex: number,
                dispatch: Dispatch
            ): boolean;
            messages: {
                secondFactorDisabled: ReactNode;
                secondFactorDisabledInFirstStep: ReactNode;
            };
        };
    };
    templates: {
        oidc: boolean;
        saml: boolean;
        spa: boolean;
        windows: boolean;
        custom: boolean;
        mobile: boolean;
    };
    customApplication: {
        allowedProtocolTypes: string[];
        defaultTabIndex: number;
    };
    excludeIdentityClaims: boolean;
    excludeSubjectClaim: boolean;
}
