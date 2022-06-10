import { LightningElement,track } from 'lwc';
/* eslint-disable no-undef */
/* eslint-disable @salesforce/lightning/valid-apex-method-invocation */
import getRecords from '@salesforce/apex/FSL1.getRecords';
import uploadFile from '@salesforce/apex/FSL1.uploadFile';
import getIdFile from '@salesforce/apex/FSL1.getIdFile';
//import getRelatedFilesByRecordId from '@salesforce/apex/FSL1.getRelatedFilesByRecordId';
import getDeleteFile from '@salesforce/apex/FSL1.getDeleteFile';

import { NavigationMixin } from 'lightning/navigation';
import sendEmail from '@salesforce/apex/FSL1.sendEmail';
//import myMethod2 from '@salesforce/apex/DAPgetListofQuestions.myMethod2';
//import getRelatedFilesByRecordId from '@salesforce/apex/filePreviewAndDownloadController.getRelatedFilesByRecordId';
//import createDocument from '@salesforce/apex/FSL1.createDocument';

const actions = 
    [
        { label: 'Preview', name: 'preview' },
        { label: 'Dowload', name: 'dowload' },
        { label: 'Email', name: 'email' },
        { label: 'Delete', name: 'delete' }
    ];

export default class LWC extends NavigationMixin(LightningElement) {
    @track recordId;
    fileData
    listViews=[];
    dt=false;
    id;
    listN=[];
    recordId1='';
    filesList =[];
    send=false;
    email='';
    rowId='';
    

   
    
    columns = [
        {
                label: 'Icon',
                fieldName: 'Id',
                type: 'text'
        },
        
        {
                label: 'Title',
                fieldName: 'Title',
                type: 'text'
        },
        {
                type: 'action',
                typeAttributes: { rowActions: actions}
        }
        ];
    connectedCallback()
    {
        getRecords().then(data=>{
            this.listViews=data;
            console.log(data);
        }).catch(error=>{
            console.log(error);
        })
    }

    myMehthod(i)
    {
     
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'filePreview'
            },
            state : 
            {
                recordIds: i  //your ContentDocumentId here
            }
          });
    }
    myMethod2(j)
    {
       this.recordId1=j;
       console.log(j);
      // let url='/sfc/servlet.shepherd/document/download/'+j;
       this[NavigationMixin.GenerateUrl](
        {
        type: 'standard__webPage',
        attributes: {
            //recordId: j,
            url:'/sfc/servlet.shepherd/document/download/'+j
            //actionName: 'dowload',
        },
    }).then(url => {
        window.open(url);
        //this.recordPageUrl = res;
    });
    

    }
    myMethod3(j)
    {
        console.log('Hello From Delete');
        getDeleteFile({i:j}).then(result=>{
            console.log('Delete Document');
            console.log(result);
        }).catch(error=>{
            console.log('Deleted not');
            console.log(error);
        })

    }
    sendEmail()
    {
        this.email=this.template.querySelector('.emailField').value;
        console.log(this.email);
        
       console.log(this.rowId);
        sendEmail({i:this.rowId,mail:this.email}).then(result=>{

            console.log(JSON.stringify(result));
            this.send=false;
        }).catch(error=>{
            console.log(error);
            console.log('Error Problem ');
        })
        console.log('Email Recieved');
    }
   
    handleRowAction(event) 
    {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log(actionName);
        console.log(row);
        switch (actionName) {
            case 'preview':

            console.log(row.Id);
            this.myMehthod(row.Id);
            break;
            case 'dowload':
                console.log('Hello From Dowload');
                this.recordId1=row.Id;
                this.rowId=row.Id;
                this.myMethod2(row.Id);
                break;
            case 'email': 
                console.log('Email Sent');
                this.send=true;
               this.rowId=row.Id;
                break;
            case 'delete':
                console.log('Hello From Delete');

                this.myMethod3(row.Id);
                break;
            default:
        }
    }
    
    handleClick1(event)
    {
        this.dt=true;
        //console.log(this.dt);
        this.recordId=event.target.value;
        //console.log(event.target.value);
        //console.log(this.recordId);
        getIdFile({i:this.recordId}).then(result=>{
            console.log('Hello');
            console.log(JSON.stringify(result));
            //console.log('Hello');
            this.listN=result;
            console.log(this.listN);
            
            
        }).catch(error=>{
            console.log('Hello Error');
            console.log(error);
        })




    }
    openfileUpload(event) {
        const file = event.target.files[0];
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId1
            }
            console.log(this.fileData)
        }
        reader.readAsDataURL(file)
    }
    handleClick()
    {
        const {base64, filename,recordId1} = this.fileData
        uploadFile({ base64:base64, filename:filename, recordId:recordId1 }).then(result=>{
            this.fileData = null;
            console.log(result);

            

        })
    }

}