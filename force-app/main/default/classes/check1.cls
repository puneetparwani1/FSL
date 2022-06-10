public class check1 
{
	public static void count12(List<People_in_Seminar__c> nList)
    {
       
       	List<AggregateResult> oList=[Select Count(Id)  from People_in_Seminar__c Group By Seminar_With_People_in_Seminar__c];
        Integer count;    
        String id='';
        for(AggregateResult ar:oList)
        {
            count=(Integer)ar.get('expr0');
         
        }
        count=count+1;
        Integer wLcount=1;
        for(People_in_Seminar__c p:nList)
        {
        	id=(String)p.Seminar_With_People_in_Seminar__c; 
        }
        Waiting_List__c wL=new Waiting_List__c(Seminar_Waiting_List__c=id,Name ='WL1');
        insert wL;
        for(People_in_Seminar__c p:nList)
        {
      		if(count>12)
        	{
                
            	p.addError('Not More than 12 Person added in Seminar');
          
        	}
            
         }       
 }
    public static void waitingList(List<Waiting_List__c > sList)
    {
   		 
    	
        	list<Waiting_List__c> wlc = [select Seminar_Waiting_List__r.id from Waiting_List__c ];
        	for(Waiting_List__c w:wlc)
        	{
            	if(w.Seminar_Waiting_List__c==sList[0].Seminar_Waiting_List__c)
            	{
                	sList[0].addError('Sry cant create');
            	}
        	}  
     	
    }
    
}