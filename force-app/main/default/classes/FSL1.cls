public  class FSL1 
{
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getRecords() 
    {
        List<Opportunity> oppList=[Select Name,Id,StageName From Opportunity];
        return oppList;
    }
    @AuraEnabled(cacheable=true)
    public static List<sObject> getIdFile(String i)
    {
        String id=(String)i;
        List<ContentDocumentLink> noteList=[Select contentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =:id];
        String j=(String)noteList[0].contentDocumentId;
        List<sObject> noteList1=[Select Title,Id  from ContentDocument where Id =:j];       
        return noteList1;
    }
    @AuraEnabled
    public static void  getDeleteFile(String i)
    {
        String id=(String)i;
        List<sObject> delList=[Select id from ContentDocument where Id=:id];
        delete delList;
    }
   

    @AuraEnabled(cacheable=true)
        public static Map<ID, String> getRelatedFilesByRecordId(String recordId) {
            // Get record file IDs        
            String recordID1=(String)recordId;
            List<ContentDocumentLink> files = [Select ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordID1];
            List<ID> fileIDs = new List<ID>();
            for (ContentDocumentLink docLink : files) {
                fileIDs.add(docLink.ContentDocumentId);
            }
     
            List<ContentVersion> docs = [Select ContentDocumentId, FileExtension, Title 
                FROM ContentVersion WHERE ContentDocumentId IN : fileIDs];
            Map<ID, String> mapIdTitle = new Map<ID, String>();
            for (ContentVersion docLink : docs) {
                mapIdTitle.put(docLink.ContentDocumentId, docLink.Title);
            }
            return mapIdTitle;
        }
    
    
    
    @AuraEnabled
    public static String uploadFile(String base64, String filename, String recordId) 
    {
        ContentVersion cv = createContentVersion(base64, filename);
        ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
        if (cv == null || cdl == null) { return null; }
        return cdl.Id;
    }
    @AuraEnabled
    public static String sendEmail(String i,String mail)
    {
        //Document doc = [SELECT Id,Name FROM Document WHERE Name = 'Sample'];

        String id=(String)i;
        String m=(String)mail;
        List<ContentVersion> cvList = [Select Id,VersionData, FileExtension FROM ContentVersion WHERE ContentDocumentId = :id];

        String id1=(String)cvList[0].Id;
		Messaging.SingleEmailMessage semail = new Messaging.SingleEmailMessage();
        semail.setEntityAttachments(new string[]{id1});
        semail.setSubject('Sending Document as attachemnt');
        String[] sendTo = new String[]{m};
        semail.setToAddresses(sendTo);
        semail.setPlainTextBody('Please find the attached document details');
        Messaging.sendEmail(new Messaging.SingleEmailMessage[]{semail});

		return 'success';
        
    }
  public static ContentVersion createContentVersion(String base64, String filename) 
  {
    ContentVersion cv = new ContentVersion();
    cv.VersionData = EncodingUtil.base64Decode(base64);
    cv.Title = filename;
    cv.PathOnClient = filename;
    try {
      insert cv;
      return cv;
    } catch(DMLException e) {
      System.debug(e);
      return null;
    }
  }
  public static ContentDocumentLink createContentLink(String contentVersionId, String recordId) 
  {
    if (contentVersionId == null || recordId == null) { return null; }
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [Select ContentDocumentId FROM ContentVersion WHERE Id =: contentVersionId].ContentDocumentId;
        cdl.LinkedEntityId = recordId;
        cdl.ShareType = 'V';
        try 
        {
            insert cdl;
            return cdl;
        } 
        catch(DMLException e) 
        {
            System.debug(e);
            return null;
        }
    }
}
