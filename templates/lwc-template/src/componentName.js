/**
 * Template JavaScript file for Lightning Web Component
 * 
 * Replace 'ComponentName' with your actual component name (PascalCase)
 * This file contains the component controller logic
 */

import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Import any Apex methods needed
// import getDataFromApex from '@salesforce/apex/ControllerClass.getDataFromApex';

// Import custom labels (if needed)
// import CUSTOM_LABEL from '@salesforce/label/c.Custom_Label_Name';

export default class ComponentName extends LightningElement {
    
    // Public Properties (accessible from parent components)
    @api title = 'Default Title';
    @api showHeader = true;
    @api showFooter = false;
    @api showInput = true;
    @api showActions = true;
    @api footerText = 'Component Footer';
    
    // Private Properties (internal component state)
    @track isLoading = false;
    @track hasError = false;
    @track errorMessage = '';
    @track inputValue = '';
    @track dataList = [];
    
    // Computed Properties
    get hasData() {
        return this.dataList && this.dataList.length > 0;
    }
    
    get isActionDisabled() {
        return this.isLoading || !this.inputValue;
    }
    
    // Lifecycle Hooks
    connectedCallback() {
        console.log('Component connected');
        this.initializeComponent();
    }
    
    disconnectedCallback() {
        console.log('Component disconnected');
        // Clean up any resources, event listeners, etc.
    }
    
    renderedCallback() {
        // Called after every render of the component
        // Use sparingly as it can cause performance issues
    }
    
    errorCallback(error, stack) {
        console.error('Component error:', error);
        this.handleError('An unexpected error occurred', error);
    }
    
    // Wire Methods (for reactive data)
    /*
    @wire(getDataFromApex, { parameter: '$inputValue' })
    wiredData({ error, data }) {
        if (data) {
            this.handleWiredDataSuccess(data);
        } else if (error) {
            this.handleWiredDataError(error);
        }
    }
    */
    
    // Public Methods (accessible from parent components)
    @api
    refreshData() {
        this.loadData();
    }
    
    @api
    resetComponent() {
        this.inputValue = '';
        this.dataList = [];
        this.hasError = false;
        this.errorMessage = '';
    }
    
    @api
    validateInput() {
        // Custom validation logic
        if (!this.inputValue || this.inputValue.trim() === '') {
            this.showToast('Error', 'Input value is required', 'error');
            return false;
        }
        return true;
    }
    
    // Private Methods
    initializeComponent() {
        try {
            // Initialize component state
            this.resetComponent();
            
            // Load initial data if needed
            // this.loadData();
            
        } catch (error) {
            this.handleError('Failed to initialize component', error);
        }
    }
    
    async loadData() {
        this.isLoading = true;
        this.hasError = false;
        
        try {
            // Example: Call Apex method
            // const result = await getDataFromApex({ parameter: this.inputValue });
            
            // Example: Simulate async operation
            const result = await this.simulateAsyncOperation();
            
            this.dataList = result;
            this.showToast('Success', 'Data loaded successfully', 'success');
            
        } catch (error) {
            this.handleError('Failed to load data', error);
        } finally {
            this.isLoading = false;
        }
    }
    
    simulateAsyncOperation() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: '1', label: 'Item 1', description: 'Description for item 1' },
                    { id: '2', label: 'Item 2', description: 'Description for item 2' },
                    { id: '3', label: 'Item 3', description: 'Description for item 3' }
                ]);
            }, 1000);
        });
    }
    
    // Event Handlers
    handleInputChange(event) {
        this.inputValue = event.target.value;
        
        // Dispatch custom event to parent
        this.dispatchEvent(new CustomEvent('inputchange', {
            detail: {
                value: this.inputValue,
                isValid: this.inputValue.trim() !== ''
            }
        }));
    }
    
    handlePrimaryAction() {
        if (!this.validateInput()) {
            return;
        }
        
        // Perform primary action
        this.loadData();
        
        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('primaryaction', {
            detail: {
                action: 'primary',
                value: this.inputValue,
                timestamp: new Date().toISOString()
            }
        }));
    }
    
    handleSecondaryAction() {
        // Perform secondary action
        this.resetComponent();
        
        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('secondaryaction', {
            detail: {
                action: 'secondary',
                timestamp: new Date().toISOString()
            }
        }));
    }
    
    // Utility Methods
    handleError(message, error) {
        console.error(message, error);
        this.hasError = true;
        this.errorMessage = message;
        this.isLoading = false;
        
        // Show toast notification
        this.showToast('Error', message, 'error');
        
        // Dispatch error event to parent
        this.dispatchEvent(new CustomEvent('error', {
            detail: {
                message: message,
                error: error,
                timestamp: new Date().toISOString()
            }
        }));
    }
    
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant, // success, error, warning, info
            mode: 'dismissable' // dismissable, pester, sticky
        });
        this.dispatchEvent(event);
    }
    
    // Helper Methods for Wired Data
    /*
    handleWiredDataSuccess(data) {
        this.dataList = data;
        this.hasError = false;
        this.isLoading = false;
    }
    
    handleWiredDataError(error) {
        this.handleError('Failed to load wired data', error);
    }
    */
}