import { LightningElement} from 'lwc';

import getClass from '@salesforce/apex/getRecords.getClass';
import getStudent from '@salesforce/apex/getRecords.getStudent';

const columns = [
    { label: 'S.No', fieldName: 'S_No__c', editable:true},
    { label: 'Roll.No', fieldName: 'Roll_No__c'},
    { label: 'Name', fieldName: 'Name'},
    { type: 'button',label:'Action', typeAttributes: { label: 'Add Student', name: 'first_button', variant: 'base' } },
    { type: 'button',label:'Action', typeAttributes: { label: ' Delete Student', name: 'second_button', variant: 'base' } },];
export default class SittingArrangement extends LightningElement {

    classData;
    studentData=[];
    graphicalview=false;
    datatable=false;
    columns=columns;
    demandrows=false;
    Name;
    Marks;
    arr=[];
    value = ['Tabular View'];
    value1 = ['Graphical View'];
    recordId;
    rowno;
    div1;
    div2;
    

    connectedCallback()
    {
        getClass().then(data=>{

            this.classData=data;
        }).catch(error=>{

            console.log(error);
        })
    }
    handleRowActions(event) 
    {
        //console.log(JSON.stringify(event.detail.action));
        if(event.detail.action.name==='first_button') 
        {
            console.log('clicked FIRST button');
            console.log(event.detail.action.name);
            console.log(event.detail.row.Id);
            console.log(event.detail);
            this.Marks=event.detail.row.Marks__c;
            //this.handleDiv1(event.detail.row.Name,event.detail.row.Marks__c);
            this.Name=event.detail.row.Name;


        }
        else if(event.detail.action.name==='second_button')
        {
            console.log('clicked Second Button');
            console.log(event.detail.action.name);
            console.log(event.detail.row.Id);
            console.log(event.detail);
            console.log(event.detail.row.Marks__c);
            this.Marks=0;
            this.Name='';
            console.log(this.Marks);
            console.log(this.Name);
            
            

        }
    }
    handleClass(event)
    {
        this.recordId=event.target.value;
        getClass().then(data=>{

            this.classData=data;
        }).catch(error=>{

            console.log(error);
        })
        console.log(this.recordId);
    }
    get options1() 
    {
        return [
            { label: 'Graphical View', value: 'Graphical View' },
            
        ];
    }
    get options() {
        return [
            { label: 'Tabular View', value: 'Tabular View' },
            
        ];
    }
    handleChange(event)
    {

        console.log(event.detail.value);
        this.datatable=true;
        getStudent({Id:this.recordId}).then(data=>{
            console.log(data);
            this.studentData=data;
        }).catch(error=>{
            console.log(error);
        })

    }
    handleChange1(event)
    {
        this.datatable=true;
        this.demandrows=true;
        console.log(event.detail.value);
    }
    handleRow()
    {
        
        this.rowno=this.template.querySelector(".Rows").value;
        this.demandrows=false;
        //this.graphicalview =true;
        for(let i=0;i<this.rowno;i++)
        {
            this.arr[i]={'name' : i};
        
        }
        console.log(this.arr);
        this.graphicalview =true;
        console.log(this.rowno);

    }
   
    handleDiv1(event)
    {
        let div = event.target;
        if(this.Marks>=75)
        {
            div.textContent=this.Name;
            div.style.background='Green';
        }
        else if(this.Marks===0)
        {
            div.textContent=this.Name;
            div.style.background='White';
        }
        else if(this.Marks<=75)
        {
            div.textContent=this.Name;
            div.style.background='Red';
        }
        

    }
    handleDiv2(event)
    {
        let div = event.target;
        if(this.Marks>=75)
        {
            div.textContent=this.Name;
            div.style.background='Green';
        }
        else if(this.Marks===0)
        {
            div.textContent=this.Name;
            div.style.background='White';
        }
        else if(this.Marks<=75)
        {
            div.textContent=this.Name;
            div.style.background='Red';
        }
        
        


    }
    
}