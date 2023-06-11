/**
 * The TriviaHandler class is a public Apex class that handles various operations related to trivia information and questions.
 * This class is designed to work with Aura components, and it is marked with the @AuraEnabled annotation to allow remote access from the UI layer.
 * The class enforces the sharing rules specified in the organization's security settings by using the with sharing keyword.
 */
public with sharing class TriviaHandler {
    
    /**
     * Retrieves a list of verified trivia information records.
     * This method is annotated with @AuraEnabled to enable remote access from the UI.
     * The results of this method are cacheable on the client side.
     * @return List of Trivia_Info__c records containing the Id, Name, Trivia_Description__c, and Is_Verified__c fields.
     * @throws AuraHandledException if any exception occurs during the execution of the SOQL query.
     */
    @AuraEnabled(cacheable=true)
    public static List<Trivia_Info__c> getTriviaInfo(){
        try {
            return [SELECT Id, Name, Trivia_Description__c, Is_Verified__c 
                    FROM Trivia_Info__c 
                    WHERE Is_Verified__c = TRUE WITH SECURITY_ENFORCED];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
     * Retrieves a list of trivia questions associated with a specific trivia information record.
     * This method is annotated with @AuraEnabled to enable remote access from the UI.
     * The results of this method are cacheable on the client side.
     * @param triviaInfoId The Id of the trivia information record for which to retrieve the associated questions.
     * @return List of Trivia_Question__c records containing the Id, Name, Trivia_Info__c, Question__c, Option_A__c, Option_B__c, Option_C__c, Correct_Answer__c, and Default__c fields.
     * @throws AuraHandledException if any exception occurs during the execution of the SOQL query.
     */
    @AuraEnabled(cacheable=true)
    public static List<Trivia_Question__c> getTriviaQuestions(Id triviaInfoId){
        try {
            return [SELECT Id, Name, Trivia_Info__c, Question__c, Option_A__c, Option_B__c, Option_C__c, Correct_Answer__c, Default__c 
                    FROM Trivia_Question__c 
                    WHERE Trivia_Info__c =: triviaInfoId WITH SECURITY_ENFORCED];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
     * Creates a new trivia information record with the specified title and description.
     * This method is annotated with @AuraEnabled to enable remote access from the UI.
     * @param triviaInfoTitle The title of the new trivia information record.
     * @param triviaInfoDescription The description of the new trivia information record.
     * @return The Id of the newly created Trivia_Info__c record.
     * @throws AuraHandledException if any exception occurs during the creation of the record.
     */
    @AuraEnabled
    public static Id createTriviaInfo(String triviaInfoTitle, string triviaInfoDescription){
        try {
            Trivia_Info__c objTI = new Trivia_Info__c();
            objTI.Name = triviaInfoTitle;
            objTI.Trivia_Description__c = triviaInfoDescription;
            if(Schema.sObjectType.Trivia_Info__c.isCreateable()){
                insert objTI;
            }
            return objTI.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
     * Creates new trivia question records based on the provided list.
     * This method is annotated with @AuraEnabled to enable remote access from the UI.
     * @param triviaList The list of Trivia_Question__c records to create.
     * @throws AuraHandledException if any exception occurs during the creation or update of the records.
     */
    @AuraEnabled
    public static void createTriviaQARecords(List<Trivia_Question__c> triviaList){
        List<Trivia_Question__c> newTriviaList = new List<Trivia_Question__c>();
        if(!triviaList.isEmpty() && triviaList.size()>0){
            for(Trivia_Question__c objTrivia : triviaList){
                Trivia_Question__c objTri = new Trivia_Question__c();
                objTri.Trivia_Info__c = objTrivia.Trivia_Info__c;
                objTri.Question__c = objTrivia.Question__c;
                objTri.Option_A__c = objTrivia.Option_A__c;
                objTri.Option_B__c = objTrivia.Option_B__c;
                objTri.Option_C__c = objTrivia.Option_C__c;
                objTri.Correct_Answer__c = objTrivia.Correct_Answer__c;
                newTriviaList.add(objTri);
            }
        }
        try {
            if(!newTriviaList.isEmpty() && newTriviaList.size()>0 && Schema.sObjectType.Trivia_Question__c.isCreateable()){
                insert newTriviaList;
            }
            if(!newTriviaList.isEmpty() && newTriviaList.size()>0 && Schema.sObjectType.Trivia_Info__c.isUpdateable()){
                Trivia_Info__c objTI = new Trivia_Info__c();
                objTI.Id = triviaList[0].Trivia_Info__c;
                objTI.Is_Verified__c = true;
                update objTI;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}