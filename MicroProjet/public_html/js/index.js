var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var studentDBName = "MINIPROJECT-DB";
var studentRelationName = "EmpData";
var connToken = "90931734|-31949217155705640|90963708";

$(document).ready(function() {
    $("#save").click(function() {
        console.log("Save button clicked");
        saveData();
    });

    $("#change").click(function() {
        console.log("Change button clicked");
        changeData();
    });

    $("#reset").click(function() {
        console.log("Reset button clicked");
        resetForm();
    });
});

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNumberAsJsonObj() {
    var rollnumber = $("#rollnumber").val();
    var jsonStr = {
        id: rollnumber
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullname").val(record.name);
    $("#class").val(record.salary);
    $("#birthdate").val(record.hra);
    $("#address").val(record.da);
    $("#enrollmentdate").val(record.deduction);
}

function resetForm() {
    console.log("resetForm function called");
    $('#rollnumber').val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enrollmentdate").val("");
    $("#rollnumber").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollnumber").focus();
}

function validateData() {
    var rollnumber, fullname, className, birthdate, address, enrollmentdate; 
    rollnumber = $("#rollnumber").val();
    fullname = $("#fullname").val();
    className = $("#class").val(); 
    birthdate = $('#birthdate').val();
    address = $("#address").val();
    enrollmentdate = $("#enrollmentdate").val();
    if (rollnumber === '') {
        alert("Roll Number missing"); 
        $("#rollnumber").focus();
        return "";
    }
    if (fullname === "") {
        alert("Full-Name missing");
        $("#fullname").focus();
        return "";
    }
    if (className === "") {
        alert("Class missing"); 
        $("#class").focus();
        return "";
    }
    if (birthdate === "") {
        alert("Birth-Date missing");
        $("#birthdate").focus();
        return "";
    }
    if (address === "") {
        alert("Address missing");
        $("#address").focus();
        return "";
    }
    if (enrollmentdate === "") {
        alert("Enrollment-Date missing");
        $("#enrollmentdate").focus();
        return "";
    }
    var jsonStrObj = {
        Rollnumber : rollnumber,
        Fullname: fullname,
        Class: className,
        BirthDate: birthdate,
        Address: address,
        EnrollmentDate: enrollmentdate
    };
    return JSON.stringify(jsonStrObj);
}

function getStudent() {
    var rollNumberJsonObj = getRollNumberAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studentDBName, studentRelationName, rollNumberJsonObj); 
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false); 
        $("#reset").prop("disabled", false); 
        $("#fullname").focus();
    } else if (resJsonObj.status === 200) {
        $("#rollnumber").prop("disabled", true); 
        fillData(resJsonObj);
        $("#change").prop("disabled", false); 
        $("#reset").prop("disabled", false); 
        $("#fullname").focus();
    }
}

function saveData() {
    console.log("saveData function called");
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, studentDBName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#rollnumber").focus();
}

function changeData() {
    console.log("changeData function called");
    $('#change').prop("disabled", true); 
    var jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDBName, studentRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#rollnumber").focus();
}
