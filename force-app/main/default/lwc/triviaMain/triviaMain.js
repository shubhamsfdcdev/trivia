/**
 * @description Represents the TriviaMain component used to display trivia information.
 */
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getTriviaInfo from '@salesforce/apex/TriviaHandler.getTriviaInfo';
import getTriviaQuestions from '@salesforce/apex/TriviaHandler.getTriviaQuestions';

export default class TriviaHome extends LightningElement {

    /** This variable indicates whether the trivia modal is currently being shown or not.*/
    isModalOpen = false;

    /** This variable indicates whether the trivia questions are currently being shown or not.*/
    showTriviaQuestions = false;
    
    /** Holds the list of trivia questions.*/
    triviaList

    /** Represents the value of the trivia title. It stores the Id of the trivia title/name record.*/
    triviaTitleId

    /** Stores the selected options or answers for the trivia questions. This variable is used to track the user's selected choices.*/
    selectedOptions = {}

    /**
     * Method decorated with @wire to fetch trivia information from an Apex method 'getTriviaInfo'.
     * The @wire decorator enables reactive data retrieval and ensures the component is updated whenever the data changes.
     * The retrieved trivia information is stored in the 'triviaInfo' property, which can be accessed within the component's template or JavaScript logic.
     */    
    @wire(getTriviaInfo)
    triviaInfo

    /**
     * Handler method triggered when the user starts Trivia.
     * Sets the 'showTriviaQuestions' property to true, indicating that the trivia questions should be displayed.
     * Uses the 'getTriviaQuestions' Apex method to fetch the trivia data asynchronously based on the selected trivia title.
     * Stores the fetched trivia data in the 'triviaList' property.
     * If an error occurs during the data retrieval, it is logged to the console.
     * @param {Event} event - The event triggered when when the user starts trivia.
     */
    showTriviaQuestionsHandler(event){
        this.showTriviaQuestions = true;
        this.triviaTitleId = event.target.name;
        getTriviaQuestions({triviaInfoId: this.triviaTitleId})
        .then(result => {
            this.triviaList = result
        })
        .catch(error => {
            console.error(error)
        });
    }

    /**
     * Handler method triggered when the user selects an option in the trivia questions.
     * Extracts the 'name' and 'value' from the target of the event.
     * Updates the 'selectedOptions' object by merging the existing options with the new option.
     * @param {Event} event - The event triggered when the user selects an option.
     */
    changeHandler(event){
        const{name, value} = event.target
        this.selectedOptions = {...this.selectedOptions,[name]:value}
    }

    /**
     * Method to disable submit button.
     * Check total number of questions answered with question list.
     */
    get isSubmitDisabled() {
        return !(Object.keys(this.selectedOptions).length == this.triviaList.length);
    }

    /**
     * Handler method triggered when the user submits the trivia.
     * Checks the selected options against the correct answers in the 'triviaList'.
     * Filters the 'triviaList' based on the correct answers and assigns the result to 'correct' variable.
     * Sets the 'validationResult' property to the number of correct answers.
     * If all answers are correct, displays a success toast notification and hides the trivia questions.
     * If some answers are incorrect, displays a warning toast notification with the number of correct answers.
     * Sets text color for div element depending upon the outcome.
     * @param {Event} event - The event triggered when the user submits the trivia.
     */
    submitHandler(event){
        let correct = this.triviaList.filter(item => this.selectedOptions[item.Id] === item.Correct_Answer__c)
        this.validationResult = correct.length
        if(correct.length === this.triviaList.length){
            this.showToast('Congratulations!', 'All answers are correct.', 'success');
            this.showTriviaQuestions = false;
            this.selectedOptions = {};
        }else{
            this.showToast('Better Luck Next Time!', correct.length+' out of '+this.triviaList.length+' are correct.', 'warning');
            // Find wrong answers
            let wrongAnswers = this.triviaList.filter(item => this.selectedOptions[item.Id] !== item.Correct_Answer__c);
            let wrongAnswerIds = wrongAnswers.map(item => item.Id);
            // Perform action for each wrong answer
            wrongAnswerIds.forEach(wrongAnswerId => {
                let divElement = this.template.querySelector(`[name="${wrongAnswerId}"]`);
                divElement.style.color = 'red';
            });

            // Find correct answers
            let correctAnswers = this.triviaList.filter(item => this.selectedOptions[item.Id] === item.Correct_Answer__c);
            let correctAnswerIds = correctAnswers.map(item => item.Id);
            // Perform action for each correct answer
            correctAnswerIds.forEach(correctAnswerId => {
                let divElement = this.template.querySelector(`[name="${correctAnswerId}"]`);
                divElement.style.color = 'green';
            });
        }
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

    /**
     * Method to handle hiding the trivia questions.
     * Sets the 'showTriviaQuestions' property to false, which hides the questions.
     */
    cancelHandler(){
        this.showTriviaQuestions = false;
    }

    /**
     * Method to handle hiding the modal.
     * Sets the 'isModalOpen' property to false, which hides the modal.
     */
    hideModalHandler(){
        this.isModalOpen = false;
    }

    /**
     * Method to handle showing the modal.
     * Sets the 'isModalOpen' property to true, which displays the modal.
     */
    showModalHandler(){
        this.isModalOpen = true;
    }
}