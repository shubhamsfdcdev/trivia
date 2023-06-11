/**
 * @description Represents the TriviaModal component used for creating new trivia questions.
 * @track annotation is used to track changes to the properties.
 */
import { LightningElement, wire, track } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CORRECT_ANSWER from '@salesforce/schema/Trivia_Question__c.Correct_Answer__c';
import TRIVIA_OBJECT from '@salesforce/schema/Trivia_Question__c';
import createTriviaInfo from '@salesforce/apex/TriviaHandler.createTriviaInfo';
import createTriviaQARecords from '@salesforce/apex/TriviaHandler.createTriviaQARecords';
export default class TriviaModal extends LightningElement {

    /** This variable indicates whether the First Page of trivia modal is currently being shown or not.*/
    primaryPageFlag = true;
    /** Tracks the progress step of the component */
    progressStep = '1';
    /** Holds the value of the new trivia title input field */
    newTriviaTitle 
    /** Holds the value of the new trivia description textarea */
    newTriviaDescription
    /** Holds the new trivia data in an array of objects */
    @track newTrivia =[
        {
            "Id":"1",
            "Trivia_Info__c":"",
            "Question__c":"",
            "Option_A__c":"",
            "Option_B__c":"",
            "Option_C__c":"",
            "Correct_Answer__c":""
        }
    ]

    /** 
     *  Method to handle hiding the modal by firing event.
     *  Sets the 'primaryPageFlag' property to true, which sets the first page on modal.
     *  Sets the 'progressStep' property to 1, which sets the progress indicator to initial stage on modal.
     */
    hideModalHandler(){
        this.primaryPageFlag = true;
        this.progressStep = '1';

        const event = new CustomEvent('hidemodal');
        this.dispatchEvent(event);
    }

    /**
     * Retrieves object information and picklist values for a Trivia object.
     * Uses wire adapters to make the server calls and handle the responses.
     */
    @wire(getObjectInfo,{objectApiName:TRIVIA_OBJECT})
    objectInfo
    @wire(getPicklistValues,{recordTypeId:'$objectInfo.data.defaultRecordTypeId', fieldApiName:CORRECT_ANSWER})
    correctAnswerPicklist({data,error}){
        if(data){
            this.correctOptionPicklist = [...this.generateCorrectAnswerPicklist(data)]
        }
        if(error){
            console.error('Error retrieving picklist values:', error);
        }
    }

    /**
     * Generates a picklist based on the provided data.
     * @param {Object} data - The picklist data received from the server.
     * @returns {Array} - An array of objects representing the picklist values.
     */
    generateCorrectAnswerPicklist(data){
        return data.values.map(item=>({label: item.label, value: item.value}))
    }

    /**
     * Handles the next button click event.
     * Retrieves input field values and performs necessary actions.
     */
    nextHandler(){
        /** Retrieves all 'lightning-input' elements within the component's template. */
        let inputFields = this.template.querySelectorAll("lightning-input");
        inputFields.forEach(element=>{
            if(element.name === 'newTriviaTitle'){
                this.newTriviaTitle = element.value;
            }
        });
        /** If title is null/blank then return and throw error */
        if(this.newTriviaTitle == ''){
            this.showToast('Required field missing!!', 'Please enter trivia title.', 'error');
            return;
        }else{
            this.primaryPageFlag = false;
            this.progressStep = '2';
            /** Retrieves the value of the 'lightning-textarea' element within the component's template and assigns it to the 'newTriviaDescription' property. */
            this.newTriviaDescription = this.template.querySelector("lightning-textarea").value;
            /** Calls the 'createTriviaInfo' Apex method to create a new Trivia Info record with the provided title and description. */
            createTriviaInfo({triviaInfoTitle : this.newTriviaTitle, triviaInfoDescription : this.newTriviaDescription})
            .then(result => {
                this.newTrivia[0].Trivia_Info__c = result;
            })
            .catch(error => {
                this.showToast('Required field!', 'Please reach out to System Administrator.', 'error');
                console.error(error);
             });
        }
    }

    /**
     * Handles the question, options and correct answer input change event and updates the question, options and correct answer value in the 'newTrivia' array based on the provided index.
     * @param {Event} event - The question, options and correct answer input change event.
     */
    handleQuestion(event){
        const { index } = event.target.dataset;
        this.newTrivia[index].Question__c = event.target.value;
    }
    handleOptionA(event){
        const { index } = event.target.dataset;
        this.newTrivia[index].Option_A__c = event.target.value;
    }
    handleOptionB(event){
        const { index } = event.target.dataset;
        this.newTrivia[index].Option_B__c = event.target.value;
    }
    handleOptionC(event){
        const { index } = event.target.dataset;
        this.newTrivia[index].Option_C__c = event.target.value;
    }
    handleCorrectAnswer(event){
        const { index } = event.target.dataset;
        this.newTrivia[index].Correct_Answer__c = event.target.value;
    }

    /**
     * Handles adding a new entry to the 'newTrivia' array.
     * Creates a new object with default values and pushes it to the array.
     */
    addNewEntryHandler(){
        const newIndex = this.newTrivia.length + 1;
        this.newTrivia.push({
            "Id": newIndex,
            "Trivia_Info__c":this.newTrivia[0].Trivia_Info__c,
            "Question__c":"",
            "Option_A__c":"",
            "Option_B__c":"",
            "Option_C__c":"",
            "Correct_Answer__c":""
        });
    }

    /**
     * Handles the previous button click event.
     * Sets the 'primaryPageFlag' property to true and the 'progressStep' property to '1'.
     */
    previousHandler(){
        this.primaryPageFlag = true;
        this.progressStep = '1';
    }

    /**
     * Handles the finish button click event.
     * Calls the 'createTriviaQARecords' Apex method to create Trivia QA records with the data from the 'newTrivia' array.
     * Performs necessary actions based on the result.
     */
    finishHandler(){
        createTriviaQARecords({triviaList : this.newTrivia})
        .then(result => {
            this.showToast('New trivia created successfully!', 'You can access new trivia by refreshing Page.', 'success');
            /** Resetting every property back to initial state */
            this.progressStep = '1';
            this.primaryPageFlag = true;
            this.newTriviaTitle = '';
            this.newTriviaDescription = '';
            this.newTrivia.splice(0);
            this.newTrivia =[
                {
                    "Id":"1",
                    "Trivia_Info__c":"",
                    "Question__c":"",
                    "Option_A__c":"",
                    "Option_B__c":"",
                    "Option_C__c":"",
                    "Correct_Answer__c":""
                }
            ]
            const event = new CustomEvent('hidemodal');
            this.dispatchEvent(event);
        })
        .catch(error => {
            this.showToast('An error occured!', 'Please reach out to System Administrator.', 'error');
            console.error(error);
         });
    }
    
    /** 
     * Method to display a toast notification.
     * Creates a new ShowToastEvent with the provided title, message, and variant parameters.
     * Dispatches the toast event to display the notification.
     * @param {String} title - The title of the toast notification.
     * @param {String} message - The message or content of the toast notification.
     * @param {String} variant - The variant or type of the toast notification (e.g., success, error, warning, info).
     */
    showToast(title, message, variant){
        const toastEvent = new ShowToastEvent({
          title: title,
          message: message,
          variant: variant
        });
        this.dispatchEvent(toastEvent);
    }
}