/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FormAttributes, Notification, NotificationItem } from "@wso2is/i18n";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Extensions {
    common: {
        community: string;
        help: {
            communityLink: string;
            docSiteLink: string;
            helpCenterLink: string;
            helpDropdownLink: string;
        };
        learnMore: string;
        quickStart: {
            greeting: {
                alternativeHeading: string;
                heading: string;
                subHeading: string;
            };
            sections: {
                addSocialLogin: {
                    actions: {
                        setup: string;
                        view: string;
                    };
                    description: string;
                    heading: string;
                };
                integrateApps: {
                    actions: {
                        create: string;
                        manage: string;
                        view: string;
                    };
                    capabilities: {
                        sso: string;
                        mfa: string;
                        social: string;
                    };
                    description: string;
                    heading: string;
                };
                learn: {
                    actions: {
                        view: string;
                    };
                    description: string;
                    heading: string;
                };
                manageUsers: {
                    actions: {
                        create: string;
                        manage: string;
                        view: string;
                    };
                    capabilities: {
                        collaborators: string;
                        customers: string;
                        groups: string;
                    };
                    description: string;
                    heading: string;
                };
                asgardeoTryIt: {
                    errorMessages: {
                        appCreateGeneric: {
                            message: string;
                            description: string;
                        };
                    }
                }
            };
        };
    };
    console: {
        application: {
            quickStart: {
                technologySelectionWrapper: {
                    subHeading: string;
                };
                addUserOption: {
                    description: string;
                    hint: string;
                    message: string;
                };
            };
        };
        marketingConsent: {
            heading: string;
            description: string;
            actions: {
                subscribe: string;
                decline: string;
            },
            notifications: {
                errors: {
                    fetch: {
                        message: string;
                        description: string;
                    };
                    update: {
                        message: string;
                        description: string;
                    };
                };
            };
        };
    };
    develop: {
        applications: {
            asgardeoTryIt: {
                description: string;
            },
            edit: {
                sections: {
                    signInMethod: {
                        sections: {
                            authenticationFlow: {
                                sections: {
                                    stepBased: {
                                        secondFactorDisabled: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            quickstart: {
                spa: {
                    common: {
                        addTestUser: {
                            title: string;
                        };
                        prerequisites: {
                            angular: string;
                            node: string;
                        };
                    };
                    integrate: {
                        common: {
                            sdkConfigs: {
                                clientId: {
                                    hint: string;
                                };
                                scope: {
                                    hint: string;
                                };
                                serverOrigin: {
                                    hint: string;
                                };
                                signInRedirectURL: {
                                    hint: {
                                        content: string;
                                        multipleWarning: string;
                                    };
                                };
                                signOutRedirectURL: {
                                    hint: {
                                        content: string;
                                        multipleWarning: string;
                                    };
                                };
                            };
                        };
                    };
                    samples: {
                        exploreMoreSamples: string;
                    };
                };
                twa: {
                    setup: {
                        skipURIs: string;
                    };
                };
            };
        };
        branding: {
            confirmations: {
                revertBranding: {
                    assertionHint: string;
                    content: string;
                    header: string;
                    message: string;
                };
                featureToggle: {
                    assertionHint: string;
                    enableContent: string;
                    disableContent: string;
                    header: string;
                    enableMessage: string;
                    disableMessage: string;
                }
            };
            dangerZoneGroup: {
                header: string;
                revertBranding: {
                    actionTitle: string;
                    header: string;
                    subheader: string;
                };
            };
            forms: {
                advance: {
                    links: {
                        fields: {
                            cookiePolicyURL: {
                                hint: string;
                                label: string;
                                placeholder: string;
                            };
                            privacyPolicyURL: {
                                hint: string;
                                label: string;
                                placeholder: string;
                            };
                            termsOfUseURL: {
                                hint: string;
                                label: string;
                                placeholder: string;
                            };
                        };
                        heading: string;
                    };
                };
                design: {
                    layout: {
                        headings: {
                            fields: {
                                productTagline: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                        },
                        images: {
                            logo: {
                                heading: string;
                                fields: {
                                    alt: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    url: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                preview: string;
                            };
                        },
                        variations: {
                            fields: {
                                centered: {
                                    imgAlt: string;
                                    label: string;
                                };
                                "custom": {
                                    imgAlt: string;
                                    label: string;
                                };
                                "left-aligned": {
                                    imgAlt: string;
                                    label: string;
                                };
                                "left-image": {
                                    imgAlt: string;
                                    label: string;
                                };
                                "right-aligned": {
                                    imgAlt: string;
                                    label: string;
                                };
                                "right-image": {
                                    imgAlt: string;
                                    label: string;
                                };
                            };
                        };
                    },
                    theme: {
                        buttons: {
                            externalConnections: {
                                fields: {
                                    backgroundColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    borderRadius: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    fontColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                            heading: string;
                            primary: {
                                fields: {
                                    borderRadius: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    fontColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                            secondary: {
                                fields: {
                                    borderRadius: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    fontColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                        };
                        colors: {
                            fields: {
                                primaryColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                secondaryColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                        };
                        font: {
                            fields: {
                                fontFamilyDropdown: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                fontFamilyInput: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                importURL: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                            types: {
                                fromCDN: string;
                                fromDefaults: string;
                            };
                        };
                        footer: {
                            fields: {
                                borderColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                fontColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                        },
                        headings: {
                            fields: {
                                fontColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                        },
                        images: {
                            favicon: {
                                fields: {
                                    url: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                                preview: string;
                            };
                            heading: string;
                            logo: {
                                heading: string;
                                fields: {
                                    alt: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    url: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                preview: string;
                            };
                        };
                        inputs: {
                            fields: {
                                backgroundColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                borderColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                borderRadius: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                fontColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                            labels: {
                                fields: {
                                    fontColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                        };
                        loginBox: {
                            fields: {
                                backgroundColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                borderColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                borderRadius: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                borderWidth: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                fontColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                        };
                        page: {
                            fields: {
                                backgroundColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                fontColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                        };
                        variations: {
                            fields: {
                                dark: {
                                    label: string;
                                };
                                light: {
                                    label: string;
                                };
                            };
                        };
                    };
                };
                general: {
                    fields: {
                        copyrightText: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        siteTitle: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        supportEmail: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                    };
                };
            };
            notifications: {
                delete: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                    invalidStatus: {
                        description: string;
                        message: string;
                    };
                    notConfigured: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
                fetch: {
                    customLayoutNotFound: {
                        description: string;
                        message: string;
                    };
                    genericError: {
                        description: string;
                        message: string;
                    };
                    invalidStatus: {
                        description: string;
                        message: string;
                    };
                    tenantMismatch: {
                        description: string;
                        message: string;
                    };
                };
                update: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                    invalidStatus: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                    tenantMismatch: {
                        description: string;
                        message: string;
                    };
                };
            };
            pageHeader: {
                description: string;
                title: string;
            };
            publishToggle: {
                hint: string;
                label: string;
                enabled: string;
                disabled: string;
            };
            tabs: {
                advance: {
                    label: string;
                };
                design: {
                    label: string;
                    sections: {
                        imagePreferences: {
                            description: string;
                            heading: string;
                        };
                        layoutVariation: {
                            description: string;
                            heading: string;
                            status: string;
                        };
                        themePreferences: {
                            description: string;
                            heading: string;
                        };
                        themeVariation: {
                            description: string;
                            heading: string;
                        };
                    };
                };
                general: {
                    customRequest: {
                        description: string;
                        heading: string;
                    };
                    label: string;
                };
                preview: {
                    disclaimer: string;
                    errors: {
                        layout: {
                            notFound: {
                                subTitle: string;
                                title: string;
                            };
                            notFoundWithSupport: {
                                subTitle: string;
                                title: string;
                            };
                        };
                    };
                    label: string;
                };
            };
        };
        identityProviders: {
            emailOTP: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectEmailOTP: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            smsOTP: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectSMSOTP: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            facebook: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            github: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            google: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            microsoft: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            siwe: {
                forms: {
                    authenticatorSettings: {
                        callbackUrl: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                required: string;
                            };
                        };
                        clientId: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                required: string;
                            };
                        };
                        clientSecret: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                required: string;
                            };
                        };
                        scopes: {
                            heading: string;
                            hint: string;
                            list: {
                                openid: {
                                    description: string;
                                };
                                profile: {
                                    description: string;
                                };
                            };
                        };
                    };
                };
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                    subHeading: string;
                };
                wizardHelp: {
                    clientId: {
                        description: string;
                        heading: string;
                    };
                    clientSecret: {
                        description: string;
                        heading: string;
                    };
                    heading: string;
                    name: {
                        connectionDescription: string;
                        heading: string;
                        idpDescription: string;
                    };
                    preRequisites: {
                        clientRegistrationDocs: string;
                        configureClient: string;
                        configureRedirectURI: string;
                        getCredentials: string;
                        heading: string;
                    };
                    subHeading: string;
                };
            };
            totp: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    heading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectTOTP: {
                            content: string;
                            heading: string;
                        };
                    };
                    subHeading: string;
                };
            };
            fido: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    heading: string;
                    passkeys: {
                        docLinkText: string;
                        heading: string;
                        content: string;
                    };
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectFIDO: {
                            content: string;
                            heading: string;
                        };
                    };
                    subHeading: string;
                };
            };
            magicLink: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    heading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectMagicLink: {
                            content: string;
                            heading: string;
                        };
                    };
                    subHeading: string;
                };
            };
        };
        monitor: {
            filter: {
                advancedSearch: {
                    attributes: {
                        placeholder: string;
                    };
                    fields: {
                        value: {
                            placeholder: string;
                        };
                    };
                    buttons: {
                        submit: {
                            label: string;
                        };
                    };
                    title: string;
                };
                dropdowns: {
                    timeRange: {
                        custom: {
                            labels: {
                                from: string;
                                timeZone: string;
                                to: string;
                            };
                        };
                        texts: {
                            0: string,
                            1: string,
                            2: string,
                            3: string,
                            4: string,
                            5: string,
                            6: string,
                            7: string,
                            8: string,
                            9: string
                        };
                    };
                    timeZone: {
                        placeholder: string;
                    };
                };
                topToolbar: {
                    buttons: {
                        addFilter: {
                            label: string;
                        };
                        clearFilters: {
                            label: string;
                        };
                    };
                };
                searchBar: {
                    placeholder: string;
                };
                refreshButton: {
                    text: string;
                    linkText: string;
                };
            };
            logView: {
                toolTips: {
                    seeMore: string;
                };
            };
            notifications: {
                genericError: {
                    subtitle: {
                        0: string;
                        1: string;
                    };
                    title: string;
                };
                emptyFilterResult: {
                    actionLabel: string;
                    subtitle: {
                        0: string;
                        1: string;
                    };
                    title: string;
                };
                emptySearchResult: {
                    actionLabel: string;
                    subtitle: {
                        0: string;
                        1: string;
                    };
                    title: string;
                };
                emptyResponse: {
                    subtitle: {
                        0: string;
                        1: string;
                    };
                    title: string;
                };
            };
            pageHeader: {
                description: string;
                title: string;
            };
            tooltips: {
                copy: string;
            };
        };
        sidePanel: {
            branding: string;
            monitor: string;
            categories: {
                branding: string;
                monitor: string;
            };
        };
    };
    manage: {
        attributes: {
            attributes: {
                description: string;
            };
            generatedAttributeMapping: {
                title: string;
                description: string;
                OIDCProtocol: string;
                SCIMProtocol: string;
            };
            displayNameHint: string;
        };
        features: {
            header:{
                links:{
                    billingPortalNav: string;
                },
            },
            tenant: {
                header: {
                    tenantSwitchHeader: string;
                    tenantAddHeader: string;
                    tenantDefaultButton: string;
                    tenantMakeDefaultButton: string;
                    backButton: string;
                    tenantSearch: {
                        placeholder: string;
                        emptyResultMessage: string;
                    };
                };
                wizards: {
                    addTenant: {
                        heading: string;
                        forms: {
                            fields: {
                                tenantName: {
                                    label: string;
                                    placeholder: string;
                                    validations: {
                                        empty: string;
                                        duplicate: string;
                                        invalid: string;
                                        invalidLength: string;
                                    };
                                };
                            };
                            loaderMessages: {
                                duplicateCheck: string;
                                tenantCreate: string;
                                tenantSwitch: string;
                            };
                            messages: {
                                info: string;
                            };
                        };
                        tooltips: {
                            message: string;
                        };
                    };
                };
                tenantCreationPrompt: {
                    heading: string;
                    subHeading1: string;
                    subHeading2: string;
                };
                notifications: {
                    addTenant: {
                        error: NotificationItem;
                        genericError: NotificationItem;
                        limitReachError: NotificationItem;
                        success: NotificationItem;
                    };
                    defaultTenant: Notification;
                    missingClaims: NotificationItem;
                    getTenants: NotificationItem;
                };
            };
            userStores: {
                configs: {
                    addUserStores: {
                        actionTitle: string;
                        subTitle: string;
                        title: string;
                    }
                };
                create: {
                    pageLayout: {
                        actions: {
                            connectUserStore: string;
                        };
                        description: string;
                        title: string;
                        steps: {
                            attributeMappings: {
                                subTitle: string;
                                title: string;
                            };
                            generalSettings: {
                                form: {
                                    fields: {
                                        description: {
                                            label: string;
                                            placeholder: string;
                                        };
                                        name: {
                                            hint: string;
                                            label: string;
                                            placeholder: string;
                                        };
                                        userStoreType: {
                                            label: string;
                                            message: string;
                                        };
                                    };
                                };
                                title: string;
                            };
                        };
                    };
                };
                delete: {
                    assertionHint: string;
                };
                edit: {
                    attributeMappings: {
                        title: string;
                        description: string;
                        disable: {
                            buttonDisableHint: string;
                        };
                        subTitle: string;
                        sections: {
                            custom: string;
                            local: string;
                        };
                        validations: {
                            empty: string;
                        };
                    };
                    general: {
                        connectionsSections: {
                            title: string;
                            agents: {
                                agentOne: {
                                    description: string;
                                };
                                agentTwo: {
                                    description: string;
                                };
                                buttons: {
                                    disconnect: string;
                                    generate: string;
                                    regenerate: string;
                                };
                            };
                        };
                        disable: {
                            buttonDisableHint: string;
                        };
                        form: {
                            fields: {
                                description: {
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            validations: {
                                allSymbolsErrorMessage: string;
                                invalidSymbolsErrorMessage: string;
                                restrictedNamesErrorMessage: string;
                            };
                        };
                        userStoreType: {
                            info: string;
                        }
                    };
                    setupGuide: {
                        title: string;
                        subTitle: string;
                        steps: {
                            configureProperties: {
                                content: {
                                    message: string;
                                };
                                description: string;
                                title: string;
                            };
                            downloadAgent: {
                                content: {
                                    buttons: {
                                        download: string;
                                    };
                                };
                                description: string;
                                title: string;
                            };
                            generateToken: {
                                content: {
                                    buttons: {
                                        generate: string;
                                    };
                                };
                                description: string;
                                title: string;
                            };
                            runAgent: {
                                description: string;
                                title: string;
                            };
                            tryAgain: {
                                info: string;
                            }
                        };
                    };
                };
                list: {
                    title: string;
                    subTitle: string;
                };
            };
            user: {
                addUser: {
                    close: string;
                    invite: string;
                    finish: string;
                    add: string;
                    inviteUserTooltip: string;
                    inviteUserOfflineTooltip: string;
                    inviteLink: {
                        error: {
                            description: string;
                            message: string;
                        };
                        genericError: {
                            description: string;
                            message: string;
                        };
                    };
                    validation: {
                        password: string;
                        passwordCase: string;
                        passwordLength: string;
                        passwordNumeric: string;
                    };
                    summary: {
                        invitation: string;
                        invitationLink: string;
                        inviteWarningMessage: string;
                        invitationBody: {
                            hi: string;
                            accountHasBeenCreated: string;
                            pleaseFollowTheLink: string;
                            thanks: string;
                            team: string;
                        };
                        invitationBodyCopy: {
                            accountHasBeenCreated: string;
                            team: string;
                        };
                        invitationPasswordBody: {
                            accountHasBeenCreated: string;
                            pleaseFollowTheLink: string;
                            myAccountLink: string;
                        };
                        invitationPasswordBodyCopy: {
                            accountHasBeenCreated: string;
                        };
                        passwordWarningMessage: string;
                        password: string;
                        username: string;
                    }
                };
            };
        };
        serverConfigurations: {
            accountManagement: {
                accountRecovery: {
                    heading: string;
                    subHeading: string;
                    toggleName: string;
                };
            };
            additionalSettings: string;
            accountRecovery: {
                heading: string;
                subHeading: string;
                backButton: string;
                passwordRecovery: {
                    form: {
                        fields: {
                            enable: FormAttributes;
                            expiryTime: FormAttributes;
                            notifySuccess: FormAttributes;
                        };
                    };
                    connectorDescription: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    };
                    subHeading: string;
                };
            };
            accountSecurity: {
                heading: string;
                subHeading: string;
                backButton: string;
                botDetection: {
                    form: {
                        fields: {
                            enable: FormAttributes;
                        };
                    };
                    info: {
                        heading: string;
                        subSection1: string;
                        subSection2: string;
                        subSection3: string;
                    };
                    connectorDescription: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    };
                    subHeading: string;
                };
                loginAttemptSecurity: {
                    form: {
                        fields: {
                            accountLockIncrementFactor: FormAttributes;
                            accountLockTime: FormAttributes;
                            enable: FormAttributes;
                            maxFailedAttempts: FormAttributes;
                        };
                    };
                    info: string;
                    connectorDescription: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    };
                    subHeading: string;
                    howItWorks: {
                        correctPassword: {
                            description: string;
                        };
                        incorrectPassword: {
                            description_plural: string;
                            description_singular: string;
                        };
                        example: {
                            description_plural: string;
                            description_singular: string;
                        };
                    };
                };
            };
            generalBackButton: string;
            generalEnabledLabel: string;
            generalDisabledLabel: string;
            userOnboarding: {
                heading: string;
                subHeading: string;
                backButton: string;
                selfRegistration: {
                    form: {
                        fields: {
                            enableAutoLogin: FormAttributes;
                            expiryTime: FormAttributes;
                            signUpConfirmation: FormAttributes;
                            activateImmediately: FormAttributes;
                            enable: FormAttributes;
                        };
                    };
                    connectorDescription: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    };
                    subHeading: string;
                };
            };
        };
        groups: {
            heading: string;
            subHeading: string;
            edit: {
                users: {
                    heading: string;
                    description: string;
                };
            };
        };
        users: {
            administratorSettings: {
                administratorSettingsSubtitle: string;
                administratorSettingsTitle: string;
                backButton: string;
                disableToggleMessage: string;
                enableToggleMessage: string;
                error: {
                    description: string;
                    message: string;
                },
                genericError: {
                    description: string;
                    message: string;
                },
                success: {
                    description: string;
                    message: string;
                }
                toggleHint: string;
            };
            usersTitle: string;
            usersSubTitle: string;
            collaboratorsTitle: string;
            collaboratorsSubTitle: string;
            editUserProfile: {
                userId: string;
                disclaimerMessage: string;
                accountLock: {
                    title: string;
                    description: string;
                };
            };
            buttons: {
                addUserBtn: string;
                addCollaboratorBtn: string;
            };
            collaboratorAccounts: {
                consoleInfo: string;
            };
            list: {
                columns: {
                    user: string;
                    accountType: string;
                    idpType: string;
                    userStore: string;
                };
                popups: {
                    content: {
                        AccountTypeContent: string;
                        idpTypeContent: string;
                        sourceContent: string;
                    };
                };
            };
            descriptions: {
                learnMore: string;
                allUser: string;
                consumerUser: string;
                guestUser: string;
                consumerAppInfo: string;
            };
            notifications: {
                addUser: {
                    customerUser: {
                        limitReachError: NotificationItem;
                    };
                };
            };
            wizard: {
                addUser: {
                    title: string;
                    subtitle: string;

                };
                addAdmin: {
                    external: {
                        title: string;
                        subtitle: string;
                    };
                    internal: {
                        hint: string;
                        title: string;
                        subtitle: string;
                        selectUser: string;
                        searchPlaceholder: string;
                        emptySearchQueryPlaceholder: string;
                        emptySearchResultsPlaceholder: string;
                        updateRole: {
                            error: NotificationItem;
                            genericError: NotificationItem;
                            success: NotificationItem;
                        };
                    }
                };
            }
        };
        admins: {
            editPage: {
                backButton: string;
            }
        }
        invite: {
            notifications: {
                sendInvite: {
                    limitReachError: NotificationItem;
                };
            };
        };
        guest: {
            deleteUser: {
                confirmationModal: {
                    content: string;
                    message: string;
                };
            };
            editUser: {
                dangerZoneGroup: {
                    deleteUserZone: {
                        subheader: string;
                    };
                };
            };
        };
        sidePanel: {
            categories: {
                attributeManagement: string;
                AccountManagement: string;
                userManagement: string;
                organizationSettings: string;
            };
        };
        myAccount: {
            fetchMyAccountData: {
                error: {
                    description: string;
                    message: string;
                },
                genericError: {
                    description: string;
                    message: string;
                },
            },
            fetchMyAccountStatus: {
                error: {
                    description: string;
                    message: string;
                },
                genericError: {
                    description: string;
                    message: string;
                },
            },
            editPage: {
                mfaDescription: string;
                myAccountUrlDescription: string;
                pageTitle: string;
                description: string;
                enableEmailOtp: string;
                enableSmsOtp: string;
                enableTotp: string;
            },
            pageTitle: string;
            description: string;
            goBackToApplication: string;
            goBackToMyAccount: string;
        }
    };
}
