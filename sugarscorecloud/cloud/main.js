Parse.Cloud.afterSave("Phone", function(request) {

    var phone = request.object.get("phone");
    var objectId = request.object.id;

    //TODO: Get score
    
    //TODO: Validate phone number

    var Phone = Parse.Object.extend("Phone");
    var query = new Parse.Query(Phone);


    query.get(objectId, {
      success: function(phoneObject) {
              
              var instance = phoneObject;
              console.log('Phone number is ' + phone);
              console.log('Object id is ' + objectId);
              var msg = encodeURI('Click link to download your food habits app - http://goo.gl/ODLqh');
              var sms_url = 'http://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=' + phone + '&msg=' + msg + '&msg_type=TEXT&userid=2000071415&auth_scheme=plain&password=cpKeTH&v=1.1&format=text'

              //To ensure this is only done once & prevent recursive callbacks to after save
              if(instance.createdAt.getTime() == instance.updatedAt.getTime())
              {
                Parse.Cloud.httpRequest({
                  method: 'GET',
                  url: sms_url,
                  success: function(httpResponse) {
                    console.log('Success ' + instance.get("phone"));
                    instance.set("sentSMS", true);
                    instance.save();
                  },
                  error: function(httpResponse) {
                    console.error('Request failed with response code ' + httpResponse.status);
                  }
                });
              } 
    },
      error: function(object, error) {
        console.log('Error ' + error);
      }
    });

});


