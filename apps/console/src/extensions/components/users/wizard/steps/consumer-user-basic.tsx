/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Grid, Icon, Menu, Message, Radio } from "semantic-ui-react";
import { SharedUserStoreConstants } from "../../../../../features/core";
import { EventPublisher, SharedUserStoreUtils } from "../../../../../features/core/utils";
import { OrganizationType } from "../../../../../features/organizations/constants";
import { useGetOrganizationType } from "../../../../../features/organizations/hooks/use-get-organization-type";
import { getUsersList } from "../../../../../features/users";
import { USERSTORE_REGEX_PROPERTIES } from "../../../../../features/userstores";
import { CONSUMER_USERSTORE, UsersConstants } from "../../../users/constants";

/**
 * Proptypes for the add consumer user basic component.
 */
export interface AddConsumerUserBasicProps {
    initialValues: any;
    triggerSubmit: boolean;
    emailVerificationEnabled: boolean;
    onSubmit: (values: any) => void;
    hiddenFields?: ("userName" | "firstName" | "lastName" | "password")[];
    requestedPasswordOption?: "ask-password" | "create-password";
    isFirstNameRequired?: boolean;
    isLastNameRequired?: boolean;
    setUserSummaryEnabled: (toggle: boolean) => void;
    setAskPasswordFromUser?: (toggle: boolean) => void;
    setOfflineUser?: (toggle: boolean) => void;
    isBasicDetailsLoading?: boolean;
    setBasicDetailsLoading?: (toggle: boolean) => void;
}

/**
 * Add consumer user basic component.
 *
 * TODO: Add localization support. (https://github.com/wso2-enterprise/asgardeo-product/issues/209)
 *
 * @returns ReactElement
 */
