/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { UserstoreConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { getUserNameWithoutDomain, hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    SBACInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    Popup,
    TableActionsInterface,
    TableColumnInterface,
    UserAvatar,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, Label, ListItemProps, SemanticICONS } from "semantic-ui-react";
import {
    AppState,
    FeatureConfigInterface,
    UIConstants,
    UserRoleInterface,
    getEmptyPlaceholderIllustrations,
    history
} from "../../../../../features/core";
import {
    PatchRoleDataInterface,
    updateRoleDetails
} from "../../../../../features/roles";
import { RealmConfigInterface } from "../../../../../features/server-configurations";
import { UserManagementConstants } from "../../../../../features/users/constants";
import {
    InternalAdminUserListInterface,
    UserBasicInterface,
    UserListInterface
} from "../../../../../features/users/models";
import { SCIMConfigs } from "../../../../configs/scim";
import { deleteGuestUser } from "../../api";
import { AdminAccountTypes, UserAccountTypes, UsersConstants } from "../../constants";
import { UserManagementUtils } from "../../utils";

/**
 * Prop types for the onboarded collaborator users list component.
 */
interface OnboardedGuestUsersListProps extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    IdentifiableComponentInterface {

    /**
     * Admin account type.
     */
    adminType?: AdminAccountTypes;
    /**
     * Role ID for administator.
     */
    adminRoleId?: string;
    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * On user delete callback.
     *
     * @param userId - ID of the deleting user.
     */
    onUserDelete?: () => void;
    /**
     * Callback to inform the new set of visible columns.
     * @param columns - New columns for the accepted admins table.
     */
    onColumnSelectionChange?: (columns: TableColumnInterface[]) => void;
    /**
     * Callback to be fired when the empty list placeholder action is clicked.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, data: ListItemProps) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Admin user details content.
     */
    realmConfigs: RealmConfigInterface;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show/Hide meta content.
     */
    showMetaContent?: boolean;
    /**
     * Meta column list for the user list.
     */
    userMetaListContent?: Map<string, string>;
    /**
     * Users list.
     */
    onboardedGuestUsersList: UserListInterface | InternalAdminUserListInterface;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
}

/**
 * Onboarded guest users list component.
 *
 * @returns the react component for the onboarded/accepted admins list.
 */
export const OnboardedGuestUsersList: React.FunctionComponent<OnboardedGuestUsersListProps> = (
    props: OnboardedGuestUsersListProps): ReactElement => {

    const {
        adminType,
        adminRoleId,
        advancedSearch,
        defaultListItemLimit,
        onUserDelete,
        isLoading,
        readOnlyUserStores,
        featureConfig,
        onColumnSelectionChange,
        onListItemClick,
        onSearchQueryClear,
        realmConfigs,
        searchQuery,
        selection,
        showListItemActions,
        onboardedGuestUsersList,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface | UserRoleInterface>(undefined);
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();
    const [ usersList, setUsersList ] = useState<UserListInterface | InternalAdminUserListInterface>({});
    const [ loading, setLoading ] = useState(false);

    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    /**
     * Set users list.
     */
    useEffect(() => {
        if (!onboardedGuestUsersList) {
            setUsersList({});

            return;
        }

        setUsersList(onboardedGuestUsersList);
    }, [ onboardedGuestUsersList ]);

    const handleUserEdit = (user: UserBasicInterface | UserRoleInterface) => {
        if ("id" in user) {
            history.push(UsersConstants.getPaths().get("COLLABORATOR_USER_EDIT_PATH").replace(":id", user.id));
        }

        if ("value" in user) {
            history.push(UsersConstants.getPaths().get("COLLABORATOR_USER_EDIT_PATH").replace(":id", user.value));
        }
    };

    const handleUserDelete = (user: UserBasicInterface | UserRoleInterface): Promise<void> => {
        const accountType: string = user[ SCIMConfigs.scim.enterpriseSchema ]?.userAccountType
            ? user[ SCIMConfigs.scim.enterpriseSchema ]?.userAccountType
            : UserAccountTypes.CUSTOMER;

        if (accountType === UserAccountTypes.COLLABORATOR && "id" in user) {
            return deleteGuestUser(user.id)
                .then(() => {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.invite.notifications.deleteInvite.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.users.notifications.deleteUser.success.message"
                        )
                    }));
                    onUserDelete();
                }).catch((error: IdentityAppsApiException) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.users.notifications.deleteUser.error.message")
                        }));

                        return;
                    }
                    dispatch(addAlert({
                        description: t("console:manage.features.users.notifications.deleteUser." +
                            "genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.users.notifications.deleteUser.genericError" +
                            ".message")
                    }));
                }).finally(() => {
                    setLoading(false);
                    setShowDeleteConfirmationModal(false);
                    setDeletingUser(undefined);
                });
        } else if (accountType === UserAccountTypes.CUSTOMER && "display" in user) {
            // Payload for the update role request.
            const roleData: PatchRoleDataInterface = {
                Operations: [
                    {
                        op: "remove",
                        path: `users[display eq ${user.display}]`,
                        value: {}
                    }
                ],
                schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
            };

            return updateRoleDetails(adminRoleId, roleData)
                .then(() => {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.invite.notifications.deleteInvite.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.users.notifications.deleteUser.success.message"
                        )
                    }));
                    onUserDelete();
                })
                .catch((error: IdentityAppsApiException) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.users.notifications.deleteUser.error.message")
                        }));

                        return;
                    }
                    dispatch(addAlert({
                        description: t("console:manage.features.users.notifications.deleteUser." +
                            "genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.users.notifications.deleteUser.genericError" +
                            ".message")
                    }));
                }).finally(() => {
                    setLoading(false);
                    setShowDeleteConfirmationModal(false);
                    setDeletingUser(undefined);
                });
        }
    };

    /**
     * Resolves data table columns.
     *
     * @returns the columns of the accepted admin users table.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        const defaultColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (user: UserBasicInterface): ReactNode => {
                    const header: string = UserManagementUtils.resolveUserListHeader(user);
                    const subHeader: string = UserManagementUtils.resolveUserListSubheader(user);
                    const isNameAvailable: boolean = user.name?.familyName !== undefined ||
                        user.name?.givenName !== undefined;

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <UserAvatar
                                data-componentid="users-list-item-image"
                                name={ user.userName.split("/")?.length > 1
                                    ? user.userName.split("/")[ 1 ]
                                    : user.userName.split("/")[ 0 ]
                                }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                                data-suppress=""
                            />
                            <Header.Content>
                                { header }
                                { resolveOwnershipLabel(user) }
                                { resolveMyselfLabel(user) }
                                {
                                    (isNameAvailable) &&
                                        (<Header.Subheader
                                            data-componentid={ `${ componentId }-item-sub-heading` }
                                        >
                                            { subHeader }
                                        </Header.Subheader>)
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "User"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "idpType",
                id: "idpType",
                key: "idpType",
                render: (user: UserBasicInterface): ReactNode => {
                    if (user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType) {
                        if (user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType.split("/").length > 1) {
                            return user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType.split("/")[1];
                        }

                        return user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType;
                    } else {
                        return "N/A";
                    }
                },
                title: (
                    <>
                        <div className={ "header-with-popup" }>
                            <span>
                                { t("extensions:manage.users.list.columns.idpType") }
                            </span>
                            <Popup
                                trigger={ (
                                    <div className="inline" >
                                        <Icon disabled name="info circle" className="link pointing pl-1" />
                                    </div>
                                ) }
                                content={ t("extensions:manage.users.list.popups.content.idpTypeContent") }
                                position="top center"
                                size="mini"
                                hideOnScroll
                                inverted
                            />
                        </div>
                    </>
                )
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: ""
            }
        ];

        const internalAdminColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (user: UserRoleInterface): ReactNode => {
                    const username: string = user.display.split("/")?.length > 1
                        ? user.display.split("/")[ 1 ]
                        : user.display.split("/")[ 0 ];

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <UserAvatar
                                data-componentid="users-list-item-image"
                                name={ username }
                                size="mini"
                                spaced="right"
                                data-suppress=""
                            />
                            <Header.Content>
                                { username }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "User"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: ""
            }
        ];

        return adminType === AdminAccountTypes.INTERNAL ? internalAdminColumns : defaultColumns;
    };

    /**
     * Resolves data table actions.
     *
     * @returns actions of the accepted admin users table.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        // TODO: Add edit option for internal users onboarded as admins.
        const actions: TableActionsInterface[] = [
            {
                "data-componentid": "administrators-list-item-edit-button",
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_READ")),
                icon: (user: UserBasicInterface): SemanticICONS => {
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : "PRIMARY";

                    return (
                        !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                    || adminType === AdminAccountTypes.EXTERNAL)
                        ? "eye"
                        : "pencil alternate";

                },
                onClick: (e: SyntheticEvent, user: UserBasicInterface | UserRoleInterface): void =>
                    handleUserEdit(user),
                popupText: (user: UserBasicInterface): string => {
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : "PRIMARY";

                    return (
                        !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                    || adminType === AdminAccountTypes.EXTERNAL)
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            }
        ];

        actions.push({
            "data-componentid": "administrators-list-item-delete-button",
            hidden: (user: UserBasicInterface): boolean => {
                const userStore: string = user?.userName?.split("/").length > 1
                    ? user?.userName?.split("/")[0]
                    : UserstoreConstants.PRIMARY_USER_STORE;

                return !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE"))
                    || isPrivilegedUser
                    || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.delete, allowedScopes)
                    || readOnlyUserStores?.includes(userStore.toString())
                    || (adminType === AdminAccountTypes.EXTERNAL
                    && (getUserNameWithoutDomain(user?.userName) === realmConfigs?.adminUser
                    || authenticatedUser?.includes(getUserNameWithoutDomain(user?.userName))));
            },
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, user: UserBasicInterface | UserRoleInterface): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingUser(user);
            },
            popupText: (): string => t("console:manage.features.users.usersList.list.iconPopups.delete"),
            renderer: "semantic-icon"
        });

        return actions;
    };

    /**
     * Resolves ownership label of admins.
     * @param user - admin user object.
     *
     * @returns - The label indication of the ownership within the table.
     */
    const resolveOwnershipLabel = (user: UserBasicInterface): ReactNode => {
        if (adminType === AdminAccountTypes.EXTERNAL &&
            user[ SCIMConfigs.scim.enterpriseSchema ]?.userAccountType === UserAccountTypes.OWNER) {
            return (
                <Label size="small">
                    Owner
                </Label>
            );
        }

        return null;
    };

    /**
     * Returns a label if your own account is listed.
     *
     * @param user - each admin user belonging to a row of the table.
     * @returns the label indication of your own account.
     */
    const resolveMyselfLabel = (user: UserBasicInterface): ReactNode => {
        if (adminType === AdminAccountTypes.INTERNAL || authenticatedUser?.split("@").length < 3) {
            return null;
        }
        // Extracting the current username from authenticatedUser.
        const currentUsername: string = authenticatedUser?.split("@").slice(0, 2).join("@");

        if (currentUsername === getUserNameWithoutDomain(user?.userName)) {
            return (
                <Label size="small">
                    Me
                </Label>
            );
        }

        return null;
    };

    /**
     * Shows list placeholders.
     *
     * @returns placeholder for empty admins list
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && usersList?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("console:manage.features.users.usersList.search.emptyResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.features.users.usersList.search.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("console:manage.features.users.usersList.search.emptyResultPlaceholder.subTitle.0",
                            { query: searchQuery }),
                        t("console:manage.features.users.usersList.search.emptyResultPlaceholder.subTitle.1")
                    ] }
                />
            );
        }

        if (usersList?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    data-componentid={ `${ componentId }-empty-placeholder` }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [ "There are no collaborator users associated with your organization at the moment." ] }
                />
            );
        }

        return null;
    };

    return (
        <>
            <DataTable<UserBasicInterface>
                className="users-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "circular"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ usersList.Resources }
                onColumnSelectionChange={ onColumnSelectionChange }
                onRowClick={ (e: SyntheticEvent, user: UserBasicInterface): void => {
                    handleUserEdit(user);
                    onListItemClick && onListItemClick(e, user);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ true }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-componentid={ componentId }
            />
            {
                deletingUser && (
                    <ConfirmationModal
                        primaryActionLoading={ loading }
                        data-componentid={ `${ componentId }-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("console:manage.features.user.deleteUser.confirmationModal.assertionHint") }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => {
                            setShowDeleteConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ (): void => {
                            setLoading(true);
                            handleUserDelete(deletingUser);
                        } }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-componentid={ `${ componentId }-confirmation-modal-header` }>
                            { t("console:manage.features.user.deleteUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-componentid={ `${ componentId }-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { t("extensions:manage.guest.deleteUser.confirmationModal.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-componentid={ `${ componentId }-confirmation-modal-content` }>
                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                            { t("extensions:manage.guest.deleteUser.confirmationModal.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
OnboardedGuestUsersList.defaultProps = {
    selection: true,
    showListItemActions: true,
    showMetaContent: true
};
