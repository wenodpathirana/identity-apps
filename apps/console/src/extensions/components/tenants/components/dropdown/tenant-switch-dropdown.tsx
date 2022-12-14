/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert, setTenants } from "@wso2is/core/store";
import { SessionStorageUtils } from "@wso2is/core/utils";
import { GenericIcon, Popup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Dropdown, Grid, Icon, Input, Item, Loader, Segment } from "semantic-ui-react";
import { getMiscellaneousIcons } from "../../../../../features/core";
import OrganizationSwitcherList from
    "../../../../../features/organizations/components/organization-switch/organization-switch-list";
import { OrganizationManagementConstants } from "../../../../../features/organizations/constants";
import { OrganizationInterface } from "../../../../../features/organizations/models";
import { ReactComponent as CrossIcon } from "../../../../../themes/default/assets/images/icons/cross-icon.svg";
import { getAssociatedTenants } from "../../api";
import { TenantInfo, TenantRequestResponse } from "../../models";
import { AddTenantWizard } from "../add-modal";

/**
 * Interface for component dropdown.
 */
type TenantSwitchDropdownInterface = IdentifiableComponentInterface;

const TenantSwitchDropdown: FunctionComponent<TenantSwitchDropdownInterface> = (
    props: TenantSwitchDropdownInterface
): ReactElement => {
    const { "data-componentid": componentId } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ associatedOrganizations, setAssociatedOrganizations ] = useState<OrganizationInterface[]>([]);
    const [ filteredOrganizations, setFilteredOrganizations ] = useState<OrganizationInterface[]>([]);
    const [ isDropDownOpen, setIsDropDownOpen ] = useState<boolean>(false);
    const [ search, setSearch ] = useState<string>("");
    const [ isOrganizationsLoading, setIsOrganizationsLoading ] = useState<boolean>(false);
    const [ showNewOrgWizard, setShowNewOrgWizard ] = useState<boolean>(false);

    const headerOrganization: OrganizationInterface = {
        ...OrganizationManagementConstants.ROOT_ORGANIZATION,
        name: "Organizations"
    };

    /**
     * Handles the pagination change.
     *
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (): void => {
        getOrganizationList();
    };

    const getOrganizationList:  () => Promise<void> = useCallback(async () => {
        setIsOrganizationsLoading(true);
        getAssociatedTenants()
            .then((response: TenantRequestResponse) => {
                const tenants: OrganizationInterface[] = [];

                response.associatedTenants.forEach((tenant: TenantInfo) => {
                    if (window[ "AppUtils" ].getConfig().tenant === tenant.domain) {
                        return;
                    }

                    tenants.push({
                        id: tenant.id,
                        name: tenant.domain,
                        ref: tenant.id,
                        status: "ACTIVE"
                    });
                });

                dispatch(setTenants<TenantInfo>(response.associatedTenants));
                setAssociatedOrganizations(tenants);
                setFilteredOrganizations(tenants);
            })
            .catch((error: any) => {
                dispatch(
                    addAlert({
                        description:
                            error?.description &&
                            t("extensions:manage.features.tenant.notifications." + "getTenants.description"),
                        level: AlertLevels.ERROR,
                        message:
                            error?.description &&
                            t("extensions:manage.features.tenant.notifications." + "getTenants.message")
                    })
                );
            })
            .finally(() => {
                setIsOrganizationsLoading(false);
            });
    }, []);

    /**
     * Search the tenant list.
     *
     * search - search string
     *
     */
    const searchTenantList = (search: string): void => {
        if (associatedOrganizations && Array.isArray(associatedOrganizations)) {
            let result: OrganizationInterface[];

            if (search !== "") {
                result = associatedOrganizations.filter(
                    (item: OrganizationInterface) => item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
                );
            } else {
                result = associatedOrganizations;
            }

            setFilteredOrganizations(result);
        }
    };

    useEffect(() => {
        if (!isDropDownOpen) {
            return;
        }

        getOrganizationList();
    }, [ getOrganizationList, isDropDownOpen ]);

    /**
     * Resets the dropdown states.
     */
    const resetTenantDropdown = (): void => {
        setIsDropDownOpen(false);
    };

    const handleNewClick = (): void => {
        setIsDropDownOpen(false);
        setShowNewOrgWizard(true);
    };

    const closeNewOrgWizard = (): void => {
        setShowNewOrgWizard(false);
    };

    const handleCurrentOrgClick = (): void => {
        setIsDropDownOpen(!isDropDownOpen);
    };

    const tenantDropdownTrigger = (): ReactElement => (
        <div
            className="item breadcrumb"
            onClick={ (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation() }
        >
            <span
                onClick={ () => setIsDropDownOpen(!isDropDownOpen) }
                className="super"
                data-componentid={ `${ componentId }-dropdown-trigger` }
            >
                <GenericIcon
                    transparent
                    data-componentid="component-dropdown-trigger-icon"
                    data-testid="tenant-dropdown-trigger-icon"
                    icon={ getMiscellaneousIcons().tenantIcon }
                    size="micro"
                    floated="left"
                />
                <Icon name="caret down" className="separator-icon" />
            </span>
        </div>
    );

    /**
     * Handle the tenant switch action and redirect the user to the selected
     * tenant path of the console.
     *
     * @param tenantName - The tenant being switched to.
     */
    const handleTenantSwitch = (tenant: OrganizationInterface): void => {
        const newOrgPath: string =
            window[ "AppUtils" ].getConfig().clientOrigin +
            "/t/" +
            tenant.name +
            "/" +
            window[ "AppUtils" ].getConfig().appBase +
            "?disable_silent_sign_in=true&switch_tenant=true";

        // Clear the callback url of the previous organization.
        SessionStorageUtils.clearItemFromSessionStorage("auth_callback_url_console");

        // Redirect the user to the newly selected organization path.
        window.location.replace(newOrgPath);
    };

    return (
        <>
            { showNewOrgWizard
                && <AddTenantWizard openModal={ showNewOrgWizard } onCloseHandler={ closeNewOrgWizard } /> }
            <Dropdown
                onBlur={ resetTenantDropdown }
                item
                floating
                pointing="top left"
                className="tenant-dropdown breadcrumb"
                data-componentid={ `${ componentId }-organization-dropdown` }
                open={ isDropDownOpen }
                onClick={ handleCurrentOrgClick }
                trigger={ tenantDropdownTrigger() }
                icon={ null }
            >
                <Dropdown.Menu
                    className="organization-dropdown-menu"
                    onClick={ (e: SyntheticEvent) => e.stopPropagation() }
                >
                    { isDropDownOpen && (
                        <>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 12 } verticalAlign="middle">
                                        <h5> Organizations </h5>
                                    </Grid.Column>
                                    <Grid.Column width={ 4 }>
                                        <Show when={ AccessControlConstants.ORGANIZATION_WRITE }>
                                            <Button
                                                basic
                                                floated="right"
                                                onClick={ handleNewClick }
                                                data-componentid={ `${ componentId }-new-button` }
                                            >
                                                <Icon name="add" />
                                                { t("common:new") }
                                            </Button>
                                        </Show>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Segment basic secondary>
                                <Item.Group className="search-bar">
                                    <div className="advanced-search-wrapper aligned-left fill-default">
                                        <Input
                                            className="advanced-search with-add-on"
                                            data-componentid={ `${ componentId }-search-box` }
                                            icon="search"
                                            iconPosition="left"
                                            value={ search }
                                            onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {
                                                setSearch(event.target.value);
                                            } }
                                            onKeyDown={ (event: React.KeyboardEvent) => {
                                                event.key === "Enter" && searchTenantList(search);
                                                event.stopPropagation();
                                            } }
                                            placeholder={ t(
                                                "console:manage.features.organizations.switching.search.placeholder"
                                            ) }
                                            floated="right"
                                            size="small"
                                            action={
                                                search ? (
                                                    <Popup
                                                        trigger={ (
                                                            <Button
                                                                data-componentid={ `${ componentId }-clear-button` }
                                                                basic
                                                                compact
                                                                className="input-add-on organizations"
                                                                onClick={ () => {
                                                                    setSearch("");
                                                                    searchTenantList("");
                                                                } }
                                                            >
                                                                <GenericIcon
                                                                    size="nano"
                                                                    defaultIcon
                                                                    transparent
                                                                    icon={ CrossIcon }

                                                                />
                                                            </Button>
                                                        ) }
                                                        position="top center"
                                                        content={ t("console:common.advancedSearch.popups.clear") }
                                                        inverted={ true }
                                                    />
                                                ) : null
                                            }
                                        />
                                    </div>
                                </Item.Group>
                                { filteredOrganizations ? (
                                    isOrganizationsLoading ? (
                                        <Segment basic>
                                            <Loader active inline="centered" />
                                        </Segment>
                                    ) : (
                                        <OrganizationSwitcherList
                                            organizations={ filteredOrganizations }
                                            handleOrgRowClick={ null }
                                            handleBackButtonClick={ null }
                                            parents={ [] }
                                            hasMore={ false }
                                            currentOrganization={ headerOrganization }
                                            loadMore={ handlePaginationChange }
                                            setShowDropdown={ setIsDropDownOpen }
                                            handleOrganizationSwitch={ handleTenantSwitch }
                                            showEdit={ false }
                                        />
                                    )
                                ) : null }
                            </Segment>
                        </>
                    ) }
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default TenantSwitchDropdown;

TenantSwitchDropdown.defaultProps = {
    "data-componentid": "organization-switch-dropdown"
};
