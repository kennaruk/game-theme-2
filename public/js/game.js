
$(function () {

    $('#ready-btn').click(function() {
        var answer = $('#inlineFormInputGroup').val();
        
        $.ajax({
            url: '/question',
            type:'POST',
            data: {answer : answer},
            success: (success) => {
                if(success.correct){
                    swal("ยินดีด้วย", "เจ้าผ่านด่านของคราเคน", "success").then(() => {
                        window.location.href = '/image' ;                      
                    });
                }else{
                    swal("แย่จัง!!!", "คำตอบผิด!", "error");
                }
            }
        });
    });

});