export const AddConsumerUserBasic: React.FunctionComponent<AddConsumerUserBasicProps> = (
    props: AddConsumerUserBasicProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        emailVerificationEnabled,
        onSubmit,
        hiddenFields,
        requestedPasswordOption,
        isFirstNameRequired,
        isLastNameRequired,
        setUserSummaryEnabled,
        setAskPasswordFromUser,
        setOfflineUser,
        isBasicDetailsLoading,
        setBasicDetailsLoading
    } = props;

    const [ passwordOption, setPasswordOption ] = useState(initialValues?.passwordOption);
    const [ askPasswordOption, setAskPasswordOption ] = useState<string>("email");
    const [ password, setPassword ] = useState<string>("");
    const [ isFocused ] = useState<boolean>(false);
    const [ userStoreRegex, setUserStoreRegex ] = useState<string>("");

    const formBottomRef = useRef<HTMLDivElement>();
    const emailRef = useRef<HTMLDivElement>();

    const orgType: OrganizationType = useGetOrganizationType();

    const { t } = useTranslation();

    const [ , setRegExLoading ] = useState<boolean>(false);

    // Username input validation error messages.
    const USER_ALREADY_EXIST_ERROR_MESSAGE: string = t("console:manage.features.users.consumerUsers.fields." +
        "username.validations.invalid");
    const USERNAME_REGEX_VIOLATION_ERROR_MESSAGE: string = t("console:manage.features.users.consumerUsers.fields." +
        "username.validations.regExViolation");
    const USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE: string = t("console:manage.features.users.consumerUsers.fields." +
        "username.validations.invalidCharacters");

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    //TODO: Re-enable this after reviewing the usage of the generate password feature.
    // /**
    //  * The following useEffect is triggered when a random password is generated.
    //  */
    // useEffect(() => {
    //     if (randomPassword && randomPassword !== "") {
    //         setIsPasswordGenerated(true);
    //     }
    // }, [ randomPassword ]);

    /**
     * Set the password setup option to 'ask-password'.
     */
    useEffect(() => {
        if (!passwordOption) {
            if (!requestedPasswordOption) {
                setPasswordOption("ask-password");

                return;
            }

            setPasswordOption(requestedPasswordOption);
        }
    }, [ requestedPasswordOption ]);

    useEffect(() => {
        if (passwordOption === "create-password") {
            setUserSummaryEnabled(true);
            setAskPasswordFromUser(true);
            setOfflineUser(false);
        } else {
            if (askPasswordOption === "offline") {
                setUserSummaryEnabled(true);
                setAskPasswordFromUser(false);
                setOfflineUser(true);

                return;
            }
            setUserSummaryEnabled(false);
            setAskPasswordFromUser(false);
            setOfflineUser(false);
        }
    }, [ passwordOption, askPasswordOption ]);

    /**
     * The following function gets the user store regex that validates user name.
     */
    const getUserStoreRegex = async () => {
        setRegExLoading(true);
        await SharedUserStoreUtils.getUserStoreRegEx(CONSUMER_USERSTORE,
            SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.UsernameRegEx)
            .then((response) => {
                setUserStoreRegex(response);
                setRegExLoading(false);
            });
    };

    useEffect(() => {
        getUserStoreRegex();
    }, []);

    const askPasswordOptionData = {
        "data-testid": "user-mgt-add-user-form-ask-password-option-radio-button",
        label: t("console:manage.features.user.forms.addUserForm.buttons.radioButton.options.askPassword"),
        value: "ask-password"
    };

    const createPasswordOptionData = {
        "data-testid": "user-mgt-add-user-form-create-password-option-radio-button",
        label: t("console:manage.features.user.forms.addUserForm.buttons.radioButton.options.createPassword"),
        value: "create-password"
    };

    /**
     * The following function handles the change of the password.
     *
     * @param values - Map of form values.
     */
    const handlePasswordChange = (values: Map<string, FormValue>): void => {
        const password: string = values.get("newPassword").toString();

        setPassword(password);
    };

    //TODO: Re-enable this after reviewing the usage of the generate password feature.
    // /**
    //  * The following function generate a random password.
    //  */
    // const generateRandomPassword = (): void => {
    //     const genPasswrod = generate({ length: 11, numbers: true, symbols: true, uppercase: true });
    //     setPassword(genPasswrod);
    //     setRandomPassword(genPasswrod);
    // };

    const getFormValues = (values: Map<string, FormValue>) => {
        eventPublisher.publish("manage-users-customer-password-option", {
            type: values.get("passwordOption")?.toString()
        });

        return {
            domain: CONSUMER_USERSTORE,
            email: values.get("email")?.toString(),
            firstName: values.get("firstName")?.toString(),
            lastName: values.get("lastName")?.toString(),
            newPassword: values.get("newPassword") && values.get("newPassword") !== undefined
                ? values.get("newPassword").toString()
                : "",
            passwordOption: values.get("passwordOption")?.toString()
        };
    };

    /**
     * Scrolls to the first field that throws an error.
     *
     * @param field - field The name of the field.
     */
    const scrollToInValidField = (field: string): void => {
        const options: ScrollIntoViewOptions = {
            behavior: "smooth",
            block: "center"
        };

        switch (field) {
            case "email":
                emailRef.current.scrollIntoView(options);

                break;
            case "formBottom":
                formBottomRef.current.scrollIntoView(options);

                break;
        }
    };

    /**
     * Verify whether the provided password is valid.
     *
     * @param password - The password to validate.
     */
    const isNewPasswordValid = async (password: string) => {
        const passwordRegex = await SharedUserStoreUtils.getUserStoreRegEx(
            CONSUMER_USERSTORE,
            USERSTORE_REGEX_PROPERTIES.PasswordRegEx);

        return SharedUserStoreUtils.validateInputAgainstRegEx(password, passwordRegex);
    };

    /**
     * Validate password and display an error message when the password is invalid.
     *
     * @param value - The value of the password field.
     * @param validation - The validation object.
     */
    const validateNewPassword = async (value: string, validation: Validation) => {
        if(!await isNewPasswordValid(value)){
            validation.isValid = false;
            validation.errorMessages.push(t(
                "extensions:manage.features.user.addUser.validation.password"
            ));
        }
        scrollToInValidField("formBottom");
    };

    const renderAskPasswordOption = ():ReactElement => {
        return (
            <div className="mt-4 mb-4 ml-4">
                { orgType !== OrganizationType.SUBORGANIZATION && (
                    <Menu
                        compact={ true }
                        size="small"
                        className="mb-4"
                    >
                        <Menu.Item
                            name="Invite via email"
                            active={ askPasswordOption === "email" }
                            onClick={ () => setAskPasswordOption("email") }
                        />


                        <Menu.Item
                            name="Invite offline"
                            active={ askPasswordOption === "offline" }
                            onClick={ () => setAskPasswordOption("offline") }
                        />

                    </Menu>
                ) }
                {
                    resolveAskPasswordOption()
                }
            </div>
        );
    };

    const resolveAskPasswordOption = ():ReactElement => {
        if (askPasswordOption === "email") {
            return (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Message
                            icon="mail"
                            content={ t(
                                "extensions:manage.features.user.addUser.inviteUserTooltip"
                            ) }
                            size="small"
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        } else if (askPasswordOption === "offline") {
            return (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Message
                            icon="copy"
                            content={ t(
                                "extensions:manage.features.user.addUser.inviteUserOfflineTooltip"
                            ) }
                            size="small"
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        return null;
    };

    /**
     * Function to render the validation status of minimum length of the password.
     * @returns React.ReactElement
     */
    const renderPasswordLengthValidation = (): ReactElement => {
        if (password === "") {
            return <Icon name="circle" color="grey" inverted/>;
        }

        if (password.length >= UsersConstants.FORM_FIELD_CONSTRAINTS.PASSWORD_MIN_LENGTH) {
            return <Icon name="check circle" color="green"/>;
        }

        if (isFocused) {
            return <Icon name="circle" color="grey" inverted/>;
        } else {
            return <Icon name="remove circle" color="red"/>;
        }
    };

    /**
     * Function to render the validation status of uppercase and lowercase in the password.
     * @returns React.ReactElement
     */
    const renderPasswordCaseValidation = (): ReactElement => {
        if (password === "") {
            return <Icon name="circle" color="grey" inverted/>;
        }

        if (password.match(UsersConstants.FORM_FIELD_CONSTRAINTS.PASSWORD_LOWER_CASE) &&
            password.match(UsersConstants.FORM_FIELD_CONSTRAINTS.PASSWORD_UPPER_CASE)) {
            return <Icon name="check circle" color="green"/>;
        }

        if (isFocused) {
            return <Icon name="circle" color="grey" inverted/>;
        } else {
            return <Icon name="remove circle" color="red"/>;
        }
    };

    /**
     * Function to render the validation status of presence of number in the password.
     * @returns React.ReactElement
     */
    const renderPasswordNumericValidation = (): ReactElement => {
        if (password === "") {
            return <Icon name="circle" color="grey" inverted/>;
        }

        if (password.match(UsersConstants.FORM_FIELD_CONSTRAINTS.PASSWORD_NUMERIC)) {
            return <Icon name="check circle" color="green"/>;
        }

        if (isFocused) {
            return <Icon name="circle" color="grey" inverted/>;
        } else {
            return <Icon name="remove circle" color="red"/>;
        }
    };

    const renderCreatePasswordOption = ():ReactElement => {
        return (
            <>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            data-testid="user-mgt-add-user-form-newPassword-input"
                            className="addon-field-wrapper"
                            hidePassword={ t("common:hidePassword") }
                            label={ t(
                                "console:manage.features.user.forms.addUserForm.inputs.newPassword.label"
                            ) }
                            name="newPassword"
                            placeholder={ t(
                                "console:manage.features.user.forms.addUserForm.inputs." +
                                "newPassword.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "console:manage.features.user.forms.addUserForm." +
                                "inputs.newPassword.validations.empty"
                            ) }
                            showPassword={ t("common:showPassword") }
                            type="password"
                            value={ initialValues?.newPassword }
                            validation={ validateNewPassword }
                            tabIndex={ 5 }
                            enableReinitialize={ true }
                            listen = { handlePasswordChange }
                            maxWidth={ 60 }
                        />
                        <Grid className="m-0 pt-2 password-policy-description">
                            <Grid.Row className="p-0 mb-1">
                                { renderPasswordLengthValidation() }
                                <p>
                                    { t("extensions:manage.features.user.addUser.validation.passwordLength") }
                                </p>
                            </Grid.Row>
                            <Grid.Row className="p-0 mb-1">
                                { renderPasswordCaseValidation() }
                                <p>
                                    { t("extensions:manage.features.user.addUser.validation.passwordCase") }
                                </p>
                            </Grid.Row>
                            <Grid.Row className="p-0 mb-1">
                                { renderPasswordNumericValidation() }
                                <p>
                                    { t("extensions:manage.features.user.addUser.validation.passwordNumeric") }
                                </p>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
                <div ref={ formBottomRef } />
            </>
        );
    };

    /**
     * The modal to add new user.
     */
    const addUserBasicForm = () => (
        <Forms
            data-testid="user-mgt-add-user-form"
            onSubmit={ async (values) => {
                if (passwordOption === "create-password") {
                    // Check whether the new password is valid
                    if (await isNewPasswordValid(values.get("newPassword")
                        ? values.get("newPassword").toString()
                        : "")) {
                        onSubmit(getFormValues(values));
                    }
                }
                else {
                    onSubmit(getFormValues(values));
                }
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                {
                    !hiddenFields.includes("userName") && (
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <div  ref ={ emailRef } />
                                <Field
                                    loading={ isBasicDetailsLoading }
                                    data-testid="user-mgt-add-user-form-email-input"
                                    label={ "Email (Username)" }
                                    name="email"
                                    placeholder={ t(
                                        "console:manage.features.user.forms.addUserForm.inputs." +
                                        "email.placeholder"
                                    ) }
                                    required={ true }
                                    requiredErrorMessage={ t(
                                        "console:manage.features.user.forms.addUserForm.inputs.email.validations.empty"
                                    ) }
                                    validation={ async (value: string, validation: Validation) => {
                                        setBasicDetailsLoading(true);

                                        // Check username validity against userstore regex.
                                        if (value && (
                                            !SharedUserStoreUtils.validateInputAgainstRegEx(value, userStoreRegex)) ||
                                            !FormValidation.email(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                                            scrollToInValidField("email");
                                            setBasicDetailsLoading(false);
                                        }

                                        try {
                                            // Check for the existence of users in the userstore by the username.
                                            // Some characters disallowed by username
                                            // -regex cause failure in below request.
                                            // Therefore, existence of duplicates is
                                            // -checked only post regex validation success.
                                            if (value && validation.isValid === true) {
                                                const usersList
                                                    = await getUsersList(null, null,
                                                        "userName eq " + value, null,
                                                        CONSUMER_USERSTORE);

                                                if (usersList?.totalResults > 0) {
                                                    validation.isValid = false;
                                                    validation.errorMessages.push(USER_ALREADY_EXIST_ERROR_MESSAGE);
                                                    scrollToInValidField("email");
                                                }

                                                setBasicDetailsLoading(false);
                                            }
                                        } catch (error) {
                                            // Some non ascii characters are not accepted by DBs with certain charsets.
                                            // Hence, the API sends a `500` status code.
                                            // see below issue for more context.
                                            // https://github.com/wso2/product-is/issues/10190#issuecomment-719760318
                                            if (error?.response?.status === 500) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE);
                                                scrollToInValidField("email");
                                            }

                                            setBasicDetailsLoading(false);
                                        }
                                    } }
                                    type="email"
                                    value={ initialValues && initialValues.email }
                                    tabIndex={ 1 }
                                    maxLength={ 60 }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    !hiddenFields.includes("firstName") && (
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field
                                    data-testid="user-mgt-add-user-form-firstName-input"
                                    label={ t(
                                        "console:manage.features.user.forms.addUserForm.inputs.firstName.label"
                                    ) }
                                    name="firstName"
                                    placeholder={ t(
                                        "console:manage.features.user.forms.addUserForm.inputs." +
                                        "firstName.placeholder"
                                    ) }
                                    required={ isFirstNameRequired }
                                    requiredErrorMessage={ t(
                                        "console:manage.features.user.forms.addUserForm." +
                                        "inputs.firstName.validations.empty"
                                    ) }
                                    type="text"
                                    value={ initialValues && initialValues.firstName }
                                    tabIndex={ 2 }
                                    maxLength={ 30 }
                                    validation={ async (value: string, validation: Validation) => {
                                        if (value.includes("/")) {
                                            validation.isValid = false;
                                            validation.errorMessages.push( "First Name cannot contain" +
                                            " the forward slash (/) character." );
                                        }
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    !hiddenFields.includes("lastName") && (
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field
                                    data-testid="user-mgt-add-user-form-lastName-input"
                                    label={ t(
                                        "console:manage.features.user.forms.addUserForm.inputs.lastName.label"
                                    ) }
                                    name="lastName"
                                    placeholder={ t(
                                        "console:manage.features.user.forms.addUserForm.inputs." +
                                        "lastName.placeholder"
                                    ) }
                                    required={ isLastNameRequired }
                                    requiredErrorMessage={ t(
                                        "console:manage.features.user.forms.addUserForm." +
                                        "inputs.lastName.validations.empty"
                                    ) }
                                    type="text"
                                    value={ initialValues && initialValues.lastName }
                                    tabIndex={ 3 }
                                    maxLength={ 30 }
                                    validation={ async (value: string, validation: Validation) => {
                                        if (value.includes("/")) {
                                            validation.isValid = false;
                                            validation.errorMessages.push( "Last Name cannot contain" +
                                            " the forward slash (/) character." );
                                        }
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                { emailVerificationEnabled && !hiddenFields.includes("password")
                    ? (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Form.Field>
                                    <label className="mb-3">
                                        { t("console:manage.features.user.forms.addUserForm" +
                                            ".buttons.radioButton.label") }
                                    </label>
                                    <Radio
                                        label={ askPasswordOptionData.label }
                                        data-testId={ askPasswordOptionData["data-testid"] }
                                        name="handlePasswordGroup"
                                        value={ askPasswordOptionData.value }
                                        checked={ passwordOption === askPasswordOptionData.value }
                                        onChange={ (e, item) => setPasswordOption(item?.value) }
                                    />
                                </Form.Field>
                                {
                                    passwordOption === askPasswordOptionData.value
                                        ? renderAskPasswordOption()
                                        : null
                                }
                                <Form.Field>
                                    <Radio
                                        label={ createPasswordOptionData.label }
                                        data-testId={ createPasswordOptionData["data-testid"] }
                                        name="handlePasswordGroup"
                                        value={ createPasswordOptionData.value }
                                        checked={ passwordOption === createPasswordOptionData.value }
                                        onChange={ (e, item) => setPasswordOption(item?.value) }
                                    />
                                </Form.Field>
                                {
                                    passwordOption === createPasswordOptionData.value
                                        ? renderCreatePasswordOption()
                                        : null
                                }
                            </Grid.Column>
                        </Grid.Row>
                    ) : null
                }
            </Grid>
        </Forms>
    );

    return (
        <>
            { addUserBasicForm() }
        </>
    );
};

AddConsumerUserBasic.defaultProps = {
    hiddenFields: [],
    requestedPasswordOption: "ask-password"
};
