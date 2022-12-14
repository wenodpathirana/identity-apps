/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, EmptyPlaceholder, Iframe, Link } from "@wso2is/react-components";
import get from "lodash-es/get";
import Mustache from "mustache";
import React, {
    CSSProperties,
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { LoginScreenSkeleton } from "./login-screen-skeleton";
import { AppState } from "../../../../../features/core/store";
import { ReactComponent as CustomLayoutWarningImg } from 
    "../../../../../themes/asgardio/assets/images/branding/custom-layout-warning.svg";
import { useLayout, useLayoutStyle } from "../../api";
import { BrandingPreferenceMeta, LAYOUT_DATA, PredefinedLayouts } from "../../meta";
import { BrandingPreferenceInterface } from "../../models";

/**
 * Proptypes for the Branding preference preview component.
 */
interface BrandingPreferencePreviewInterface extends IdentifiableComponentInterface {
    /**
     * Branding preferences object.
     */
    brandingPreference: BrandingPreferenceInterface;
    /**
     * Should the component render as loading.
     */
    isLoading: boolean;
}

/**
 * Branding Preference Preview.
 *
 * @param {BrandingPreferencePreviewInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const BrandingPreferencePreview: FunctionComponent<BrandingPreferencePreviewInterface> = (
    props: BrandingPreferencePreviewInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        brandingPreference,
        isLoading
    } = props;

    const { t } = useTranslation();

    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const supportEmail: string = useSelector((state: AppState) =>
        state.config.deployment.extensions?.supportEmail as string);

    const brandingPreviewContainerRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const [ isIframeReady, setIsIframeReady ] = useState<boolean>(false);
    const [ wrapperStyle, setWrapperStyle ] = useState<CSSProperties>(null);
    const [ iFrameStyle, setIFrameStyle ] = useState<CSSProperties>(null);
    const [ layoutContext, setLayoutContext ] = useState<string[]>([ "", "", "", "", "", "" ]);
    const [ isLayoutResolving, setIsLayoutResolving ] = useState<boolean>(true);
    const [ isErrorOccured, setIsErrorOccured ] = useState<boolean>(false);

    const {
        data: layoutBlob,
        isLoading: layoutLoading
    } = useLayout(brandingPreference.layout.activeLayout, tenantDomain);
    const {
        data: layoutStyleBlob,
        isLoading: layoutStyleLoading
    } = useLayoutStyle(brandingPreference.layout.activeLayout, tenantDomain);

    /**
     * Update the ifram styles to acheive responsiveness.
     */
    const updateStyles = () => {
        if (!brandingPreviewContainerRef) {
            return;
        }

        const parentHeight: number = brandingPreviewContainerRef.current.clientHeight;
        const parentWidth: number = brandingPreviewContainerRef.current.clientWidth;

        const nodeStyle: CSSStyleDeclaration = window.getComputedStyle(brandingPreviewContainerRef.current);
        const topPadding: string = nodeStyle.getPropertyValue("padding-top"); 

        const effectedHeight: number = parentHeight - parseInt(topPadding.substring(0, topPadding.length - 2));

        const scalingFactor: number = 1.8;
        const iFrameOriginalWidth: number = parentWidth * scalingFactor;
        const iFrameOriginalHeight: number = effectedHeight * scalingFactor;

        setWrapperStyle({
            height: effectedHeight,
            overflow: "hidden",
            width: parentWidth
        });

        setIFrameStyle({
            height: iFrameOriginalHeight,
            transform: `scale(${1/scalingFactor})`,
            transformOrigin: "0 0",
            width: iFrameOriginalWidth
        });
    };

    /**
     * Set the initial styles for the iframe.
     */
    useEffect(() => {
        if (brandingPreviewContainerRef)
            updateStyles();
    }, [ brandingPreviewContainerRef ]);

    /**
     * Add and remove event listener for update the iframe styles.
     */
    useEffect(() => {
        window.addEventListener("resize", updateStyles);

        return () => window.removeEventListener("resize", updateStyles);
    }, []);

    /**
     * Read the layout resources.
     */
    useEffect(() => {
        
        const fetchLayoutResources = async () => {
            setIsLayoutResolving(true);

            const _layoutContext: string[] = [ ...layoutContext ];

            let htmlContent: string, cssContent: string;

            if (brandingPreference.layout.activeLayout !== _layoutContext[0]) {
                let layout: Blob;
                let styles: Blob;

                if (layoutLoading || layoutStyleLoading) {
                    return;
                } else {
                    if (layoutBlob) {
                        layout = layoutBlob;
                    }
                    if (layoutStyleBlob) {
                        styles = layoutStyleBlob;
                    }
                }
                    
                try {
                    htmlContent = await layout.text();
                    cssContent = await styles.text();
                } catch (ex: any) {
                    setLayoutContext([ brandingPreference.layout.activeLayout, "", "", "", "", "" ]);
                    setIsErrorOccured(true);
                    setIsLayoutResolving(false);

                    return;
                }
            } else {
                if (isErrorOccured) {
                    setIsLayoutResolving(false);

                    return;
                }

                htmlContent = _layoutContext[1];
                cssContent = _layoutContext[2];
            }
            
            // Execute the layout using mustache library.
            const context: Record<string, string> = 
                LAYOUT_DATA[brandingPreference.layout.activeLayout](brandingPreference.layout, tenantDomain);

            context.ProductHeader = "<section id='productHeader'></section>";
            context.MainSection = "<section id='mainSection'></section>";
            context.ProductFooter = "<section id='productFooter'></section>";
            const view: string = Mustache.render(htmlContent, context);

            const mergedCSSContent = 
                BrandingPreferenceMeta.getThemeSkeleton(brandingPreference.theme)
                + BrandingPreferenceMeta.getStylesToDisablePointerEvents()
                + cssContent;

            setLayoutContext([ 
                brandingPreference.layout.activeLayout, 
                htmlContent, 
                cssContent,
                view, 
                mergedCSSContent,
                get(brandingPreference, "stylesheets.accountApp")
            ]);
            if (isErrorOccured) setIsErrorOccured(false);
            setIsLayoutResolving(false);
        };

        fetchLayoutResources();
    }, [ 
        brandingPreference.theme, 
        brandingPreference.layout,
        brandingPreference.layout.activeLayout,
        layoutLoading,
        layoutStyleLoading
    ]);

    return (
        <div 
            className="branding-preference-preview-container" 
            ref={ brandingPreviewContainerRef } 
            data-componentid={ componentId }
        >
            {
                !isIframeReady
                    ? <ContentLoader data-componentid={ `${ componentId }-loader` } />
                    : null
            }
            <Iframe
                cloneParentStyleSheets
                injectStyleNodeAfterParentStyles
                styles={ isErrorOccured ? "/*no-styles*/" : layoutContext[4] }
                styleNodeInjectionStrategy="prepend"
                stylesheets={ 
                    isErrorOccured || layoutContext[0] === PredefinedLayouts.CUSTOM 
                        ? null 
                        : [ layoutContext[5] ]
                }
                isReady={ (status: boolean) => {
                    setIsIframeReady(status);
                } }
                isLoading={ !isLoading || !isIframeReady }
                data-componentid={ `${ componentId }-iframe` }
                className="branding-preference-preview-iframe"
                style={ iFrameStyle }
                wrapperStyle= { wrapperStyle }
                id="branding-preference-preview-iframe"
            >
                {
                    !isLoading && isIframeReady && !isLayoutResolving
                        ? (
                            isErrorOccured
                                ? (
                                    <div className="branding-preference-preview-error" >
                                        <EmptyPlaceholder
                                            image={ CustomLayoutWarningImg }
                                            imageSize="small"
                                            subtitle={
                                                layoutContext[0] === PredefinedLayouts.CUSTOM
                                                    ? [
                                                        "You have not yet deployed a custom layout.",
                                                        <Trans
                                                            key={ 1 }
                                                            i18nKey={ "extensions:develop.branding.tabs.preview."
                                                                + "errors.layout.notFoundWithSupport.subTitle" }
                                                            tOptions={ {
                                                                supportEmail
                                                            } }
                                                        >
                                                            Need a fully customized layout for your organization? 
                                                            Reach us out at <Link
                                                                data-componentid=
                                                                    "branding-preference-custom-request-mail-trigger"
                                                                link={ `mailto:${ supportEmail }` }
                                                            >
                                                                { supportEmail }
                                                            </Link>
                                                        </Trans>
                                                    ]
                                                    : [
                                                        t("extensions:develop.branding.tabs."
                                                            + "preview.errors.layout.notFound.subTitle")
                                                    ]
                                                 
                                            }
                                            title={ 
                                                layoutContext[0] === PredefinedLayouts.CUSTOM 
                                                    ? t("extensions:develop.branding.tabs.preview.errors."
                                                        + "layout.notFoundWithSupport.title")
                                                    : t("extensions:develop.branding.tabs.preview.errors."
                                                        + "layout.notFound.title")
                                            }
                                        />
                                    </div>
                                )
                                : (
                                    <LoginScreenSkeleton
                                        brandingPreference={ brandingPreference }
                                        layoutContent = { layoutContext[3] }
                                        data-componentid="branding-preference-preview-login-skeleton"
                                    />
                                )
                        ) : <ContentLoader data-componentid={ `${ componentId }-loader` } />
                }
            </Iframe>
        </div>
    );
};

/**
 * Default props for the component.
 */
BrandingPreferencePreview.defaultProps = {
    "data-componentid": "branding-preference-preview"
};
