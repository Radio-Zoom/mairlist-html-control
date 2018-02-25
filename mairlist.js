/*
 *	mairlist.ls the control panel core java scripts
 *
 * @package     
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Christian Meyer <info@dj-meggs.de>
 * @copyright   Copyright (c) 2017-2018 Christian Meyer (http://www.dj-meggs.de/)
 *
*/

"use strict";

jQuery(document).ready(function($) {

    // Status Streammonitor lesen
    function streamMonStatus0() {
        return $.ajax({
            url: "json-pass.php",
            data: {
                read: "/runtimedata/StreamMonitorOnAir0"
                },
        });
      }

    function streamMonStatus1() {
        return $.ajax({
            url: "json-pass.php",
            data: {
                read: "/runtimedata/StreamMonitorOnAir1"
                },
        });
      }

//function um live1 auszuschalten
    $.fn.live1OFF = function() {
        $.ajax({
            type:"POST",
            url: "json-pass.php",
            data: {
           command: "RUNSCRIPT m:\\mairlistdata\\scripts\\remote-control\\StreamMonitor0-Off.mls"
//           command: "RUNSCRIPT m:\\mairlistdata\\scripts\\remote-control\\fakeonair.mls"      // Fakescript
            },
            success: function(content) {
                $("#content").html(content);

                }

        });
        return false;
    }
//function um live1 einzuschalten
    $.fn.live1ON= function() {
        $.ajax({
            type:"POST",
            url: "json-pass.php",
            data: {
          command: "RUNSCRIPT m:\\mairlistdata\\scripts\\remote-control\\StreamMonitor0-On.mls"
 //            command: "RUNSCRIPT m:\\mairlistdata\\scripts\\remote-control\\fakeonair.mls"      // Fakescript
            },
            success: function(content) {
                $("#content").html(content);

                }

        });
        return false;
    }

//function um live2 auszuschalten
    $.fn.live2OFF = function() {
        $.ajax({
            type:"POST",
            url: "json-pass.php",
            data: {
            command: "RUNSCRIPT m:\\mairlistdata\\scripts\\remote-control\\StreamMonitor1-Off.mls"
//           command: "RUNSCRIPT m:\\mairlistdata\\scripts\\remote-control\\fakeonair.mls"      // Fakescript
            },
            success: function(content) {
                $("#content").html(content);

                }

        });
        return false;
    }
//function um live2 einzuschalten
    $.fn.live2ON= function() {
        $.ajax({
            type:"POST",
            url: "json-pass.php",
            data: {
            command: "RUNSCRIPT m:\\mairlistdata\\scripts\\remote-control\\StreamMonitor1-On.mls"
        //    command: "RUNSCRIPT m:\\mairlistdata\\scripts\\remote-control\\fakeonair.mls"      // Fakescript
            },
            success: function(content) {
                $("#content").html(content);

                }

        });
        return false;
    }

// Refresher

var live1 = null;
var live2 = null;
var autom = null;
var stream = null;
var streamTitleData = null;
var live1SourceIP = null;
var live2SourceIP = null;
var live1_pre = null;
var live2_pre = null;
var autom_pre = null;
var stream_pre = null;
var status00 = null;
var status11 = 0;
var streamTitleData_pre = null;
var live1SourceIP_pre = null;
var live2SourceIP_pre = null;
var status00_pre = null;
var status11_pre = null;
var live1Title = null;
var live1Title_pre = null;
var live2Title = null;
var live2Title_pre = null;
var autoTitle = null;
var autoTitle_pre = null;

$('#onAIRstat1').removeClass()
$('#onAIRstat2').removeClass()
$('#onAIRstatAuto').removeClass()

function refresh(){

    $.getJSON("/now-playing/info-s1-json.php", function(data) {
            var status0 = streamMonStatus0();
            var status1 = streamMonStatus1();
            status0.success(function (status00) {
                var streamTitleData = data.ICESTATS["/192k.mp3"].TITLE;
                var live1 = data.ICESTATS["/live1"];
                var live2 = data.ICESTATS["/live2"];
                var autom = data.ICESTATS["/automation"];
                var automSRCID = data.ICESTATS["/automation"].GENRE
                var automSRC = "/avatar/id_"+automSRCID+".jpg"
                var automBitrate = autom.BITRATE
                var automSourceIP = autom.SOURCE_IP
                var automSourceStart = autom.STREAM_START
                var automName = autom.SERVER_NAME;    
                var autoTitle = autom.TITLE;

// Prüfen ob Titel sich ändert und dann Update
                if(live1 === undefined){
                    var live1Title = "";
                }else{
                    var live1Title = live1.TITLE;
                }
                if(live2 === undefined){
                    var live2Title = "";
                }else{
                    var live2Title = live2.TITLE;
                }


                if(streamTitleData !== streamTitleData_pre||
                    autoTitle !== autoTitle_pre ||
                    live1Title !== live1Title_pre ||
                    live2Title !== live2Title_pre){

                    $('#streamTitle').text(streamTitleData);
                    $('#titelAutom').text(autoTitle);
                    $('#titel').text(live1Title);
                    $('#titel2').text(live2Title);
                   
                    live1Title_pre = live1Title;
                    live2Title_pre = live2Title;
                    autoTitle_pre = autoTitle;
                    streamTitleData_pre = streamTitleData;
                }
                
// Prüfen Status Streammonitor 0 und Anpassung Schalter an Status

                if (status00 !== status00_pre){
                    switch (status00){
                     case 0:
                     $('#toggle-event1').bootstrapToggle('off');
                     $('#onAIRstat1').text("INAKTIV");
                     $('#onAIRstat1').removeClass();
                     $('#onAIRstat1').addClass('inaktiv');
                     status00_pre = status00;
                     break
                     case 1:
                     $('#toggle-event1').bootstrapToggle('on');
                     $('#onAIRstat1').text("BEREIT");
                     $('#onAIRstat1').removeClass();
                     $('#onAIRstat1').addClass('bereit');
                     status00_pre = status00;                        
                     break
                }
            }

 // Prüfen Live1 & Live2 Einspeisung und Kontroll Booleans setzen

                if (live1 === undefined){
                    var a = false;
                }else{
                    var a = true;
                }
 
// Prüfen ob Live1 aktiv             

                if (live1 !== live1_pre){
                    switch (a){
                        case true:                                                          // wenn true = belegt, Variablen laden
                            var live1SRCID = data.ICESTATS["/live1"].GENRE
                            var live1SRC = "/avatar/id_"+live1SRCID+".jpg";
                            var live1Bitrate = live1.BITRATE
                            var live1SourceIP = live1.SOURCE_IP
                            var live1SourceStart = live1.STREAM_START
                            var live1Name = live1.SERVER_NAME
                                switch (status00){                                
                                    case 0:                                                 // Streammonitor aus ? dann mach folgendes
                                    $('#toggle-event1').bootstrapToggle('off')
                                    $('#toggle-event1').bootstrapToggle('enable');
                                    $("#live1ID").attr("src",live1SRC);
                                    $('#onAIRstat1').text("NICHT AKTIV");
                                    $('#autoID').attr("src",automSRC); //ID Bild laden für Automation
                                    $('#sourceIP').text(live1SourceIP);
                                    $('#onAIRstatAuto').text("ON AIR");
                                    $('#automName').text(automName);
                                    $('#sourceName').text(live1Name);
                                    $('#toggle_wrapper1').attr('class', 'checkbox enabled');    
                                    $('#onAIRstat1').removeClass();
                                    $('#onAIRstat1').addClass('warnung');

                                    break
                                    case 1:                                                 // Streammonitor an ? dann mach folgendes
                                    $('#toggle-event1').bootstrapToggle('on');
                                    $('#toggle-event1').bootstrapToggle('disable')
                                    $("#live1ID").attr("src",live1SRC);
                                    $('#onAIRstat1').text("ON AIR");
                                    $('#onAIRstatAuto').text("BEREIT");
                                    $('#autoID').attr("src",automSRC); //ID Bild laden für Automation
                                    $('#sourceIP').text(live1SourceIP);
                                    $('#bitrateSource').text(live1Bitrate);
                                    $('#streamStart').text(live1SourceStart);
                                    $('#modID').text(live1SRCID);
                                    $('#automIP').text(automSourceIP);
                                    $('#bitrateSourceAutom').text(automBitrate);
                                    $('#streamStartAutom').text(automSourceStart);
                                    $('#sourceName').text(live1Name);
                                    $('#modIDautom').text(automSRCID);
                                    $('#automName').text("");
                                    $('#toggle_wrapper1').attr('class', 'checkbox disabled');

                                    $('#onAIRstat1').removeClass();
                                    $('#onAIRstatAuto').removeClass();

                                    $('#onAIRstatAuto').addClass('bereit');
                                    $('#onAIRstat1').addClass('blinken');
                                    break
                                }

                        live1_pre = live1;                                          // Status wegschreiben zum vergleichen
                        break
                        case false:                                                 // Live 1 nicht belegt, also false, dann mach folgendes

                        $('#sourceIP').text("");
                        $('#bitrateSource').text("");
                        $('#streamStart').text("");
                        $('#modID').text("");
                        $('#sourceName').text("");
                        $('#live1ID').attr("src","/avatar/id_off.jpg"); //S01 = Platzhalter für Bild
            
                        switch (status00){
                            case 0:
                            $('#toggle-event1').bootstrapToggle('enable');
                            $('#toggle_wrapper1').attr('class', 'checkbox enable');
                            $('#toggle-event1').bootstrapToggle('off');
                            $('#onAIRstat1').removeClass();
                            $('#onAIRstat1').addClass('inaktiv');                            
                            $('#onAIRstat1').text('INAKTIV');

                            break
                        
                            case 1:

                            $('#toggle-event1').bootstrapToggle('enable');
                            $('#toggle_wrapper1').attr('class', 'checkbox enable');
                            $('#toggle-event1').bootstrapToggle('oon');
                            $('#onAIRstat1').removeClass();
                            $('#onAIRstat1').addClass('bereit');                            
                            $('#onAIRstat1').text('BEREIT')
                            
                            break
                        }
                        
                        if (live2 === undefined){
                        $('#autoID').attr("src",automSRC); //ID Bild laden für Automation
                        $('#onAIRstatAuto').text("ON AIR")
                        $('#automIP').text(automSourceIP);
                        $('#bitrateSourceAutom').text(automBitrate);
                        $('#streamStartAutom').text(automSourceStart);
                        $('#modIDautom').text(automSRCID);
                        $('#automName').text(automName);
                        $('#onAIRstatAuto').removeClass();
                        $('#onAIRstatAuto').addClass('blinken');
                    }
                        live1_pre = live1;
                        break
                    }

                }
                
        });

        status1.success(function (status11) {
            var streamTitleData = data.ICESTATS["/192k.mp3"].TITLE;
            var live1 = data.ICESTATS["/live1"];
            var live2 = data.ICESTATS["/live2"];
            var autom = data.ICESTATS["/automation"];
            var automSRCID = data.ICESTATS["/automation"].GENRE
            var automSRC = "/avatar/id_"+automSRCID+".jpg"
            var automBitrate = autom.BITRATE
            var automSourceIP = autom.SOURCE_IP
            var automSourceStart = autom.STREAM_START
            var automName = autom.SERVER_NAME;    
            
// Prüfen Status Streammonitor 1 und Anpassung Schalter an Status

            if (status11 !== status11_pre){
                switch (status11){
                 case 0:
                 $('#toggle-event2').bootstrapToggle('off');
                 $('#onAIRstat2').text("INAKTIV");

                 $('#onAIRstat2').removeClass();
                 $('#onAIRstat2').addClass('inaktiv');

                 status11_pre = status11;
                 break
                 case 1:
                 $('#toggle-event2').bootstrapToggle('on');
                 $('#onAIRstat2').text("BEREIT");
                 $('#onAIRstat2').removeClass();
                 $('#onAIRstat2').addClass('bereit');
                 status11_pre = status11;                        
                 break
            }
        }

// Prüfen Live1 & Live2 Einspeisung und Kontroll Booleans setzen

            if (live2 === undefined){
                var b = false;
            }else{
                var b = true;
            }

// Prüfen ob Live1 aktiv             

            if (live2 !== live2_pre){
                switch (b){
                    case true:                                                          // wenn true = belegt, Variablen laden
                        var live2SRCID = data.ICESTATS["/live2"].GENRE
                        var live2SRC = "/avatar/id_"+live2SRCID+".jpg";
                        var live2Bitrate = live2.BITRATE
                        var live2SourceIP = live2.SOURCE_IP
                        var live2SourceStart = live2.STREAM_START
                        var live2Name = live2.SERVER_NAME; 
                            switch (status11){                                
                                case 0:                                                 // Streammonitor aus ? dann mach folgendes
                                $('#toggle-event2').bootstrapToggle('off')
                                $('#toggle-event2').bootstrapToggle('enable');
                                $("#live2ID").attr("src",live2SRC);
                                $('#onAIRstat2').text("NICHT AKTIV");
                                $('#autoID').attr("src",automSRC); //ID Bild laden für Automation
                                $('#sourceIP2').text(live2SourceIP);
                                $('#onAIRstatAuto').text("ON AIR");
                                $('#toggle_wrapper2').attr('class', 'checkbox enabled');    
                                $('#automName').text(automName);
                                $('#sourceName2').text(live2Name);
                                $('#onAIRstat2').removeClass();
                                $('#onAIRstat2').addClass('warnung');                                

                                break
                                case 1:                                                 // Streammonitor an ? dann mach folgendes
                                $('#toggle-event2').bootstrapToggle('on');
                                $('#toggle-event2').bootstrapToggle('disable')
                                $("#live2ID").attr("src",live2SRC);
                                $('#onAIRstat2').text("ON AIR");
                                $('#onAIRstatAuto').text("BEREIT");
                                $('#autoID').attr("src",automSRC); //ID Bild laden für Automation
                                $('#sourceIP2').text(live2SourceIP);
                                $('#bitrateSource2').text(live2Bitrate);
                                $('#streamStart2').text(live2SourceStart);
                                $('#modID2').text(live2SRCID);
                                $('#automIP').text(automSourceIP);
                                $('#bitrateSourceAutom').text(automBitrate);
                                $('#streamStartAutom').text(automSourceStart);
                                $('#modIDautom').text(automSRCID);
                                $('#sourceName2').text(live2Name);
                                $('#automName').text("");
                                $('#toggle_wrapper2').attr('class', 'checkbox disabled');
                                $('#onAIRstatAuto').removeClass();
                                $('#onAIRstatAuto').addClass('bereit');
                                $('#onAIRstat2').removeClass();
                                $('#onAIRstat2').addClass('blinken');
                                break
                            }

                    live2_pre = live2;                                          // Status wegschreiben zum vergleichen
                    break

                    case false:                                                 // Live 1 nicht belegt, also false, dann mach folgendes

                    $('#sourceIP2').text("");
                    $('#bitrateSource2').text("");
                    $('#streamStart2').text("");
                    $('#modID2').text("");
                    $('#sourceName2').text("");
                    $('#live2ID').attr("src","/avatar/id_off.jpg"); //S01 = Platzhalter für Bild
                    
                    
                    switch (status11){
                        case 0:
                        $('#toggle-event2').bootstrapToggle('enable');
                        $('#toggle_wrapper2').attr('class', 'checkbox enable');
                        $('#toggle-event2').bootstrapToggle('off');
                        $('#onAIRstat2').removeClass();
                        $('#onAIRstat2').addClass('inaktiv');                            
                        $('#onAIRstat2').text('INAKTIV');

                        break
                    
                        case 1:

                        $('#toggle-event2').bootstrapToggle('enable');
                        $('#toggle_wrapper2').attr('class', 'checkbox enable');
                        $('#toggle-event2').bootstrapToggle('oon');
                        $('#onAIRstat2').removeClass();
                        $('#onAIRstat2').addClass('bereit');                            
                        $('#onAIRstat2').text('BEREIT')
                        
                        break
                    }
                    
                    if (live1 === undefined){
                    $('#autoID').attr("src",automSRC); //ID Bild laden für Automation
                    $('#onAIRstatAuto').text("ON AIR")
                    $('#automIP').text(automSourceIP);
                    $('#bitrateSourceAutom').text(automBitrate);
                    $('#streamStartAutom').text(automSourceStart);
                    $('#modIDautom').text(automSRCID);
                    $('#automName').text(automName);
                    $('#onAIRstatAuto').removeClass();
                    $('#onAIRstatAuto').addClass('blinken');

                    }
                    live2_pre = live2;
                    break
                }
        }
    });
        });
    }                       

refresh();
setInterval(function() {
refresh(); 
},2500);

$('#toggle_wrapper1').click(function(e){
    e.stopPropagation();

    $.getJSON("/now-playing/info-s1-json.php", function(data) {
        var status0 = streamMonStatus0();
        var live1 = data.ICESTATS["/live1"];
        status0.success(function (status00) {
    
    if (live1 === undefined){
        var a = false
    }else{
        var a = true;
    }
    switch (a){
    // Fall1 Live1 false also nicht belegt
        case false:
    // wenn status00 = 0 also Streammonitor aus
        if (status00 === 0){                    
            $().live1ON();
            $('#toggle-event1').bootstrapToggle('on');
    // sonst status00 = 1 also Streammonitor an, (else reicht wahrscheinlich), schalte aus und lege Schalter auf off                    
        }else{
            $().live1OFF();
            $('#toggle-event1').bootstrapToggle('off');
        }
        break
        case true:
        if (status00 === 0){                    
            $().live1ON();
            $('#toggle-event1').bootstrapToggle('on');
    // sonst status00 = 1 also Streammonitor an, (else reicht wahrscheinlich), schalte aus und lege Schalter auf off                    
        }
        break
    }

        })
    })
});


$('#toggle_wrapper2').click(function(e){
    e.stopPropagation();

    $.getJSON("/now-playing/info-s1-json.php", function(data) {
        var status1 = streamMonStatus1();
        var live2 = data.ICESTATS["/live2"];
        status1.success(function (status11) {
    
    if (live2 === undefined){
        var b = false;
    }else{
        var b = true;
    }
    switch (b){
        // Fall1 Live2 false also nicht belegt
            case false:
        // wenn status11 = 0 also Streammonitor aus
            if (status11 === 0){                    
                $().live2ON();
                $('#toggle-event2').bootstrapToggle('on');
        // sonst status11 = 1 also Streammonitor an, (else reicht wahrscheinlich), schalte aus und lege Schalter auf off                    
            }else{
                $().live2OFF();
                $('#toggle-event2').bootstrapToggle('off');
            }
            break
            case true:
            if (status11 === 0){                    
                $().live2ON();
                $('#toggle-event2').bootstrapToggle('on');
        // sonst status11 = 1 also Streammonitor an, (else reicht wahrscheinlich), schalte aus und lege Schalter auf off                    
            }
            break
        }

        })
    })
});

});
