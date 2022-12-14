/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { 
    DocumentationLink,
    GenericIcon,
    Heading,
    Link,
    Message,
    PageHeader,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import BuildLoginFlowIllustration from "./assets/build-login-flow.png";
import CustomizeStepsIllustration from "./assets/customize-steps.png";
import { VerticalStepper, VerticalStepperStepInterface } from "../../component-extensions";
import ApplicationSelectionModal from "../../shared/application-selection-modal";

/**
 * Prop types of the component.
 */
type FIDOQuickStartPropsInterface = TestableComponentInterface;

/**
 * Quick start content for the FIDO authenticator.
 *
 * @param {FIDOQuickStartPropsInterface} props - Props injected into the component.
 *
 * @return {React.ReactElement}
 */
const FIDOQuickStart: FunctionComponent<FIDOQuickStartPropsInterface> = (
    props: FIDOQuickStartPropsInterface
): ReactElement => {

    const {
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ showApplicationModal, setShowApplicationModal ] = useState<boolean>(false);

    /**
     * Vertical Stepper steps.
     * @return {VerticalStepperStepInterface[]}
     */
    const steps: VerticalStepperStepInterface[] = [
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={
                                "extensions:develop.identityProviders.fido.quickStart.steps.selectApplication.content"
                            }
                        >
                            Choose the <Link external={ false } onClick={ () => setShowApplicationModal(true) }>
                                application </Link>
                            for which you want to set up FIDO login.
                        </Trans>
                    </Text>
                </>
            ),
            stepTitle: t("extensions:develop.identityProviders.fido.quickStart.steps.selectApplication.heading")
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={ "extensions:develop.identityProviders.fido.quickStart.steps.selectFIDO.content" }
                        >
                            Go to <strong>Sign-in Method</strong> tab and click on <strong>Add Security Key/Biometrics
                            login</strong> to configure a basic FIDO flow.
                        </Trans>
                    </Text>
                    <GenericIcon inline transparent icon={ BuildLoginFlowIllustration } size="huge"/>
                </>
            ),
            stepTitle: (
                <Trans i18nKey="extensions:develop.identityProviders.fido.quickStart.steps.selectFIDO.heading">
                    Select <strong>Add Security Key/Biometrics login</strong>
                </Trans>
            )
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey="extensions:develop.identityProviders.fido.quickStart.steps.customizeFlow.content"
                        >
                            Continue to configure the login flow as required.
                        </Trans>
                    </Text>
                    <GenericIcon inline transparent icon={ CustomizeStepsIllustration } size="huge"/>
                </>
            ),
            stepTitle: t("extensions:develop.identityProviders.fido.quickStart.steps.customizeFlow.heading")
        }
    ];

    return (
        <>
            <Grid data-testid={ testId } className="authenticator-quickstart-content">
                <Grid.Row textAlign="left">
                    <Grid.Column width={ 16 }>
                        <PageHeader
                            className="mb-2"
                            imageSpaced={ false }
                            bottomMargin={ false }
                            title={ t("extensions:develop.identityProviders.fido.quickStart.heading") }
                        />
                        <Heading subHeading as="h6">
                            { t("extensions:develop.identityProviders.fido.quickStart.subHeading") }
                        </Heading>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign="left">
                    <Grid.Column width={ 16 }>
                        <VerticalStepper
                            alwaysOpen
                            isSidePanelOpen
                            stepContent={ steps }
                            isNextEnabled={ true }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Grid data-componentid={ `${ testId }-passkeys` }>
                <div className="mt-3 mb-6">
                    <Message
                        type={ "info" }
                        header={ t("extensions:develop.identityProviders.fido.quickStart.passkeys.heading") }
                        content={ 
                            (<>
                                { t("extensions:develop.identityProviders.fido.quickStart.passkeys.content") }
                                <DocumentationLink 
                                    link={ getLink("develop.connections.edit.quickStart.fido.learnMore") }
                                >
                                    { t("extensions:develop.identityProviders.fido.quickStart.passkeys.docLinkText") }
                                </DocumentationLink>
                            </>)
                        }
                    />
                </div>
            </Grid>
            {
                showApplicationModal && (
                    <ApplicationSelectionModal
                        data-testid={ `${ testId }-application-selection-modal` }
                        open={ showApplicationModal }
                        onClose={ () => setShowApplicationModal(false) }
                        heading={ t("extensions:develop.identityProviders.fido.quickStart.addLoginModal.heading") }
                        subHeading={
                            t("extensions:develop.identityProviders.fido.quickStart.addLoginModal.subHeading")
                        }
                        data-componentid="connections"
                    />
                )
            }
        </>
    );
};

/**
 * Default props for the component
 */
FIDOQuickStart.defaultProps = {
    "data-testid": "FIDO-authenticator-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default FIDOQuickStart;
