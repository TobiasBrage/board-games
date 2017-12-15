$(document).ready(function(){
    
    var userId = readCookie('curUserId');
    var gameSearch = 1;
    var gameId = 0;
    var userSymbol = '';
    var userIdTurn = 0;
    var winLoseId = 0;
    var opponentId = 0;
    var opponentSymbol = '';
    var username = '';
    var opponentUsername = '';
    var apiAddress = '165.227.173.142';
    
    if(userId) {
        fetch('http://'+apiAddress+':1337/user/id='+userId)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if(data == 0) {
                window.location.href = '../';
            }
            if(data[0].playing) {
                username = data[0].username;
                gameId = data[0].gameId;
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                let init = {
                    method: 'POST',
                    headers: headers,
                    body: `{"userId":"${userId}", "gameId":"${gameId}"}`,
                    cache: 'no-cache',
                    mode: 'cors'
                };
                let request = new Request('http://'+apiAddress+':1337/board/opponent', init);
                fetch(request)
                    .then(response => {
                        return response.json();
                    })
                    .then((data) => { 
                        if(data == 0) {
                            leaveBoard();
                        }
                        opponentId = data[0].turnId;
                        opponentSymbol = data[0].symbol;
                        if(opponentSymbol == 'cross') {
                            userSymbol = 'circle';
                        } else {
                            userSymbol = 'cross';
                        }
                        fetch('http://'+apiAddress+':1337/user/id='+opponentId)
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            if(data == 0) {
                                leaveBoard();
                            } else {
                                opponentUsername = data[0].username;
                                fetch('http://'+apiAddress+':1337/board/lastturn/id='+gameId) //xxx
                                .then((response) => {
                                    return response.json();
                                })
                                .then((data) => {
                                    userIdTurn = data[0].turnId;
                                    if(userIdTurn == userId) {
                                        $('#boardTitle').html('Det er din tur');
                                    } else {
                                        $('#boardTitle').html('Venter på '+opponentUsername);
                                    }
                                    $('#boardOpponentName').html('Du spiller mod: '+opponentUsername);
                                    gameSearch = 0;
                                });
                            }
                        });
                });
            } else {
                window.location.href = '../';
            }
        });
    } else {
        window.location.href = '../';
    }

    setInterval(function() {
        if(gameSearch == 0) {
            gameSearch = 1;
            // fetch('http://localhost:1337/user/id='+opponentId) ....først tjekke om boardet eksisterer
            // .then((response) => {
            //     return response.json();
            // })
            // .then((data) => {
            //     console.log(data);
            //     if(data == 0) {
            //         leaveBoard();
            //     } else {
            //         gameSearch = 0;
            //     }
            // });


            // fetch('http://localhost:1337/user/id='+opponentId) ....derefter om modstanderen stadig eksisterer
            // .then((response) => {
            //     return response.json();
            // })
            // .then((data) => {
            //     console.log(data);
            //     if(data == 0) {
            //         leaveBoard();
            //     } else {
            //         gameSearch = 0;
            //     }
            // });
        }
    }, 1000);

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

    function leaveBoard() {
        fetch('http://'+apiAddress+':1337/user/id='+userId)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            fetch('http://'+apiAddress+':1337/board/delete/id='+data[0].gameId)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                alert('Din modstander forlod spillet.');
                window.location.href = '../';
            });
        });
    }
    
});