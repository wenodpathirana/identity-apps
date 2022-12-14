/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useRequest, { RequestErrorInterface, RequestResultInterface } from "../../../../features/core/hooks/use-request";
import { store } from "../../../../features/core/store";
import { UsersConstants } from "../constants";
import { UserInviteInterface } from "../models";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

export const getInvitedUserList = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.inviteEndpoint
    };

    return httpClient(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Hook to get the invited users list.
 * 
 * @returns {RequestResultInterface<Data, Error>}
 */
export const useInvitedUsersList = <Data = UserInviteInterface[],
    Error = RequestErrorInterface>(): RequestResultInterface<Data, Error> => {

    const requestConfig = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.inviteEndpoint
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

export const sendInvite = (userInvite: UserInviteInterface): Promise<any> => {
    const requestConfig = {
        data: userInvite,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.inviteEndpoint
    };

    return httpClient(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
};

export const deleteInvite = (traceID: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.inviteEndpoint + "/" + traceID
    };

    return httpClient(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
};

export const updateInvite = (inviteID: string, inviteeData: Record<string, unknown>): Promise<any> => {
    const requestConfig = {
        data: inviteeData,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.inviteEndpoint + "/" + inviteID
    };

    return httpClient(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
};

export const deleteGuestUser = (traceID: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.userEndpoint + "/" + traceID
    };

    return httpClient(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
};

export const resendInvite = (traceID: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.resendEndpoint.replace("{}", traceID)
    };

    return httpClient(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Get invitation link for each user.
 *
 * @return {Promise<any>} response.
 * @throws {IdentityAppsApiException}
 */
export const generateInviteLink = (username: string, domain: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data: {
            username: username,
            userstore: domain
        },
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.inviteLinkEndpoint
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {            
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    UsersConstants.INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {            
            throw new IdentityAppsApiException(
                error.response?.data?.message ?? UsersConstants.RESOURCE_NOT_FOUND_ERROR_MESSAGE,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
