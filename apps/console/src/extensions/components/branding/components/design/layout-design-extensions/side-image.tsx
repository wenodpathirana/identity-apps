/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Field } from "@wso2is/form";
import {  Code, GenericIcon, Heading, ImagePreview } from "@wso2is/react-components";
import React, { Fragment, ReactElement } from "react";
import { Trans } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { LayoutDesignExtensionInterface } from "./layout-design-extension-component-interface";
import { BrandingPreferencesConstants } from "../../../constants";


/**
 * Renders the layout design extension form fields for the images section.
 * @returns {React.ReactElement}
 */
export const renderImageExtensionFields = ({
    initialValues,
    layout,
    setLayout,
    readOnly,
    t,
    ["data-componentid"]: componentId
}: LayoutDesignExtensionInterface): ReactElement => {
    return (
        <Fragment>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.layout.images.logo.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <ImagePreview
                        label={ t("extensions:develop.branding.forms.design.layout.images.logo.preview") }
                        data-componentid={ `${componentId}-side-image-preview` }
                    >
                        <GenericIcon
                            transparent
                            size="tiny"
                            icon={ layout.sideImg.imgURL }
                        />
                    </ImagePreview>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Branding preference side image layout side image URL"
                        inputType="url"
                        name={ "layout.sideImg.imgURL" }
                        label={ t("extensions:develop.branding.forms.design.layout.images.logo.fields.url.label") }
                        placeholder={ 
                            t("extensions:develop.branding.forms.design.layout.images.logo.fields.url.placeholder") 
                        }
                        hint={ (
                            <Trans
                                i18nKey={ 
                                    "extensions:develop.branding.forms.design.layout.images.logo.fields.url.hint"
                                }
                            >
                                Use an image that’s at least <Code>1920x1080 pixels</Code> and less than
                                <Code>1mb</Code> in size for better performance.
                            </Trans>
                        ) }
                        required={ false }
                        value={ initialValues.layout.sideImg.imgURL }
                        readOnly={ readOnly }
                        maxLength={ 
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.SIDE_IMAGE_URL_MAX_LENGTH 
                        }
                        minLength={ 
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.SIDE_IMAGE_URL_MIN_LENGTH 
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-side-image-url` }
                        listen={ (value: string) => {
                            setLayout({
                                ...layout,
                                "sideImg": {
                                    ...layout.sideImg,
                                    imgURL: value
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Branding preference side image layout side image alt text"
                        inputType="default"
                        name={ "layout.sideImg.altText" }
                        label={ t("extensions:develop.branding.forms.design.layout.images.logo.fields.alt.label") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.layout.images.logo.fields.alt.placeholder")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.layout.images.logo.fields.alt.hint")
                        }
                        required={ false }
                        value={ initialValues.layout.sideImg.altText }
                        readOnly={ readOnly }
                        maxLength={
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.SIDE_IMAGE_ALT_TEXT_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.SIDE_IMAGE_ALT_TEXT_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-side-image-alt-text` }
                        listen={ (value: string) => {
                            setLayout({
                                ...layout,
                                "sideImg": {
                                    ...layout.sideImg,
                                    altText: value
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
        </Fragment>
    );
};
