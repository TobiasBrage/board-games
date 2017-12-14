$(document).ready(function(){

    var username = '';

    document.querySelector('#tictactoeSubmit').addEventListener('click', (event) => {
        username = $('#tictactoeUsername').val();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let init = {
            method: 'POST',
            headers: headers,
            body: `{"username":"${username}"}`,
            cache: 'no-cache',
            mode: 'cors'
        };
        let request = new Request('http://localhost:1337/add/user', init);
        fetch(request)
            .then(response => {
                return response.json();
            })
            .then((data) => { 
                let usernameLength = $('#tictactoeUsername').val().length;
                if(usernameLength > 5) {
                    if(data.message == 'userCreated') {
                        createCookie('curUserId',data.userId,2);
                        window.location.href = 'searchOpponent.html';
                    } else if(data.message == "userError") {
                        alert('Brugernavnet er allerede i brug.');
                    }
                } else {
                    alert('Brugernavnet er for kort.');
                }
        });
    });

    function createCookie(cookieName, cookieValue, expireInDays) {
        var d = new Date();
        d.setTime(d.getTime() + (expireInDays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    }

});