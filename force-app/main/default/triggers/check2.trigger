trigger check1 on People_in_Seminar__c (before insert) 
{
	if(trigger.isbefore)
    {
        if(trigger.isinsert)
        {
            check1.count12(trigger.new);
        }
    }
}