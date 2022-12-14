/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Claim, ClaimDialect, ExternalClaim } from "@wso2is/core/models";
import { I18n } from "@wso2is/i18n";
import { SemanticICONS } from "semantic-ui-react";
import { AttributeConfig } from "./models";
import { ClaimManagementConstants, deleteADialect } from "../../features/claims";
import { getUserStoreList } from "../../features/userstores/api";
import { UserStoreListItem } from "../../features/userstores/models";
import { getClaimsForDialect, getDialects } from "../components/claims/api";

/**
 * Check whether claims is  identity claims or not.
 *
 * @param claim claim
 */
const isIdentityClaims = (claim: ExternalClaim): boolean => {
    const identityRegex = new RegExp("wso2.org/claims/identity");
    return identityRegex.test(claim.mappedLocalClaimURI);
};

export const attributeConfig: AttributeConfig = {
    addAttributeMapping: false,
    attributeMappings: {
        deleteAction: false,
        editAttributeMappingDetails: false,
        getExternalAttributes: (attributeType: string, response: ExternalClaim[]): ExternalClaim[] => {
            const claims: ExternalClaim[] = [];

            if (attributeType == ClaimManagementConstants.SCIM) {
                response.forEach((claim: ExternalClaim) => {
                    if (!claim.mappedLocalClaimURI.match(/\/identity\//)) {
                        claims.push(claim);
                    }
                });
            } else {
                claims.push(...response);
            }

            return claims;
        },
        showDangerZone: false,
        showSCIMCore1: false
    },
    attributes: {
        addAttribute: true,
        deleteAction: false,
        description: "extensions:manage.attributes.attributes.description",
        excludeIdentityClaims: true,
        showEditTabs: false,
        showUserstoreMappingWarningIcon: false
    },
    attributesPlaceholderAddButton: (attributeType: string): boolean => {
        return attributeType !== ClaimManagementConstants.SCIM;
    },
    editAttributeMappings: {
        /**
         * Disables and marks the dialect add new attribute button as a
         * coming soon feature.
         * @param dialectID {string}
         */
        markAddExternalAttributeButtonAsAComingSoonFeature(dialectID: string) {
            const excludingSet = new Set([
                ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_EXT_ENT_USER"),
                ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_CORE_USER"),
                ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_CORE")
            ]);
            return excludingSet.has(dialectID);
        },
        showAddExternalAttributeButton: (dialectID: string): boolean => {
            return true;
        }
    },
    editAttributes: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getDisplayOrder: (existingDisplayOrder: number, newDisplayOrder: string): number => {
            const DEFAULT_ATTRIBUTE_DISPLAY_ORDER = 20;
            return existingDisplayOrder > 0 ? existingDisplayOrder : DEFAULT_ATTRIBUTE_DISPLAY_ORDER;
        },
        showDangerZone: true,
        showDisplayOrderInput: false,
        showRequiredCheckBox: true
    },
    externalAttributes: {
        deleteCustomExternalDialect: async (): Promise<boolean> => {
            let dialectID = "";
            let noCustomClaims = false;

            await getDialects().then(response => {
                response.map(dialect => {
                    if (dialect.dialectURI === "urn:scim:wso2:schema") {
                        dialectID = dialect.id;
                    }
                });
            });

            await getClaimsForDialect(dialectID).then(response => {
                if (response.length === 0) {
                    noCustomClaims = true;
                }
            });

            if (noCustomClaims) {
                deleteADialect(dialectID);
            }

            return Promise.resolve(true);
        },
        editAttribute: (claim: ExternalClaim, editClaimID: string, callback: (claimID: string) => void): void => {
            if (!isIdentityClaims(claim)) {
                callback(editClaimID ? "" : claim?.id);
            }
        },
        getEditIcon: (claim: ExternalClaim, editClaimID: string): SemanticICONS => {
            if (isIdentityClaims(claim)) {
                return "eye";
            }
            if (editClaimID === claim?.id) {
                return "times";
            }
            return "pencil alternate";
        },
        getEditPopupText: (claim: ExternalClaim, editClaimID: string): string => {
            if (isIdentityClaims(claim)) {
                return I18n.instance.t("common:view");
            }
            if (editClaimID === claim?.id) {
                return I18n.instance.t("common:cancel");
            }
            return I18n.instance.t("common:edit");
        },
        hideDeleteIcon: (claim: ExternalClaim): boolean => {
            return claim?.claimURI === "sub" || isIdentityClaims(claim);
        },
        isAttributeEditable: false,
        isEditActionClickable: (claim: ExternalClaim): boolean => {
            if (isIdentityClaims(claim)) {
                return false;
            }

            return true;
        },
        isRowClickable: (dialectID: string, item: any): boolean => {
            return (
                dialectID === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC") &&
                !isIdentityClaims(item) &&
                item?.claimURI !== "sub"
            );
        },
        showActions: (dialectID: string): boolean => {
            return dialectID === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC");
        },
        showDeleteIcon: (dialectID: string, claimsList: ExternalClaim[]): boolean => {
            return true;
        }
    },
    isRowSelectable: (claim: Claim | ExternalClaim | ClaimDialect): boolean => {
        if (isIdentityClaims(claim as ExternalClaim)) {
            return false;
        }

        return true;
    },
    isSCIMEditable: true,
    localAttributes: {
        checkAttributeNameAvailability: async (
            attributeName: string, protocol: string
        ): Promise<Map<string, boolean>> => {
            let dialectID = "";
            const availability = new Map()
                .set("SCIM", true)
                .set("OIDC", true);

            if (protocol === "OIDC" || protocol === "BOTH" ) {
                await getClaimsForDialect(ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC")).then(response => {
                    response.map(attrib => {
                        if (attrib.claimURI === attributeName) {
                            availability.set("OIDC", false);
                        }
                    });
                });
            }

            if (protocol === "SCIM" || protocol === "BOTH" ) {
                await getDialects().then(response => {
                    response.map(dialect => {
                        if (dialect.dialectURI === "urn:scim:wso2:schema") {
                            dialectID = dialect.id;
                        }
                    });
                });

                if (dialectID !== "") {
                    await getClaimsForDialect(dialectID).then(response => {
                        response.map(attrib => {
                            if (attrib.claimURI === "urn:scim:wso2:schema:" + attributeName) {
                                availability.set("SCIM", false);
                            }
                        });
                    });
                }
            }

            return availability;
        },
        createCustomDialect: true,
        createWizard: {
            checkOIDCAvailability: true,
            checkSCIMAvailability: true,
            customWIzard: true,
            identifyAsCustomAttrib: true,
            showDisplayOrder: false,
            showOnlyMandatory: true,
            showPrimaryUserStore: false,
            showReadOnlyAttribute: false,
            showRegularExpression: false,
            showSummary: false
        },
        customDialectURI: "urn:scim:wso2:schema",
        oidcDialectURI: "http://wso2.org/oidc/claim",
        getDialect: async (dialectURI: string): Promise<any> => {
            let dialectObject;
            await getDialects().then(response => {
                response.map(dialect => {
                    if (dialect.dialectURI === dialectURI) {
                        dialectObject = dialect;
                    }
                });

            });
            return Promise.resolve(dialectObject);
        },
        isSCIMCustomDialectAvailable: async (): Promise<string> => {
            let dialectID = "";

            await getDialects().then(response => {
                response.map(dialect => {
                    if (dialect.dialectURI === "urn:scim:wso2:schema") {
                        dialectID = dialect.id;
                    }
                });
            });

            return Promise.resolve(dialectID);
        },
        isUserStoresHidden: async (hiddenUserStores: string[]): Promise<UserStoreListItem[]> => {
            const userStores: UserStoreListItem[] = [];
            await getUserStoreList().then(response => {

                response.data.map((store: UserStoreListItem) => {
                    if (!hiddenUserStores.includes(store.name)) {
                        userStores.push(store);
                    }
                });

            });
            return Promise.resolve(userStores);
        },
        mapClaimToCustomDialect: true
    },
    defaultScimMapping: {
        "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": new Map()
                    .set("urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager.displayName",
                        "http://wso2.org/claims/manager.displayName"),
        "urn:ietf:params:scim:schemas:core:2.0:User": new Map()
                .set("urn:ietf:params:scim:schemas:core:2.0:User:active","http://wso2.org/claims/active")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:addresses#home.locality",
                    "http://wso2.org/claims/locality")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:addresses#home.postalCode", 
                    "http://wso2.org/claims/postalcode")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:addresses#home.region",
                    "http://wso2.org/claims/region")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:addresses#home.streetAddress",
                    "http://wso2.org/claims/streetaddress")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:displayName","http://wso2.org/claims/displayName")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:emails","http://wso2.org/claims/emailaddress")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:groups","http://wso2.org/claims/groups")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:locale","http://wso2.org/claims/local")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:name.familyName","http://wso2.org/claims/lastname")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:name.formatted","http://wso2.org/claims/fullname")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:name.givenName","http://wso2.org/claims/givenname")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:name.middleName","http://wso2.org/claims/middleName")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:nickName","http://wso2.org/claims/nickname")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:phoneNumbers.mobile","http://wso2.org/claims/mobile")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:photos.thumbnail","http://wso2.org/claims/thumbnail")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:profileUrl","http://wso2.org/claims/url")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:roles.default","http://wso2.org/claims/roles")
                .set("urn:ietf:params:scim:schemas:core:2.0:User:userName","http://wso2.org/claims/username"),
        "urn:ietf:params:scim:schemas:core:2.0": new Map()
                .set("urn:ietf:params:scim:schemas:core:2.0:externalId","http://wso2.org/claims/externalid")
                .set("urn:ietf:params:scim:schemas:core:2.0:id","http://wso2.org/claims/userid")
                .set("urn:ietf:params:scim:schemas:core:2.0:meta.created","http://wso2.org/claims/created")
                .set("urn:ietf:params:scim:schemas:core:2.0:meta.lastModified","http://wso2.org/claims/modified")
                .set("urn:ietf:params:scim:schemas:core:2.0:meta.location","http://wso2.org/claims/location")
                .set("urn:ietf:params:scim:schemas:core:2.0:meta.resourceType","http://wso2.org/claims/resourceType")
                .set("urn:ietf:params:scim:schemas:core:2.0:meta.version","http://wso2.org/claims/metadata.version"),
    },
    systemClaims: [
        "http://wso2.org/claims/externalid",
        "http://wso2.org/claims/userid",
        "http://wso2.org/claims/created",
        "http://wso2.org/claims/modified",
        "http://wso2.org/claims/location",
        "http://wso2.org/claims/resourceType",
        "http://wso2.org/claims/metadata.version",
        "http://wso2.org/claims/username",
        "http://wso2.org/claims/emailaddress"
    ],
    showCustomDialectInSCIM: true
};
