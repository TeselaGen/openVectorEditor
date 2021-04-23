/// <reference types="cypress" />


interface waitForOptions {
  timeout?: number;
}

declare namespace Cypress {
  interface Chainable<Subject = any> {
    // /**
    //  * login
    //  * creates a new user and lab, logs in with the user and sets
    //  * the lab as active
    //  * @example
    //  * cy.login()
    //  */
    // login(): void;

    /**
     * triggerFileCmd
     * Triggers a cmd using the Help menu search
     * @example
     * cy.triggerFileCmd("Select All")
     * cy.triggerFileCmd("Digest")
     */
    triggerFileCmd(text: string): void;
    
    /**
     * waits for .bp3-dialog to not exist
     * @example
     * cy.waitForDialogClose()
     */
    waitForDialogClose(options: waitForOptions): void;
    /**
     * waits for .bp3-menu to not exist
     * @example
     * cy.waitForMenuClose()
     */
    waitForMenuClose(options: waitForOptions): void;

    /**
     * closes the dialog and waits for .bp3-dialog to not exist
     * @example
     * cy.closeDialog()
     */
    closeDialog(options: waitForOptions): void;


    /**
     * This command will close all open toastr messages by clicking each one's X
     * @example
     * cy.closeToasts()
     */
    closeToasts(): void;

    /**
     * Hides an open .bp3-menu or popover
     * @example
     * cy.hideMenu()
     */
    hideMenu(): void;
    
    /**
     * selectRange
     * selects a 1 based range of the sequence
     * @example
     * cy.selectRange(10, 20) 
     * //user would see this as: "Selecting 11 bps from 10 to 20"
     */
    selectRange(start, end): void;
    /**
     * dragBetweenSimple
     * drags between 2 els
     * @example
     * cy.dragBetweenSimple('.someEl', '.anotherEl') 
     * //user would see this as: "Selecting 11 bps from 10 to 20"
     */
    dragBetweenSimple(startEl, endEl): void;
    /**
     * dragBetween
     * drags between 2 els
     * @example
     * cy.dragBetween('.someEl', '.anotherEl') 
     * //user would see this as: "Selecting 11 bps from 10 to 20"
     */
    dragBetween(startEl, endEl): void;
    
    /**
     * selectAlignmentRange
     * selects a 1 based range of the alignment
     * @example
     * cy.selectAlignmentRange(10, 20) 
     * //user would see this as: "Selecting 11 bps from 10 to 20"
     */
    selectAlignmentRange(start, end): void;

    
    /**
     * scrollAlignmentToPercent
     * selects a 1 based range of the alignment
     * @example
     * cy.scrollAlignmentToPercent(10, 20) 
     * //user would see this as: "Selecting 11 bps from 10 to 20"
     */
    scrollAlignmentToPercent(percent): void;

    

    /**
     * tgToggle
     * toggle a demo switch
     * @example
     * cy.tgToggle("propertiesOverridesExample")  //defaults to true
     * cy.tgToggle("propertiesOverridesExample", false) 
     * 
     */
    tgToggle(toggleId: string, toggleOnOrOff: boolean): void;

    
    // /**
    //  * chainable waitForBackendCalls
    //  * waits for backend xhr requests to complete
    //  * @example
    //  * cy.get("body").click().await()
    //  */
    // await(): void;

    // /**
    //  * waits for bounce loader to not exist
    //  * @example
    //  * cy.waitForBounceLoader()
    //  */
    // waitForBounceLoader(): void;

    // /**
    //  * waits for spinner to not exist
    //  * @example
    //  * cy.waitForSpinner()
    //  */
    // waitForSpinner(): void;

    // /**
    //  * waits for dna loader to not exist
    //  * @example
    //  * cy.waitForDnaLoader()
    //  */
    // waitForDnaLoader(): void;

    // /**
    //  * chains waitForBackendCalls
    //  * off of another command
    //  * @example
    //  * cy.get("button").click().await()
    //  */
    // condWaitLoad(options: condWaitLoadOptions): void;

    // /**
    //  * selectCurrentLab
    //  * selects the current lab in a dialog with lab selection
    //  * @example
    //  * cy.selectCurrentLab()
    //  */
    // selectCurrentLab(): void;

    // /**
    //  * goToRoute
    //  * uses react router to navigate the app instead of triggering
    //  * a full page reload with cy.visitWait()
    //  * @example
    //  * cy.goToRoute("/samples")
    //  */
    // goToRoute(route: string): void;

    // /**
    //  * upsert
    //  * graphql mutation - seeds sample data into the database
    //  * @example
    //  * cy.upsert("samples", { name: "test" })
    //  */
    // upsert(model: string, data: object | Array<object>): void;

    // /**
    //  * createAndGoToNewDesign
    //  * creates a new design (golden gate by default) for the lab group of the user and navigates to it
    //  * TODO: add ability to choose different designs as well as pass a design name and other data
    //  * @example
    //  * cy.createAndGoToNewDesign()
    //  */
    // createAndGoToNewDesign(): string;

    // /**
    //  * del
    //  * graphql mutation - deletes data from the database
    //  * @example
    //  * cy.del("samples", ["1"])
    //  */
    // del(model: string, data: string | Array<string>): void;
  }
}
