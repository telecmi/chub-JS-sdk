ContactHUB JavaScript SDK
===================


ContactHUB ! Indian First True Cloud Telephony Platform Enable Web IVR in your Website using our Javascript SDK, Were your customer directly talk from  Browser,Now your custamer can make call to your sales,technical and support team from **browser**, You agent answer the call in **Mobile/Landline** from anywhere in the world .




Documents
-------------

## **Install**

 **Bower**

    bower install chub-js-sdk

**npm**

    npm install chub-js-sdk
    
**yarn**

    yarn add chub-js-sdk

**CDN**

    <script src="https://app.telecmi.com/1.0/telecmi-sdk.min.js"></script>

## **Get Started**

**Create Telecmi Object**  

```javascript
var chub = new Telecmi(); 
```

## Method
**Register**

```javascript
chub.startCHUB(agentusername,agentpassword)
//For agent use your agent username and password
//For web ivr just use username: telecmi ,password: telecmi
```




## Calls
**Make Call**

```javascript
  chub.call('destination number');
```


**Accept Call**

```javascript
  chub.answer();
```


**Hangup/Reject call**

```javascript
  chub.hangup();
```
**Mute/Unmute MIC**
```javascript
  chub.mic();
  //When you call this method first time it will mute your mic ,if you call second time it will unmute your mic
```
**Send DTMF**

```javascript
  chub.dtmf('1');
```

**Logout**

```javascript
  telecmi.logout();
```
## CallBack
**Status**
 .
```javascript
  telecmi.onStatus=function(data){
  //Data is JSON it contain event and status
  };
```

***Example***
```javascript
  telecmi.onStatus=function(data){
  if(data.event=='register'&& data.status==true){
   //register successfully do your stuff here
     }else if(data.event=='incoming'&& data.status==true)
     {
         //You have new incoming call just accept it
         telecmi.accept()
     }
 };
```

## Events

**List of event and status**

| Event      | Status     | Description
| ------------- |:-------------:|:-------------:| 
| ws  | open | This event fired when websocket connection open |
| ws  | close | This event fired when websocket connection close |
| register | true | This event fired when you successfully register  |
| register | false | This event fired when your registration fails  |
| trying | true | This event fired when you make call  |
| ringing | true | This event fired when  you get **Incomming call** |
| media | true | This event fired when your destination ringing (**Early Media**)
| connected | true | This event fired when call successfully connected |
| answer | true | This event fired when call chage into  answer state|
| hangup | true | This event fired when call disconnected |

