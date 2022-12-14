/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { HttpMethods } from "@wso2is/core/models";
import { Config } from "../../../../features/core/configs";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../../../features/core/hooks/use-request";
import { PredefinedLayouts } from "../meta";

/**
 * Hook to get the layout.
 *
 * @param {PredefinedLayouts} layout - Layout name.
 * @param {string} tenantDomain - Tenant name.
 * @returns {RequestResultInterface<Data, Error>}
 */
export const useLayout = <Data = Blob, Error = RequestErrorInterface>(
    layout: PredefinedLayouts, 
    tenantDomain: string
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "text/html",
            "Content-Type": "text/html"
        },
        method: HttpMethods.GET,
        responseType: "blob",
        url: 
            layout === PredefinedLayouts.CUSTOM
                ? `${
                    Config.getDeploymentConfig().extensions?.layoutStoreURL
                        ? (Config.getDeploymentConfig().extensions.layoutStoreURL as string)
                            .replace("${tenantDomain}", tenantDomain)
                        : `https://${window.location.host}/libs/login-portal-layouts`
                }/body.html`
                : `https://${window.location.host}/libs/login-portal-layouts/${layout}/body.html`
    };

    const {
        data,
        error,
        isValidating,
        mutate
    } = useRequest<Data, Error>(requestConfig, { attachToken: false });

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Hook to get the layout styles.
 *
 * @param {PredefinedLayouts} layout - Layout name.
 * @param {string} tenantDomain - Tenant name.
 * @returns {RequestResultInterface<Data, Error>}
 */
export const useLayoutStyle = <Data = Blob, Error = RequestErrorInterface>(
    layout: PredefinedLayouts, 
    tenantDomain: string
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "text/css",
            "Content-Type": "text/css"
        },
        method: HttpMethods.GET,
        responseType: "blob",
        url: 
            layout === PredefinedLayouts.CUSTOM
                ? `${
                    Config.getDeploymentConfig().extensions?.layoutStoreURL
                        ? (Config.getDeploymentConfig().extensions.layoutStoreURL as string)
                            .replace("${tenantDomain}", tenantDomain)
                        : `https://${window.location.host}/libs/login-portal-layouts`
                }/styles.css`
                : `https://${window.location.host}/libs/login-portal-layouts/${layout}/styles.css`
    };

    const {
        data,
        error,
        isValidating,
        mutate
    } = useRequest<Data, Error>(requestConfig, { attachToken: false });

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};
