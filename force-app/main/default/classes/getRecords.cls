public with sharing class getRecords 
{
    @AuraEnabled(cacheable=true)
    public static List<Class__c> getClass()
    {
        return [Select Name,Id from Class__c];
    }
    @AuraEnabled(cacheable=true)
    public static List<Student_Modern__c> getStudent(String Id)
    {
        String id1=(String)Id;
        return [Select S_No__c,Roll_No__c,Name,Student_in_class__r.Id,Marks__c from Student_Modern__c where Student_in_class__r.Id=:id1];
    }
}
