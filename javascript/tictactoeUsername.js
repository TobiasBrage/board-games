$(document).ready(function(){

    var userCookieId = readCookie('curUserId');
    var apiAddress = '165.227.173.142';

    if(userCookieId) {
        fetch('http://'+apiAddress+':1337/user/id='+userCookieId)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if(data != 0) {
                fetch('http://'+apiAddress+':1337/board/delete/id='+data[0].gameId)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    fetch('http://'+apiAddress+':1337/user/delete/id='+userCookieId)
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        document.cookie = "curUserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        $('#tictactoeUsername').val("");
                    });
                });
            }
        });
    }

    var username = '';

    document.querySelector('#tictactoeSubmit').addEventListener('click', (event) => {
        username = $('#tictactoeUsername').val();
        let usernameLength = $('#tictactoeUsername').val().length;

        if(usernameLength > 5) {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let init = {
                method: 'POST',
                headers: headers,
                body: `{"username":"${username}"}`,
                cache: 'no-cache',
                mode: 'cors'
            };
            let request = new Request('http://'+apiAddress+':1337/add/user', init);
            fetch(request)
                .then(response => {
                    return response.json();
                })
                .then((data) => { 
                    let usernameLength = $('#tictactoeUsername').val().length;
                    if(data.message == 'userCreated') {
                        createCookie('curUserId',data.userId,2);
                        window.location.href = 'searchOpponent.html';
                    } else if(data.message == "userError") {
                        alert('Brugernavnet er allerede i brug.');
                    }
            });
        } else {
            alert('Brugernavnet er for kort.');
        }
    });

    function createCookie(cookieName, cookieValue, expireInDays) {
        var d = new Date();
        d.setTime(d.getTime() + (expireInDays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    }

    function readCookie(cookieName) {
        var nameTmp = cookieName + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameTmp) == 0) return c.substring(nameTmp.length,c.length);
        }
        return null;
    }

});