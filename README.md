# Trivia Card Component

The Trivia Card is a Lightning Web Component (LWC) that allows users to view and interact with trivia questions. It provides the ability to create new trivia, view existing trivia, and answer trivia questions.

## Features

- Display a card header with a title and an animated icon.
- Create new trivia by clicking the "Create New Trivia" button.
- Progress through different steps using a progress indicator.
- Fill in the title and description for the trivia.
- Add trivia questions, options, and select the correct answer.
- Ability to add multiple trivia questions.
- Responsive and intuitive user interface.
- Modal or popup box layout with a header, body, and footer.
- Buttons to navigate between steps and to cancel or finish the trivia creation.
- View a list of existing trivia with their names and descriptions.
- Start answering a trivia by clicking the "Start" button.
- Display trivia questions and multiple-choice options.
- Select an option by clicking the radio buttons.
- Submit the answers and view the results.
- Cancel answering a trivia at any time.


## Usage

1. Install the Trivia Card component in your Salesforce org.
2. Include the Trivia Modal/Popup Box LWC in your component or LWC.
3. Bind the necessary attributes and event handlers to the Trivia Modal/Popup Box LWC for interaction.
4. Configure the necessary variables and data structures to handle the trivia creation process.
5. Include the component in your Lightning App or Lightning Page.

## Component Structure

The Trivia Card component consists of the following parts:

- **Card Header**: 
  - Displays the title "Trivia" along with an animated icon. It also includes a button to create new trivia.
- **Trivia List**: 
  - Displays a list of existing trivia with their names and descriptions. Clicking the "Start" button allows users to answer the selected trivia.
- **Trivia Questions**: 
  - Displays the trivia questions and multiple-choice options. Users can select an option for each question.
- **Footer**:
  - Includes buttons to cancel answering a trivia or submit the answers.
- **Trivia Modal**: 
  - The component uses a modal (not shown in this code) to handle the creation of new trivia.

The Trivia Modal/Popup Box LWC consists of the following parts:

- **Modal/Popup Box Container**:
  - Contains the entire modal or popup box structure.
- **Modal/Popup Box Header**:
  - Displays the title of the modal or popup box.
- **Modal/Popup Box Body**:
  - Contains the content of the modal or popup box, including the progress indicator and different steps of trivia creation.
- **Modal/Popup Box Footer**:
  - Displays buttons for canceling, navigating, and finishing the trivia creation.
- **Backdrop**:
  - Provides a backdrop for the modal or popup box.


## Component Manifest

**ApexClass**
- TriviaHandler

**CustomField**
- Trivia_Info__c.Is_Verified__c
- Trivia_Info__c.Trivia_Description__c
- Trivia_Question__c.Correct_Answer__c
- Trivia_Question__c.Option_A__c
- Trivia_Question__c.Option_B__c
- Trivia_Question__c.Option_C__c
- Trivia_Question__c.Question__c
- Trivia_Question__c.Trivia_Info__c

**CustomObject**
- Trivia_Info__c
- Trivia_Question__c

**LightningComponentBundle**
- triviaMain
- triviaModal

## Development

To contribute to the Trivia Card component, follow these steps:

1. Clone the repository: `git clone https://github.com/your/repo.git`
2. Make changes and add features to the component.
3. Test the component thoroughly.
4. Create a pull request and submit it for review.

## License

This project is licensed.