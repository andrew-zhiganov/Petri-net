var marksArray = [];

var JSONObject = {
    "name": "",
    "mark": "",
    "status": "OK",
    "trans": "",
    "path": [],
    "children": []
};

var transitions = {
    "t1": {
        "input": [0],
        "output": [1]
    },
    "t2": {
        "input": [0],
        "output": [2]
    },
    "t3": {
        "input": [1],
        "output": [3]
    },
    "t4": {
        "input": [2],
        "output": [4]
    },
    "t5": {
        "input": [3, 4],
        "output": [0]
    },
    "t6": {
        "input": [2],
        "output": [2, 4]
    }
};

function genTree(startMark, nesting){
    marksArray = [];

    JSONObject = {
        "name": "",
        "mark": startMark,
        "status": "OK",
        "trans": "",
        "path": [],
        "children": []
    };
    
    proceedTree(JSONObject, nesting);
    // console.log(marksArray);
    // console.log(JSONObject);
    $('#chart').empty();

    if($('#tree')[0].checked){
        renderFullTree(JSONObject);
    }
    else{
        renderTree(JSONObject);
    }
}

function proceedTree(obj, nesting){
    for(var i = 0; i < marksArray.length; i++){
        if(JSON.stringify(obj["mark"]) == JSON.stringify(marksArray[i]["mark"])){
            obj["status"] = "(дубль)";
        }
    }
    if(obj["status"] != "(дубль)"){
        marksArray.push({
            "mark": obj["mark"],
            "path": obj["path"]
        });
    }
    if(obj["status"] == "OK" && obj["path"].length >= nesting - 1){
        obj["status"] = "(w)";
    }
    if(obj["status"] == "OK"){
        var mark = obj["mark"];

        var deadlock = true;

        Object.keys(transitions).forEach(function(item, i, arr){
            var inputPoses = transitions[item]["input"];
            var outputPoses = transitions[item]["output"];
            var launch = true;
            inputPoses.forEach(function(iitem, i, arr){
                if(mark[iitem] - 1 < 0){
                    launch = false;
                }

            });
            // console.log(launch, item);
            if(launch){
                var newMark = mark.slice();

                inputPoses.forEach(function(item, i, arr){
                    newMark[item] -= 1;
                });
                outputPoses.forEach(function(item, i, arr){
                    newMark[item] += 1;
                });
                var newPath = obj["path"].slice();
                newPath.push(item);
                obj["children"].push({
                    "name": "",
                    "mark": newMark,
                    "status": "OK",
                    "trans": item,
                    "path": newPath,
                    "children": []
                });
                deadlock = false;
            }
        });
        if(deadlock){
            obj["status"] = "(тупик)";
        }
        else{
            obj["children"].forEach(function(item){
                proceedTree(item, nesting);
            });
        }
    }

    if(obj["status"] != "OK"){
        obj["name"] = JSON.stringify(obj["mark"]) + obj["status"];
    }
    else{
        obj["name"] = JSON.stringify(obj["mark"]);
    }
    if(obj["trans"]){
        obj["name"] = JSON.stringify(obj["trans"]) + ' / ' + obj["name"];
    }

    return;
}