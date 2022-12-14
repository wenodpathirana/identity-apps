/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/src/models";
import React, { FunctionComponent, ReactElement, SVGProps, lazy } from "react";
import { IdentityProviderConfig } from "./models";
import { IdentityProviderManagementConstants } from "../../features/identity-providers/constants";
import {
    AuthenticatorLabels,
    GenericIdentityProviderCreateWizardPropsInterface,
    IdentityProviderTabTypes
} from "../../features/identity-providers/models";
import { getIdPIcons } from "../components/identity-providers/configs/ui";
import { SIWEAuthenticatorForm } from "../identity-provider-templates/templates/swe/swe-authenticator-form";
import SIWEIdPTemplate from "../identity-provider-templates/templates/swe/swe.json";
import { SIWEAuthenticationProviderCreateWizard } from "../identity-provider-templates/templates/swe/wizards";

export const identityProviderConfig: IdentityProviderConfig = {
    authenticatorResponseExtension: [],
    // TODO: Refactor authenticators out of IdentityProviderConfigs to AuthenticatorConfig
    authenticators: {
        [ IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("../components/authenticators/email-otp/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: false
        },
        [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("../components/authenticators/sms-otp/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: false
        },
        [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("../components/authenticators/totp/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: true
        },
        [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("../components/authenticators/fido/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: true
        },
        [ IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("../components/authenticators/magic-link/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: true
        }
    },
    createIdentityProvider: {
        getOverriddenCreateWizard: (
            templateId: string,
            props: GenericIdentityProviderCreateWizardPropsInterface & IdentifiableComponentInterface
        ): ReactElement => {

            const {
                "data-componentid": componentId,
                title,
                subTitle,
                onWizardClose,
                template,
                ...rest
            } = props;

            if (templateId === SIWEIdPTemplate.templateId) {
                return (
                    <SIWEAuthenticationProviderCreateWizard
                        title={ title }
                        subTitle={ subTitle }
                        onWizardClose={ onWizardClose }
                        template={ template }
                        data-componentid={ componentId }
                        { ...rest }
                    />
                );
            }

            return null;
        }
    },
    editIdentityProvider: {
        attributesSettings: true,
        getCertificateOptionsForTemplate: (templateId: string): { JWKS: boolean; PEM: boolean } | undefined => {
            if (templateId === SIWEIdPTemplate.templateId) {
                return {
                    JWKS: false,
                    PEM: false
                };
            }

            return undefined;
        },
        getOverriddenAuthenticatorForm: (
            type: string,
            templateId: string,
            props: Record<string, any>
        ): ReactElement | null => {

            const {
                "data-componentid": componentId,
                enableSubmitButton,
                initialValues,
                isSubmitting,
                metadata,
                onSubmit,
                readOnly,
                showCustomProperties,
                triggerSubmit,
                ...rest
            } = props;

            if (templateId === SIWEIdPTemplate.templateId) {
                return (
                    <SIWEAuthenticatorForm
                        data-componentid={ componentId }
                        enableSubmitButton={ enableSubmitButton }
                        initialValues={ initialValues }
                        isSubmitting={ isSubmitting }
                        metadata={ metadata }
                        onSubmit={ onSubmit }
                        readOnly={ readOnly }
                        showCustomProperties={ showCustomProperties }
                        triggerSubmit={ triggerSubmit }
                        { ...rest }
                    />
                );
            }

            return null;
        },
        isTabEnabledForIdP: (templateType: string, tabType: IdentityProviderTabTypes): boolean | undefined => {

            const templateMapping = new Map<string, Set<string>>([
                [
                    IdentityProviderTabTypes.USER_ATTRIBUTES, new Set([
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.FACEBOOK,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GITHUB,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.OIDC,
                        IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.MICROSOFT,
                        SIWEIdPTemplate.templateId
                    ])
                ]
            ]);

            if (templateMapping.get(tabType)?.has(templateType)) {
                return false;
            }

            return undefined;
        },
        showAdvancedSettings: false,
        showJitProvisioning: true,
        showOutboundProvisioning: false
    },
    fidoTags: [
        AuthenticatorLabels.PASSWORDLESS
    ],
    filterFidoTags: (tags: string[]): string[] => {
        return tags.filter(tag => tag === AuthenticatorLabels.PASSWORDLESS);
    },
    generalDetailsForm: {
        showCertificate: true
    },
    getIconExtensions: (): Record<string, string | FunctionComponent<SVGProps<SVGSVGElement>>>  => {
        return {
            ...getIdPIcons()
        };
    },
    jitProvisioningSettings: {
        enableAssociateLocalUserField: {
            show: !!window[ "AppUtils" ].getConfig().organizationName
        },
        enableJitProvisioningField: {
            show: true
        },
        menuItemName: "Advanced",
        provisioningSchemeField: {
            show: false
        },
        userstoreDomainField: {
            show: false
        }
    },
    templates: {
        enterprise: true,
        expertMode: false,
        facebook: true,
        github: true,
        google: true,
        microsoft: true,
        oidc: true,
        organizationEnterprise: true,
        saml: true
    },
    // Handles backward compatibility with the legacy IDP view & new connections view.
    // TODO: Remove this usage once https://github.com/wso2/product-is/issues/12052 is addressed.
    useNewConnectionsView: true,
    utils: {
        hideIdentityClaimAttributes(authenticatorId: string): boolean {
            const identityClaimsHiddenAuthenticators = new Set([
                IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID
            ]);

            return identityClaimsHiddenAuthenticators.has(authenticatorId);
        },
        hideLogoInputFieldInIdPGeneralSettingsForm(): boolean {
            return true;
        },
        isAuthenticatorAllowed: (name: string): boolean => {
            return [
                IdentityProviderManagementConstants.BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.OAUTH_REQUEST_PATH_AUTHENTICATOR,
                IdentityProviderManagementConstants.X509_AUTHENTICATOR,
                IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR
            ].includes(name);
        },
        isProvisioningAttributesEnabled(authenticatorId: string): boolean {
            const excludedAuthenticators = new Set([
                IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID
            ]);
            /**
             * If the authenticatorId is not in the excluded set we
             * can say the provisioning attributes is enabled for authenticator.
             */

            return !excludedAuthenticators.has(authenticatorId);
        },

        /**
         * Enable or disable role mappings form elements from the UI.
         * @param authenticatorId - authenticator ID value
         * @returns enabled or not
         */
        isRoleMappingsEnabled(authenticatorId: string): boolean {
            return IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID !== authenticatorId;
        }
        /**
         * This method will either show or hide logo edit field. Provide true
         * to render the form input field for it.
         *
         * @see IdentityProviderConfig
         * - @param authenticatorId - authenticator ID value
         */
    }
};
