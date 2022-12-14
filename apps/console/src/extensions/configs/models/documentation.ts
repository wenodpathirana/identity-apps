/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Interface for the account recovery section documentation structure.
 */
interface AccountRecoveryDocumentationLinksInterface {
    passwordRecovery: {
        learnMore: string;
    }
}

/**
 * Interface for the applications section documentation structure.
 */
interface ApplicationsDocumentationLinksInterface {
    learnMore: string;
    editApplication: {
        asgardeoTryitApplication: {
            general: {
                learnMore: string
            }
        },
        attributeManagement: {
            manageOIDCScopes: string;
        },
        common: {
            signInMethod: {
                learnMore: string;
                conditionalAuthenticaion: {
                    apiReference: string;
                    learnMore: string;
                    template: {
                        deviceBased: {
                            learnMore: string;
                        }
                        groupBased: {
                            learnMore: string;
                        }
                        ipBased: {
                            learnMore: string;
                        }
                        userAgeBased: {
                            learnMore: string;
                        }
                    }
                }
            }
        }
        oidcApplication: {
            advanced: {
                learnMore: string;
            }
            attributes: {
                learnMore: string;
            }
            info: {
                learnMore: string;
            }
            protocol: {
                learnMore: string;
            };
            quickStart: {
                applicationScopes: {
                    learnMore: string;
                };
                customConfig: {
                    learnMore: string;
                };
            };
        }
        samlApplication: {
            advanced: {
                learnMore: string;
            }
            attributes: {
                learnMore: string;
            }
            info: {
                learnMore: string;
            }
            protocol: {
                learnMore: string;
            };
            quickStart: {
                customConfig: {
                    learnMore: string;
                };
            };
        },
        signInMethod: {
            fido: string;
        };
        singlePageApplication: {
            quickStart: {
                customConfig: {
                    learnMore: string;
                };
            };
            info: {
                learnMore: string;
            }
        };
        standardBasedApplication: {
            oauth2OIDC: {
                protocol: {
                    learnMore: string;
                };
            };
            saml: {
                protocol: {
                    learnMore: string;
                };
            };
        };
    }
    newApplication: {
        oidcApplication: {
            learnMore: string;
        }
        samlApplication: {
            learnMore: string;
        }
        singlePageApplication: {
            learnMore: string;
        }
        mobileApplication: {
            learnMore: string;
        }
    }
    managementApplication: {
        learnMore: string;
        selfServicePortal: string;
    }
    myaccount: {
        learnMore: string;
    }
}

/**
 * Interface for the attributes section documentation structure.
 */
interface AttributesDocumentationLinksInterface {
    attributes: {
        learnMore: string;
    }
    oidcAttributes: {
        learnMore: string;
    }
    scimAttributes: {
        learnMore: string;
    }
}

/**
 * Interface for the Branding section documentation structure.
 */
interface BrandingDocumentationLinksInterface {
    learnMore: string;
}

/**
 * Interface for the common documentation structure.
 */
interface CommonDocumentationLinksInterface {
    docsHomePage: string;
}

/**
 * Interface for the connections section documentation structure.
 */
interface ConnectionsDocumentationLinksInterface {
    learnMore: string;
    newConnection: {
        learnMore: string;
        enterprise: {
            oidcLearnMore: string;
            samlLearnMore: string;
        };
        facebook: {
            learnMore: string;
        };
        github: {
            learnMore: string;
        };
        google: {
            learnMore: string;
        };
        microsoft: {
            learnMore: string;
        };
        siwe: {
            learnMore: string;
        };
    };
    edit: {
        advancedSettings: {
            jit: string;
        };
        quickStart: {
            fido: {
                learnMore: string;
            };
        };
    }
}

/**
 * Interface for the groups section documentation structure.
 */
interface GroupsDocumentationLinksInterface {
    learnMore: string;
}

/**
 * Interface for the self registration section documentation structure.
 */
interface SelfRegistrationDocumentationLinksInterface {
    learnMore: string;
}

/**
 * Interface for the users section documentation structure.
 */
interface UsersDocumentationLinksInterface {
    allUsers: {
        learnMore: string;
    }
    collaboratorAccounts: {
        learnMore: string;
        roles: {
            learnMore: string;
        }
    }
    customerAccounts: {
        learnMore: string;
    }
    newCollaboratorUser: {
        learnMore: string;
    }
}

/**
 * Interface for the user stores section documentation structure.
 */
interface UserStoreDocumentationLinksInterface {
    attributeMappings: {
        learnMore: string;
    }
    createUserStore: {
        learnMore: string;
    }
    userStoresList: {
        learnMore: string;
    }
    highAvailability: {
        learnMore: string;
    }
    userStoreProperties: {
        learnMore: string;
    }
}

/**
 * Interface for the console documentation structure.
 */
export interface DocumentationLinksExtensionInterface {
    /**
     * Documentation links for common elements.
     */
    common: CommonDocumentationLinksInterface;
    /**
     * Documentation links for develop section elements.
     */
    develop: {
        /**
         * Documentation links for applications section elements.
         */
        applications: ApplicationsDocumentationLinksInterface;
        /**
         * Documentation links for Branding section elements.
         */
        branding: BrandingDocumentationLinksInterface;
        /**
         * Documentation links for connections section elements.
         */
        connections: ConnectionsDocumentationLinksInterface;
    }
    /**
     * Documentation links for manage section elements.
     */
    manage: {
        /**
         * Documentation links for account recovery elements.
         */
        accountRecovery: AccountRecoveryDocumentationLinksInterface;
        /**
         * Documentation links for attributes section elements.
         */
        attributes: AttributesDocumentationLinksInterface;
        /**
         * Documentation links for groups section elements.
         */
        groups: GroupsDocumentationLinksInterface;
        /**
         * Documentation links for self registration section elements.
         */
        selfRegistration: SelfRegistrationDocumentationLinksInterface;
        /**
         * Documentation links for users section elements.
         */
        users: UsersDocumentationLinksInterface;
        /**
         * Documentation links for user stores section elements.
         */
        userStores: UserStoreDocumentationLinksInterface;
    }
}
