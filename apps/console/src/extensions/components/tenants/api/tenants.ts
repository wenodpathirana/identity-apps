/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../../../features/core/store";
import { getTenantResourceEndpoints } from "../configs";
import { TenantRequestResponse } from "../models";

const getDomainQueryParam = (): string => {
    const tenantDomain: string = store.getState().auth.tenantDomain;

    return `?domain=${ tenantDomain }`;
};

/**
 * Initialize an axios Http client.
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Create new tenant.
 *
 * @param tenantName - new tenant name
 */
export const addNewTenant = (tenantName: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        data: {
            domain: tenantName
        },
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientOrigin,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: getTenantResourceEndpoints().tenantManagementApi + getDomainQueryParam()
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Make a tenant the user's default tenant.
 *
 * @param tenantName - new tenant name
 */
export const makeTenantDefault = (tenantName: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost
        },
        method: HttpMethods.PUT,
        url: getTenantResourceEndpoints().tenantManagementApi + "/default/" + tenantName + getDomainQueryParam()
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Check whether the new tenant already exists in the system.
 *
 * @param tenantName - new tenant name
 */
export const checkDuplicateTenants = (tenantName: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientOrigin
        },
        method: HttpMethods.HEAD,
        url: getTenantResourceEndpoints().tenantManagementApi + "/" + tenantName + getDomainQueryParam()
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get the tenants associated with the current user.
 *
 * @returns - A promise that resolves with the tenant request response object.
 */
export const getAssociatedTenants = (): Promise<TenantRequestResponse> => {
    const requestConfig: AxiosRequestConfig = {
        method: HttpMethods.GET,
        url: getTenantResourceEndpoints().tenantAssociationApi + getDomainQueryParam()
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};
