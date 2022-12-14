/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ExtendedFeatureResourceEndpointsInterface } from "./models";

/**
 * Get the resource endpoints for the extended features.
 *
 * @param serverHost - Server Host.
 * @returns Interface for the resource endpoints of extended features.
 */
export const getExtendedFeatureResourceEndpoints = (serverHost: string): ExtendedFeatureResourceEndpointsInterface => {
    
    return {
        brandingPreference: `${ serverHost }/api/server/v1/branding-preference`,
        diagnosticLogsEndpoint: `${ serverHost }/api/asgardeo/v1/logs/diagnostics/search`,
        inviteEndpoint: `${ serverHost }/api/asgardeo-guest/v1/users/invite`,
        inviteLinkEndpoint: `${ serverHost }/api/asgardeo-onboard/v1/users/invite-link`,
        organizationEndpoint: `${ serverHost }/api/asgardeo-enterprise-login/v1/business-user-login/{organization}`,
        organizationPatchEndpoint: `${ serverHost }/api/asgardeo-enterprise-login/v1/business-user-login`,
        resendEndpoint: `${ serverHost }/api/asgardeo-guest/v1/users/invite/{}/resend`,
        userEndpoint: `${ serverHost }/api/asgardeo-guest/v1/users`,
        userStoreAgentConnection: `${ serverHost }/api/onprem-userstore/v1/connection`,
        userStoreAgentToken: `${ serverHost }/api/onprem-userstore/v1/token`
    };
};
