function setup() {
  // put setup code here
    noCanvas();
    console.log('Running');
    loadJSON('/all',gotdata);


    var button = select('#submit');
    button.mousePressed(submitWord);

    var buttonA = select('#analyze');
    buttonA.mousePressed(analyzeThis);

    function analyzeThis() {
        var txt = select('#input').value();

        var data = {
            text: txt
        }
        httpPost('analyze/',data,'json',dataposted,postErr);
    }
    function dataposted(result) {
        console.log(result);

    }

    function postErr(err) {
        console.log(err);
    }

    function submitWord(){
        var word = select('#word').value();
        var score = select('#score').value();
        console.log(word,score);

        loadJSON('add/'+ word + '/' + score, finished);

        function finished(data) {
            console.log(data);


        }
}

}
function gotdata(data){
    console.log(data);
}

