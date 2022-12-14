/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Message } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { RemoteUserStoreConstants } from "../../constants";

/**
 * Prop types of the general user store details component
 */
interface GeneralUserStoreDetailsPropsInterface extends TestableComponentInterface {
    /**
     * Flag to hold the submit state.
     */
    triggerSubmit: boolean;
    /**
     * Callback function to handle basic details submit.
     */
    handleBasicDetailsSubmit?: (values: Map<string, FormValue>) => void;
    /**
     * Callback to handle user store type change.
     */
    handleUserStoreTypeChange?: (userStoreType: string) => void;
    /**
     * User store type.
     */
    userStoreType?: string;
    /**
     * Checks whether userstore name entered is valid.
     */
    setUserStoreNameValid: (isValid: boolean) => void;
}

/**
 * This component renders the general user store details component.
 *
 * @param {GeneralUserStoreDetailsPropsInterface} props - Props injected to the component.
 *
 * @returns {React.ReactElement}
 */
export const GeneralUserStoreDetails: FunctionComponent<GeneralUserStoreDetailsPropsInterface> = (
    props: GeneralUserStoreDetailsPropsInterface
): ReactElement => {

    const {
        triggerSubmit,
        handleBasicDetailsSubmit,
        userStoreType,
        handleUserStoreTypeChange,
        setUserStoreNameValid,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const userStoreOptions = [
        {
            "data-testid": `${ testId }-create-user-store-form-user-store-ldap-option-radio-button`,
            label: "LDAP",
            value: "LDAP"
        },
        {
            "data-testid": `${ testId }-create-user-store-form-user-store-ad-option-radio-button`,
            label: "Active Directory",
            value: "AD"
        }
    ];

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Forms
                        submitState={ triggerSubmit }
                        onSubmit={ (values: Map<string, FormValue>) => {
                            handleBasicDetailsSubmit(values);
                        } }
                    >
                        <Field
                            className="uppercase"
                            type="text"
                            name="name"
                            label="Name"
                            requiredErrorMessage="This field cannot be empty as this is the unique identifier of the
                            user store"
                            required={ true }
                            placeholder="Enter the name of the user store"
                            minLength={ 3 }
                            maxLength={ 50 }
                            width={ 14 }
                            data-testid={ `${ testId }-user-store-name-input` }
                            hint="This will appear as the name of the remote user store that you connect."
                            listen={ (values) => {
                                setUserStoreNameValid(values.get("name").length > 0);
                                values.set("name", (values.get("name").toString().toUpperCase()));
                            } }
                            validation={ (value: string, validation: Validation) => {
                                if (!isEmpty(value)) {
                                    // Regular expression to validate having / and _ in the user store name
                                    const regExpInvalidSymbols = new RegExp("^[^_/]+$");

                                    // Regular expression to validate having all symbols in the user store name
                                    const regExpAllSymbols = new RegExp("^([^a-zA-Z0-9]+$)");
                                    
                                    // Already created/restricted user store names
                                    const arr: string[] = [ 
                                        RemoteUserStoreConstants.PRIMARY_USER_STORE_NAME, 
                                        RemoteUserStoreConstants.FEDERATION_USER_STORE_NAME,
                                        RemoteUserStoreConstants.DEFAULT_USER_STORE_NAME
                                    ];

                                    let isMatch: boolean = true;
                                    let validationErrorMessage: string;
                                    
                                    if (!regExpInvalidSymbols.test(value)) {
                                        isMatch = false;
                                        validationErrorMessage = t("extensions:manage.features.userStores.edit."
                                            + "general.form.validations.invalidSymbolsErrorMessage");
                                    } else if ((arr.includes(value.toUpperCase()))) {
                                        isMatch = false;
                                        validationErrorMessage = t("extensions:manage.features.userStores.edit."
                                            + "general.form.validations.restrictedNamesErrorMessage", { name: value });
                                    } else if (regExpAllSymbols.test(value)) {
                                        isMatch = false;
                                        validationErrorMessage = t("extensions:manage.features.userStores.edit."
                                            + "general.form.validations.allSymbolsErrorMessage");
                                    } else {
                                        isMatch = true;
                                    }

                                    if (!isMatch) {
                                        setUserStoreNameValid(false);
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            validationErrorMessage
                                        );
                                    }
                                }
                            } }
                        />
                        <Field
                            requiredErrorMessage={ null }
                            type="text"
                            name="description"
                            label="Description"
                            required={ false }
                            placeholder="Enter the description of the user store"
                            maxLength={ 300 }
                            minLength={ 3 }
                            width={ 14 }
                            data-testid={ `${ testId }-user-store-description-textarea` }
                        />
                        <Field
                            type="radio"
                            label="Remote user store type"
                            name="userStoreType"
                            default="createPw"
                            listen={ (values) => {
                                handleUserStoreTypeChange(values.get("userStoreType").toString());
                            } }
                            children={ userStoreOptions }
                            value={ userStoreType ?? "LDAP" }
                            tabIndex={ 6 }
                        />
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={ 14 }>
                                    <Message
                                        content={ t("extensions:manage.features.userStores.edit."
                                            + "general.userStoreType.info") }
                                        type="info"
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Forms>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the component.
 */
GeneralUserStoreDetails.defaultProps = {
    "data-testid": "asgardeo-customer-userstore-general-details"
};
