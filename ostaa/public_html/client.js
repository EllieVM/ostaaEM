/**
 * Ellie Martin
 * CSC 337
 * This file contains two functions for posting user and item data to the 
 * server, which is then added to the database.
 */

/**
 * This function takes the input from the texboxes in the addUser div, and 
 * builds the post parameters string fron the inputs and send a post request
 * to the server to add the user to teh database.
 */
function addUser(){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username != '' && password != ''){
        let url = 'http://146.190.160.62:80/add/user';
        let postStr = 'username='+username+'&password='+password;

        var httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            return false;
        }

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    console.log(httpRequest.responseText);
                    alert(httpRequest.responseText);
                } else { 
                    return false; 
                }
            }
        }

        httpRequest.open('POST', url);
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        httpRequest.send(postStr);
    }
}

/**
 * This function takes the input from the texboxes in the addItem div, and 
 * builds the post parameters string fron the inputs and send a post request
 * to the server to add the item to the database and add the item id to the 
 * user's listings array.
 */
function addItem(){
    var user = document.getElementById('user').value;
    var title = document.getElementById('title').value;
    var desc = document.getElementById('desc').value;
    var img = document.getElementById('img').value;
    var price = document.getElementById('price').value;
    var stat = document.getElementById('stat').value;

    if (user != ''){
        let url = 'http://146.190.160.62:80/add/item/'+user;
        let postStr = 'username='+username+'&title='+title+'&desc='+desc+'&img='+img+'&price='+price+'&stat='+stat;

        var httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            return false;
        }

        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    console.log(httpRequest.responseText);
                    alert(httpRequest.responseText);
                } else { 
                    return false; 
                }
            }
        }

        httpRequest.open('POST', url);
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        httpRequest.send(postStr);
    }
}