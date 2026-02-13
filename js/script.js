$(function(){
    let currentTurn = 'blue';
    const resultTexts = ['','도','개','걸','윷','모']; //결과 출력하기 위한 글자 배열
    let turnChangeTimer = null; // timeOut ID 정의 변수

    $('.players span').each(function(){
        let initialLeft = $(this).css('left');
        let initialtop = $(this).css('top');
        $(this).data('init-left', initialLeft);
        $(this).data('init-top', initialtop)
    });

    function updateTurnMessage(){  //info에서 턴 안내 메세지 변경 함수
        const teamName = (currentTurn === 'blue') ? '청팀':'홍팀';  //현재 턴이 blue라면 청팀, 아니라면 홍팀으로
        const color = (currentTurn === 'blue') ? '#46e':'#c43';  //현재 턴이 blue라면 색상 #46e, 아니라면 #c43
        $('.control>.info').html(teamName+'던질 차례입니다.').css({
            'background':currentTurn==='blue' ? '#eef':'#fee',  //글자 출력 후 스타일 배경과 컬러 정의
            'color':color
        })
    }
    updateTurnMessage();  //info 출력 초기화
    function changeTurn(){  //턴 변경 blue가 현재 currentTurn이면 'red'로 아니면 'blue'로 갱신 후 info에 결과 출력 
        currentTurn = (currentTurn==='blue') ? 'red':'blue';  //
        updateTurnMessage();
    }

    function showResult(num,extraTurn){  //랜덤(1~5)값과 추가턴 판단(true/false)인자로 결과 출력하는 함수
        const teamName = (currentTurn==='blue') ? '청팀':'홍팀';
        const color = (currentTurn==='blue') ? '#45e':'#c43';  //현재 턴이 blue면 청팀, red면 홍팀, 글자색 정의
        const resultText = resultTexts[num];  // 랜덤 값으로 배열 요소 값 호출(1~5번째 '도'~'모' 중 하나)
        let message = teamName + ' _ ' + resultText;  //팀명- 결과 형식의 문자열 구성
        if(extraTurn){  //추가턴 판단이 있다면 
            message += '(한번 더!)';  //결과 메세지 뒤에 (한번 더) 추가 출력 구성
        }
        $('.control>.info').html(message).css({
            'background':(currentTurn==='blue') ? '#eef' : '#fee',
            'color':color
        });
    }

    function scheduleNexTurn(extraTurn){
        if(turnChangeTimer){
            clearTimeout(turnChangeTimer);
        }
        if(!extraTurn){
            turnChangeTimer = setTimeout(changeTurn,3000);
        }else{
            turnChangeTimer = setTimeout(updateTurnMessage,3000);
        }
    }


    $('.players').find('span').draggable({stack:'span'});

$('.players span').droppable({
    tolerance:'intersect',
    drop:function(event, ui){
        let droppedPiece = ui.draggable;
        let targetPiece = $(this);
        let droppedTeam = droppedPiece.parent().hasClass('blue') ? 'blue' : 'red';
        let targetTeam = targetPiece.parent().hasClass('blue') ? 'blue':'red';
        if( droppedTeam !== targetTeam ){
            targetPiece.css({
                left:targetPiece.data('init-left'),
                top:targetPiece.data('init-top')
            });
            //기존 턴 변경 타이머 취소
            if(turnChangeTimer){
                clearTimeout(turnChangeTimer);
            }
            alert(droppedTeam+'팀이'+targetTeam+'팀 말을 잡았습니다.');
            //말을 잡은 팀 추가기회
            currentTurn = droppedTeam; //드래그된 span 팀을 현재 턴으로 정의
            turnChangeTimer = setTimeout(updateTurnMessage,2000); //턴변경이 아닌 현재턴으로 메세지 갱신
        }
    }
});



    function randomimg(){
        let num =Math.floor(Math.random()*5)+1;
        let imgsrc=`./img/${num}.png`;
        $('.randombox').find('img').attr('src',imgsrc);
        $('.randombox').css('display','flex');
        $('.randombox').delay(2000).fadeOut(150);
        //윷, 모 나오면 추가 기회
        const extraTurn = (num===4 || num===5); //true/false 반환
        setTimeout(function(){
            showResult(num, extraTurn);
            scheduleNexTurn(extraTurn);
        },2000);
    }
    $('.button').on('click',function(){
        $('.randombox').hide();
        setTimeout(randomimg,1500);
    });
    $('.resetbtn').on('click',function(){
        window.location.reload();
    });
});