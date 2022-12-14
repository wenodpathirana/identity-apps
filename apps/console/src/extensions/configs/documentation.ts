/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { DocumentationLinksExtensionInterface } from "./models/documentation";
import { Config } from "../../features/core/configs/app";

export const getDocumentationLinksExtension = () : DocumentationLinksExtensionInterface => {
    const documentationBaseUrl: string = Config?.getDeploymentConfig()?.docSiteURL || "https://wso2.com/asgardeo/docs";

    return {
        common: {
            docsHomePage: documentationBaseUrl
        },
        develop: {
            applications: {
                editApplication: {
                    asgardeoTryitApplication: {
                        general: {
                            learnMore: documentationBaseUrl + "/get-started/try-it-application/"
                        }
                    },
                    attributeManagement: {
                        manageOIDCScopes: documentationBaseUrl + "/guides/users/attributes/manage-scopes" +
                            "/#how-to-request-scope-to-request-user-attributes"
                    },
                    common: {
                        signInMethod: {
                            conditionalAuthenticaion: {
                                apiReference: documentationBaseUrl + "/references/conditional-auth/api-reference/",
                                learnMore: documentationBaseUrl + "/guides/authentication/conditional-auth/",
                                template: {
                                    deviceBased: {
                                        learnMore: documentationBaseUrl + 
                                            "/guides/authentication/conditional-auth/new-device-based-template/"
                                    },
                                    groupBased: {
                                        learnMore: documentationBaseUrl + 
                                            "/guides/authentication/conditional-auth/group-based-template/"
                                    },
                                    ipBased: {
                                        learnMore: documentationBaseUrl + 
                                            "/guides/authentication/conditional-auth/ip-based-template/"
                                    },
                                    userAgeBased: {
                                        learnMore: documentationBaseUrl + 
                                            "/guides/authentication/conditional-auth/user-age-based-template/"
                                    }
                                }
                            },
                            learnMore: undefined
                        }
                    },
                    oidcApplication: {
                        advanced: {
                            learnMore: undefined
                        },
                        attributes: {
                            learnMore: documentationBaseUrl + "/guides/authentication/user-attributes" +
                                "/enable-attributes-for-oidc-app/"
                        },
                        info: {
                            learnMore: documentationBaseUrl + "/get-started/try-samples/qsg-oidc-webapp-java-ee/"
                        },
                        protocol: {
                            learnMore: documentationBaseUrl + "/references/app-settings/oidc-settings-for-app/"
                        },
                        quickStart: {
                            applicationScopes: {
                                learnMore: documentationBaseUrl + "/guides/authentication/user-attributes/" +
                                    "enable-attributes-for-oidc-app/#application-requests-with-scopes"
                            },
                            customConfig: {
                                learnMore: documentationBaseUrl + "/guides/authentication/oidc/implement-auth-code"
                            }
                        }
                    },
                    samlApplication: {
                        advanced: {
                            learnMore: undefined
                        },
                        attributes: {
                            learnMore: documentationBaseUrl + "/guides/authentication/user-attributes" +
                                "/enable-attributes-for-saml-app/"
                        },
                        info: {
                            learnMore: documentationBaseUrl + "/guides/authentication/saml/"
                        },
                        protocol: {
                            learnMore: documentationBaseUrl + "/references/app-settings/saml-settings-for-app/"
                        },
                        quickStart: {
                            customConfig: {
                                learnMore: documentationBaseUrl + "/guides/authentication/saml/discover-saml-configs/"
                            }
                        }
                    },
                    signInMethod: {
                        fido: documentationBaseUrl + "/guides/authentication/passwordless-login/"
                    },
                    singlePageApplication: {
                        info: {
                            learnMore: documentationBaseUrl + 
                                "/guides/authentication/oidc/implement-auth-code-with-pkce/"
                        },
                        quickStart: {
                            customConfig: {
                                learnMore: documentationBaseUrl + 
                                    "/guides/authentication/oidc/implement-auth-code-with-pkce/"
                            }
                        }
                    },
                    standardBasedApplication: {
                        oauth2OIDC: {
                            protocol: {
                                learnMore: documentationBaseUrl + "/guides/authentication/oidc/"
                            }
                        },
                        saml: {
                            protocol: {
                                learnMore: documentationBaseUrl + "/guides/authentication/saml/"
                            }
                        }
                    }
                },
                learnMore: documentationBaseUrl + "/guides/applications/",
                managementApplication: {
                    learnMore: documentationBaseUrl + "/apis/authentication/",
                    selfServicePortal: documentationBaseUrl + "/guides/user-self-service/customer-self-service-portal/"
                },
                myaccount: {
                    learnMore: documentationBaseUrl + "/guides/user-self-service/customer-self-service-portal/"
                },
                newApplication: {
                    mobileApplication: {
                        learnMore: documentationBaseUrl + "/guides/applications/register-mobile-app/"
                    },
                    oidcApplication: {
                        learnMore: documentationBaseUrl + "/guides/applications/register-oidc-web-app/"
                    },
                    samlApplication: {
                        learnMore: documentationBaseUrl + "/guides/applications/register-saml-web-app/"
                    },
                    singlePageApplication: {
                        learnMore: documentationBaseUrl + "/guides/applications/register-single-page-app/"
                    }
                }
            },
            branding: {
                learnMore: documentationBaseUrl + "/guides/branding/"
            },
            connections: {
                edit: {
                    advancedSettings: {
                        jit: documentationBaseUrl + "/guides/authentication/jit-user-provisioning"
                    },
                    quickStart: {
                        fido: {
                            learnMore: documentationBaseUrl + 
                                "/guides/authentication/passwordless-login/add-passwordless-login-with-fido/"
                        }
                    }
                },
                learnMore: documentationBaseUrl + "/guides/authentication/#manage-connections",
                newConnection: {
                    enterprise: {
                        oidcLearnMore: documentationBaseUrl + 
                            "/guides/authentication/enterprise-login/add-oidc-idp-login/",
                        samlLearnMore: documentationBaseUrl + 
                            "/guides/authentication/enterprise-login/add-saml-idp-login/"
                    },
                    facebook: {
                        learnMore: documentationBaseUrl + "/guides/authentication/social-login/add-facebook-login/"
                    },
                    github: {
                        learnMore: documentationBaseUrl + "/guides/authentication/social-login/add-github-login/"
                    },
                    google: {
                        learnMore: documentationBaseUrl + "/guides/authentication/social-login/add-google-login/"
                    },
                    learnMore: documentationBaseUrl + "/guides/authentication/#manage-connections",
                    microsoft: {
                        learnMore: documentationBaseUrl + "/guides/authentication/#manage-connections"
                    },
                    siwe: {
                        learnMore: documentationBaseUrl +
                            "/guides/authentication/decentralized-login/sign-in-with-ethereum"
                    }
                }
            }
        },
        manage: {
            accountRecovery: {
                passwordRecovery: {
                    learnMore: documentationBaseUrl + "/guides/user-accounts/password-recovery/"
                }
            },
            attributes: {
                attributes: {
                    learnMore: documentationBaseUrl + "/guides/users/attributes/manage-attributes/"
                },
                oidcAttributes: {
                    learnMore: documentationBaseUrl + "/guides/users/attributes/manage-oidc-attribute-mappings/"
                },
                scimAttributes: {
                    learnMore: documentationBaseUrl + "/guides/users/attributes/manage-scim2-attribute-mappings/"
                }
            },
            groups: {
                learnMore: documentationBaseUrl + "/guides/users/manage-groups/"
            },
            selfRegistration: {
                learnMore: documentationBaseUrl + "/guides/user-self-service/self-register/"
            },
            userStores: {
                attributeMappings: {
                    learnMore: documentationBaseUrl + "/guides/users/attributes/"
                },
                createUserStore: {
                    learnMore: documentationBaseUrl + "/guides/users/user-stores/configure-a-user-store/"
                },
                highAvailability: {
                    learnMore: documentationBaseUrl + "/guides/users/user-stores/configure-high-availability/"
                },
                userStoreProperties: {
                    learnMore: documentationBaseUrl + "/references/remote-user-store/remote-user-store-properties/"
                },
                userStoresList: {
                    learnMore: documentationBaseUrl + "/guides/users/user-stores/"
                }
            },
            users: {
                allUsers: {
                    learnMore: documentationBaseUrl + "/guides/users/"
                },
                collaboratorAccounts: {
                    learnMore: documentationBaseUrl + "/guides/users/manage-collaborators/",
                    roles: {
                        learnMore: documentationBaseUrl + "/references/user-management/user-roles/"
                    }
                },
                customerAccounts: {
                    learnMore: documentationBaseUrl + "/guides/users/manage-customers/"
                },
                newCollaboratorUser: {
                    learnMore: documentationBaseUrl + "/references/user-management/user-roles/"
                }
            }
        }
    };
};
