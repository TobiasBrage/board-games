$(document).ready(function(){
    
    var userId = readCookie('curUserId');
    var gameSearch = 0;

    if(userId == null) {
        window.location.href = '../tictactoe';
    } else {
        fetch('http://165.227.173.142:1337/user/id='+userId)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if(data == 0) {
                window.location.href = '../tictactoe';
            } else {
                var username = data[0].username;
                $('#ownUsername').html('Du spiller som: '+username);
            }
        });
    
        setInterval(function() {
            if(gameSearch == 0) {
                gameSearch = 1;
                fetch('http://165.227.173.142:1337/user/id='+userId)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    var userPlaying = data[0].playing;
                    if(userPlaying == 'no') {
                        fetch('http://165.227.173.142:1337/user/opponent/id='+userId)
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            if(data.message == 'matchOpponent') {
                                var opponentUserId = data.userData[0].id;
                                let headers = new Headers();
                                headers.append('Content-Type', 'application/json');
                                let init = {
                                    method: 'POST',
                                    headers: headers,
                                    body: `{"userId":"${userId}", "opponentId":"${opponentUserId}"}`,
                                    cache: 'no-cache',
                                    mode: 'cors'
                                };
                                let request = new Request('http://165.227.173.142:1337/game/create/', init);
                                fetch(request)
                                    .then(response => {
                                        return response.json();
                                    })
                                    .then((data) => { 
                                        if(data.message == 'gameCreated') {
                                            window.location.href = '../tictactoe/game.html';
                                        }
                                });
                            }
                            console.log(data);
                            gameSearch = 0;
                        });
                    } else {
                        window.location.href = '../tictactoe/game.html';
                    }
                });
            }
        }, 1000);
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