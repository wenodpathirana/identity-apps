/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { resolveUserDisplayName, resolveUserEmails } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    MultiValueAttributeInterface,
    ProfileInfoInterface,
    emptyProfileInfo
}from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EditAvatarModal, PageLayout, UserAvatar } from "@wso2is/react-components";
import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getProfileInformation } from "../../../../features/authentication";
import {
    AppState,
    FeatureConfigInterface,
    SharedUserStoreUtils,
    history
} from "../../../../features/core";
import { getGovernanceConnectors } from "../../../../features/server-configurations/api";
import { ServerConfigurationsConstants } from "../../../../features/server-configurations/constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "../../../../features/server-configurations/models";
import { getUserDetails, updateUserInfo } from "../../../../features/users/api";
import { UserManagementUtils } from "../../../../features/users/utils";
import { ConsumerUsersConstants } from "../consumer-users-constants";
import { EditConsumerUser } from "../edit-consumer-user";

/**
 * Consumer user Edit page.
 *
 * @returns consumer user edit page component.
 */
const ConsumerUserEditPage = (): ReactElement => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);

    const [ user, setUserProfile ] = useState<ProfileInfoInterface>(emptyProfileInfo);
    const [ isUserDetailsRequestLoading, setIsUserDetailsRequestLoading ] = useState<boolean>(false);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ showEditAvatarModal, setShowEditAvatarModal ] = useState<boolean>(false);
    const [ connectorProperties, setConnectorProperties ] = useState<ConnectorPropertyInterface[]>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        const properties: ConnectorPropertyInterface[] = [];

        getGovernanceConnectors(ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID)
            .then((response: GovernanceConnectorInterface[]) => {
                response.map((connector) => {
                    if (connector.id === ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID
                        || connector.id === ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_CONNECTOR_ID) {
                        connector.properties.map((property) => {
                            properties.push(property);
                        });
                    }
                });

                getGovernanceConnectors(ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                    .then((response: GovernanceConnectorInterface[]) => {
                        response.map((connector) => {
                            if (connector.id === ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID) {
                                connector.properties.map((property) => {
                                    if (property.name === ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION) {
                                        properties.push(property);
                                    }
                                });
                            }
                        });

                        setConnectorProperties(properties);
                    });
            });

    }, []);

    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        getUser(id);
    }, []);

    useEffect(() => {
        SharedUserStoreUtils.getReadOnlyUserStores().then((response) => {
            setReadOnlyUserStoresList(response);
        });
    }, [ user ]);

    const getUser = (id: string) => {
        setIsUserDetailsRequestLoading(true);

        getUserDetails(id, null)
            .then((response) => {
                setUserProfile(response);
            })
            .catch(() => {
                // TODO add to notifications
            })
            .finally(() => {
                setIsUserDetailsRequestLoading(false);
            });
    };

    const handleUserUpdate = (id: string) => {
        getUser(id);

        if (UserManagementUtils.isAuthenticatedUser(profileInfo?.userName, user?.userName)) {
            dispatch(getProfileInformation());
        }
    };

    const handleBackButtonClick = () => {
        history.push(ConsumerUsersConstants.getPaths().get("CONSUMER_USERS_PATH"));
    };

    /**
     * Handles edit avatar modal submit action.
     *
     * @param e - Event.
     * @param url - Selected image URL.
     */
    const handleAvatarEditModalSubmit = (e: MouseEvent<HTMLButtonElement>, url: string): void => {
        const data = {
            Operations: [
                {
                    op: "replace",
                    value: {
                        profileUrl: url
                    }
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        setIsSubmitting(true);

        updateUserInfo(user?.id, data)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "console:manage.features.user.profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.user.profile.notifications.updateProfileInfo.success.message"
                    )
                }));

                handleUserUpdate(user?.id);
            })
            .catch((error) => {
                if (error.response
                    && error.response.data
                    && (error.response.data.description || error.response.data.detail)) {

                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description || error.response.data.detail,
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.user.profile.notifications.updateProfileInfo.error.message"
                        )
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "console:manage.features.user.profile.notifications.updateProfileInfo.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.user.profile.notifications.updateProfileInfo.genericError.message"
                    )
                }));
            })
            .finally(() => {
                setShowEditAvatarModal(false);
                setIsSubmitting(false);
            });
    };

    /**
     * This function resolves the primary email of the user.
     *
     * @param emails - User emails.
     */
    const resolvePrimaryEmail = (emails: (string | MultiValueAttributeInterface)[]): string => {
        let primaryEmail: string | MultiValueAttributeInterface = "";

        if (emails && Array.isArray(emails) && emails.length > 0) {
            primaryEmail = emails.find((value) => typeof value === "string");
        }

        return primaryEmail as string;
    };

    return (
        <PageLayout
            isLoading={ isUserDetailsRequestLoading }
            title={ resolveUserDisplayName(user, null, "User") }
            description={ t("" + user.emails && user.emails !== undefined ? resolvePrimaryEmail(user?.emails) :
                user.userName) }
            image={ (
                <UserAvatar
                    editable
                    name={ resolveUserDisplayName(user) }
                    size="tiny"
                    image={ user?.profileUrl }
                    onClick={ () => setShowEditAvatarModal(true) }
                />
            ) }
            backButton={ {
                "data-testid": "user-mgt-edit-user-back-button",
                onClick: handleBackButtonClick,
                text: t("console:manage.pages.usersEdit.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditConsumerUser
                featureConfig={ featureConfig }
                user={ user }
                handleUserUpdate={ handleUserUpdate }
                readOnlyUserStores={ readOnlyUserStoresList }
                connectorProperties={ connectorProperties }
            />
            {
                showEditAvatarModal && (
                    <EditAvatarModal
                        open={ showEditAvatarModal }
                        name={ resolveUserDisplayName(user) }
                        emails={ resolveUserEmails(user?.emails) }
                        onClose={ () => setShowEditAvatarModal(false) }
                        closeOnDimmerClick={ false }
                        onCancel={ () => setShowEditAvatarModal(false) }
                        isSubmitting={ isSubmitting }
                        onSubmit={ handleAvatarEditModalSubmit }
                        imageUrl={ profileInfo?.profileUrl }
                        heading={ t("console:common.modals.editAvatarModal.heading") }
                        submitButtonText={ t("console:common.modals.editAvatarModal.primaryButton") }
                        cancelButtonText={ t("console:common.modals.editAvatarModal.secondaryButton") }
                        translations={ {
                            gravatar: {
                                errors: {
                                    noAssociation: {
                                        content: t("console:common.modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.content"),
                                        header: t("console:common.modals.editAvatarModal.content.gravatar.errors" +
                                            ".noAssociation.header")
                                    }
                                },
                                heading: t("console:common.modals.editAvatarModal.content.gravatar.heading")
                            },
                            hostedAvatar: {
                                heading: t("console:common.modals.editAvatarModal.content.hostedAvatar.heading"),
                                input: {
                                    errors: {
                                        http: {
                                            content: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.http.content"),
                                            header: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.http.header")
                                        },
                                        invalid: {
                                            content: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.invalid.content"),
                                            pointing: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.errors.invalid.pointing")
                                        }
                                    },
                                    hint: t("console:common.modals.editAvatarModal.content.hostedAvatar.input.hint"),
                                    placeholder: t("console:common.modals.editAvatarModal.content." +
                                        "hostedAvatar.input.placeholder"),
                                    warnings: {
                                        dataURL: {
                                            content: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.warnings.dataURL.content"),
                                            header: t("console:common.modals.editAvatarModal.content." +
                                                "hostedAvatar.input.warnings.dataURL.header")
                                        }
                                    }
                                }
                            },
                            systemGenAvatars: {
                                heading: t("console:common.modals.editAvatarModal.content.systemGenAvatars.heading"),
                                types: {
                                    initials: t("console:common.modals.editAvatarModal.content.systemGenAvatars." +
                                        "types.initials")
                                }
                            }
                        } }
                    />
                )
            }
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConsumerUserEditPage;
