/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    ConfirmationModal,
    ContentLoader,
    CopyInputField,
    DocumentationLink,
    EmphasizedSegment,
    PageLayout,
    Popup,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Grid, Label, List, Ref } from "semantic-ui-react";
import { ApplicationManagementConstants } from "../../../../features/applications/constants";
import { AppConstants, AppState, history } from "../../../../features/core";
import { updateMyAccountMFAOptions, updateMyAccountStatus, useMyAccountData, useMyAccountStatus } from "../api";
import { MyAccountAttributeTypes } from "../constants";
import { MyAccountFormInterface, MyAccountPortalStatusInterface } from "../models";

/**
 * Props for my account settings page.
 */
type MyAccountSettingsEditPage = IdentifiableComponentInterface;

const FORM_ID: string = "my-account-settings-form";

/**
 * Governance connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns Governance connector listing page component.
 */
export const MyAccountSettingsEditPage: FunctionComponent<MyAccountSettingsEditPage> = (
    props: MyAccountSettingsEditPage
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const dispatch: Dispatch = useDispatch();
    const pageContextRef: MutableRefObject<HTMLElement> = useRef(null);
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const consumerAccountURL: string = useSelector((state: AppState) =>
        state?.config?.deployment?.accountApp?.tenantQualifiedPath);

    const [ isMyAccountEnabled, setMyAccountEnabled ] = useState<boolean>(AppConstants.DEFAULT_MY_ACCOUNT_STATUS);
    const [ isLoadingForTheFirstTime, setIsLoadingForTheFirstTime ] = useState<boolean>(true);
    const [ showMyAccountStatusEnableModal,
        setShowMyAccountStatusEnableConfirmationModal ] = useState<boolean>(false);
    const [ showMyAccountStatusDisableModal,
        setShowMyAccountStatusDisableConfirmationModal ] = useState<boolean>(false);
    const [ isSubmitting, setSubmitting ] = useState<boolean>(false);
    const [ initialFormValues, setInitialFormValues ] = useState<MyAccountFormInterface>(undefined);
    const [ isApplicationRedirect, setApplicationRedirect ] = useState<boolean>(false);

    const {
        data: myAccountStatus,
        isLoading: isMyAccountStatusLoading,
        error: myAccountStatusFetchRequestError,
        mutate: mutateMyAccountStatusFetchRequest
    } = useMyAccountStatus();

    const {
        data: myAccountData,
        isLoading: isMyAccountDataLoading,
        error: myAccountDataFetchRequestError,
        mutate: mutateMyAccountDataFetchRequest
    } = useMyAccountData();

    useEffect(() => {
        const locationState: unknown = history.location.state;

        if (locationState === ApplicationManagementConstants.APPLICATION_STATE) {
            setApplicationRedirect(true);
        }
    }, []);

    /**
     * Handles the my account status fetch request error.
     */
    useEffect(() => {

        if (!myAccountStatusFetchRequestError) {
            return;
        }

        if (myAccountStatusFetchRequestError.response
            && myAccountStatusFetchRequestError.response.data
            && myAccountStatusFetchRequestError.response.data.description) {
            if (myAccountStatusFetchRequestError.response.status === 404) {
                return;
            }
            dispatch(addAlert({
                description: myAccountStatusFetchRequestError.response.data.description ??
                    t("console:develop.features.applications.myaccount.fetchMyAccountStatus.error.description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.applications.myaccount.fetchMyAccountStatus.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:develop.features.applications.myaccount.fetchMyAccountStatus" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("console:develop.features.applications.myaccount.fetchMyAccountStatus" +
                ".genericError.message")
        }));
    }, [ myAccountStatusFetchRequestError ]);

    /**
     * Handles the my account data fetch request error.
     */
    useEffect(() => {

        if (!myAccountDataFetchRequestError) {
            return;
        }

        if (myAccountDataFetchRequestError.response
            && myAccountDataFetchRequestError.response.data
            && myAccountDataFetchRequestError.response.data.description) {
            if (myAccountDataFetchRequestError.response.status === 404) {
                return;
            }
            dispatch(addAlert({
                description: myAccountDataFetchRequestError.response.data.description ??
                    t("console:develop.features.applications.myaccount.fetchMyAccountData.error.description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.applications.myaccount.fetchMyAccountData.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:develop.features.applications.myaccount.fetchMyAccountData" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("console:develop.features.applications.myaccount.fetchMyAccountData" +
                ".genericError.message")
        }));
    }, [ myAccountDataFetchRequestError ]);

    /**
     * Sets the initial spinner.
     * TODO: Remove this once the loaders are finalized.
     */
    useEffect(() => {
        if (isMyAccountStatusLoading === false
            && isLoadingForTheFirstTime === true) {

            let status: boolean = AppConstants.DEFAULT_MY_ACCOUNT_STATUS;

            if (myAccountStatus) {
                const enableProperty: string = myAccountStatus["value"];

                if (enableProperty && enableProperty === "false") {
                    status = false;
                }
            }

            setMyAccountEnabled(status);
            setIsLoadingForTheFirstTime(false);
        }

        initializeForm();
    }, [ isMyAccountDataLoading, isMyAccountStatusLoading, isLoadingForTheFirstTime ]);

    const getMyAccountStatus = (attributeName: string): boolean => {
        const status: MyAccountPortalStatusInterface[] = myAccountData
            ?.attributes?.filter((attribute: MyAccountPortalStatusInterface) => attribute.key === attributeName);

        if (status?.length > 0) {
            // This will return false only if the value is false.
            // Otherwise, it will always return true.
            return status[0].value.toLowerCase() === "true";
        }

        return false;
    };

    const initializeForm = (): void => {
        setInitialFormValues({
            emailOtpEnabled: getMyAccountStatus(MyAccountAttributeTypes.EMAIL_OTP_ENABLED),
            smsOtpEnabled: getMyAccountStatus(MyAccountAttributeTypes.SMS_OTP_ENABLED),
            totpEnabled: getMyAccountStatus(MyAccountAttributeTypes.TOTP_ENABLED)
        });
    };

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = () => {
        if (isApplicationRedirect) {
            history.push(AppConstants.getPaths().get("APPLICATIONS"));

            return;
        }

        history.push(AppConstants.getPaths().get("MY_ACCOUNT"));
    };

    /**
     * Handles the My Account Portal status update action.
     *
     * @param e - SyntheticEvent of My Account toggle.
     * @param data - CheckboxProps of My Account toggle.
     */
    const handleMyAccountStatusToggle = (e: SyntheticEvent, data: CheckboxProps): void => {

        if (data.checked) {
            setShowMyAccountStatusEnableConfirmationModal(true);
        } else {
            setShowMyAccountStatusDisableConfirmationModal(true);
        }
    };

    /**
     * Renders a confirmation modal when the My Account Portal status is being enabled.
     * @returns My Account status enabling warning modal.
     */
    const renderMyAccountStatusEnableWarning = (): ReactElement => {

        return (
            <ConfirmationModal
                onClose={ (): void => setShowMyAccountStatusEnableConfirmationModal(false) }
                type="warning"
                open={ showMyAccountStatusEnableModal }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={
                    (): void => {
                        setShowMyAccountStatusEnableConfirmationModal(false);
                    }
                }
                onPrimaryActionClick={
                    (): void => {
                        setShowMyAccountStatusEnableConfirmationModal(false);
                        handleUpdateMyAccountStatus(true);
                    }
                }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("console:develop.features.applications.myaccount.Confirmation.enableConfirmation.heading") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                >
                    { t("console:develop.features.applications.myaccount.Confirmation.enableConfirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("console:develop.features.applications.myaccount.Confirmation.enableConfirmation.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    /**
     * Renders a confirmation modal when the My Account Portal status is being disabled.
     * @returns My Account status disabling warning modal.
     */
    const renderMyAccountStatusDisableWarning = (): ReactElement => {

        return (
            <ConfirmationModal
                onClose={ (): void => setShowMyAccountStatusDisableConfirmationModal(false) }
                type="warning"
                open={ showMyAccountStatusDisableModal }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={
                    (): void => {
                        setShowMyAccountStatusDisableConfirmationModal(false);
                    }
                }
                onPrimaryActionClick={
                    (): void => {
                        setShowMyAccountStatusDisableConfirmationModal(false);
                        handleUpdateMyAccountStatus(false);
                    }
                }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("console:develop.features.applications.myaccount.Confirmation.disableConfirmation.heading") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                >
                    { t("console:develop.features.applications.myaccount.Confirmation.disableConfirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("console:develop.features.applications.myaccount.Confirmation.disableConfirmation.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    /**
     * Update the My Account Portal status.
     *
     * @param status - New status of the My Account portal.
     */
    const handleUpdateMyAccountStatus = (status: boolean): void => {
        setSubmitting(true);
        updateMyAccountStatus(status)
            .then(() => {
                setMyAccountEnabled(status);
                mutateMyAccountStatusFetchRequest();
                dispatch(addAlert({
                    description: t("console:develop.features.applications.myaccount.notifications.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.myaccount.notifications.success.message")
                }));

            }).catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("console:develop.features.applications.myaccount.notifications.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("console:develop.features.applications.myaccount.notifications.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t(
                        "console:develop.features.applications.myaccount.notifications.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.myaccount.notifications.genericError.message")
                }));
            }).finally(() => {
                setSubmitting(false);
            });
    };

    /**
     * Update the My Account Portal Data.
     *
     * @param values - New data of the My Account portal.
     */
    const handleUpdateMyAccountData = (values: MyAccountFormInterface): void => {
        setSubmitting(true);
        updateMyAccountMFAOptions(values)
            .then(() => {
                mutateMyAccountDataFetchRequest();
                dispatch(addAlert({
                    description: t("console:develop.features.applications.myaccount.notifications.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.myaccount.notifications.success.message")
                }));
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("console:develop.features.applications.myaccount.notifications.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("console:develop.features.applications.myaccount.notifications.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t(
                        "console:develop.features.applications.myaccount.notifications.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.myaccount.notifications.genericError.message")
                }));
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    /**
     * Renders the URL for the tenanted my account login.
     *
     * @returns My Account link.
     */
    const renderTenantedMyAccountLink = (): ReactElement => {
        if (!isMyAccountEnabled) {
            return null;
        }

        return (
            <EmphasizedSegment
                className="m-0 pb-4 pt-4"
                data-componentid="my-account-link"
                padded={ "very" }
            >
                <List>
                    <List.Item>
                        <Grid verticalAlign="middle">
                            <Grid.Column
                                floated="left"
                                mobile={ 16 }
                                computer={ 10 }
                            >
                                <List.Description
                                    data-componentid="my-account-link-description"
                                >
                                    { t("extensions:manage.myAccount.editPage.myAccountUrlDescription") }
                                </List.Description>
                            </Grid.Column>
                            <Popup
                                trigger={
                                    (<Grid.Column
                                        mobile={ 16 }
                                        computer={ 6 }
                                    >
                                        <CopyInputField
                                            value={ consumerAccountURL }
                                            data-componentid={ "my-account-link-copy-field" }
                                        />
                                    </Grid.Column>)
                                }
                                content={ t("extensions:manage.myAccount.editPage.myAccountUrlDescription") }
                                position="top center"
                                size="mini"
                                hideOnScroll
                                inverted
                            />
                        </Grid>
                    </List.Item>
                </List>
            </EmphasizedSegment>
        );
    };

    return (
        <PageLayout
            pageTitle={ t("extensions:manage.myAccount.editPage.pageTitle") }
            title={ (
                <>
                    { t("extensions:manage.myAccount.editPage.pageTitle") }
                    <Label size="medium" className="preview-label ml-2">
                        { t("common:preview") }
                    </Label>
                </>
            ) }
            description={ (
                <>
                    { t("extensions:manage.myAccount.editPage.description") }
                    <DocumentationLink
                        link={ getLink("develop.applications.myaccount.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>
            ) }
            data-componentid={ `${ componentId }-page-layout` }
            backButton={ {
                "data-testid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: isApplicationRedirect ?
                    t("extensions:manage.myAccount.goBackToApplication")
                    : t("extensions:manage.myAccount.goBackToMyAccount")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
        >
            <Checkbox
                label={ isMyAccountEnabled ? t("extensions:manage.serverConfigurations.generalEnabledLabel") :
                    t("extensions:manage.serverConfigurations.generalDisabledLabel") }
                toggle
                onChange={ handleMyAccountStatusToggle }
                checked={ isMyAccountEnabled }
                data-testId={ `${ componentId }-enable-toggle` }
            />
            <Ref innerRef={ pageContextRef }>
                <Grid
                    className="mt-3"
                >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            { renderTenantedMyAccountLink() }
                            <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                                { !isMyAccountDataLoading ? (
                                    <Form
                                        id={ FORM_ID }
                                        initialValues={ initialFormValues }
                                        uncontrolledForm={ false }
                                        validate={ null }
                                        onSubmit={
                                            (values: MyAccountFormInterface) => handleUpdateMyAccountData(values)
                                        }
                                    >
                                        <Text>
                                            {
                                                t("extensions:manage.myAccount.editPage.mfaDescription")
                                            }
                                        </Text>
                                        <Field.Checkbox
                                            ariaLabel="emailOtpEnabled"
                                            name="emailOtpEnabled"
                                            label={ t("extensions:manage.myAccount.editPage.enableEmailOtp") }
                                            required={ false }
                                            disabled={ !isMyAccountEnabled }
                                            width={ 16 }
                                            data-testid={ `${ componentId }-email-otp-toggle` }
                                        />
                                        { /* Disabled until SMS OTP is onboarded */ }
                                        { /* <Field.Checkbox
                                            ariaLabel="smsOtpEnabled"
                                            name="smsOtpEnabled"
                                            label={ t("extensions:manage.myAccount.editPage.enableSmsOtp") }
                                            required={ false }
                                            disabled={ !isMyAccountEnabled }
                                            width={ 16 }
                                            data-testid={ `${ componentId }-sms-otp-toggle` }
                                        /> */
                                        }
                                        <Field.Checkbox
                                            ariaLabel="totpEnabled"
                                            name="totpEnabled"
                                            label={ t("extensions:manage.myAccount.editPage.enableTotp") }
                                            required={ false }
                                            disabled={ !isMyAccountEnabled }
                                            width={ 16 }
                                            data-testid={ `${ componentId }-totp-toggle` }
                                        />
                                        <Field.Button
                                            form={ FORM_ID }
                                            size="small"
                                            buttonType="primary_btn"
                                            ariaLabel="Self registration update button"
                                            name="update-button"
                                            data-testid={ `${ componentId }-submit-button` }
                                            disabled={ !isMyAccountEnabled }
                                            loading={ isSubmitting }
                                            label={ t("common:update") }
                                            hidden={ !isMyAccountEnabled }
                                        />
                                    </Form>
                                ) : <ContentLoader/>
                                }
                            </EmphasizedSegment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Ref>
            { showMyAccountStatusEnableModal && renderMyAccountStatusEnableWarning() }
            { showMyAccountStatusDisableModal && renderMyAccountStatusDisableWarning() }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
MyAccountSettingsEditPage.defaultProps = {
    "data-componentid": "my-account-settings-edit-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default MyAccountSettingsEditPage;
