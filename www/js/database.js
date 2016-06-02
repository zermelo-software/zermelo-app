/* 
 * This file is part of the Zermelo App.
 * 
 * Copyright (c) Zermelo Software B.V. and contributors
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

var currentobj;
var refreshData = false;
var failure = false;
var me;
var nextPrev;
var datepickergo;
var Week;
// create database
function createDatabase() {
    //if not exists create database or open database
    db = window.openDatabase('Zermelo', '1.0', 'Appoinments', 2 * 1024 * 1024);
    db.transaction(function (tx) {
        //create table appointment
        tx.executeSql('CREATE TABLE IF NOT EXISTS APPOINTMENTS (' +
            'appointment_id LONG,' +
            'start_time LONG, ' +
            'end_time LONG, ' +
            'subjects TEXT,' +
            'teacher TEXT,' +
            'groups TEXT,' +
            'locations TEXT,' +
            'type TEXT,' +
            'remark TEXT,' +
            'valid TEXT,' +
            'cancelled TEXT,' +
            'modified TEXT,' +
            'moved TEXT,' +
            'new_appointment TEXT,' +
            'original_appointment LONG,' +
            'updated_appointment LONG,' +
            'change_description TEXT,' +
            'weeknumber TEXT,' +
            'refreshFlag BOOL)'
        );
    });
}

// delete data from appointment table before insert data into table
function deleteappointmentdata(startweek, endweek) {
    db.transaction(function (tx) {
        tx.executeSql('DELETE  from APPOINTMENTS where weeknumber in (' + startweek + ',' + endweek + ')');
    }, errorDB, successDB);
}
function deleteappointmentdatas() {
    db.transaction(function (tx) {
        tx.executeSql('DELETE  from APPOINTMENTS');
    }, errorDB, successDB);
}

function errorDB(err) {
    alert("Error processing SQL: " + err.message);
}

function successDB() {
  //  console.log("success fully delete");
}
function fix(x) {
	if (x == null) return '';
	return x;
}

/**insert data into table
    @param decode : json data
    @param m :view object
    @param currentObj:view object
    @param refresh : refresh flag
    @param nextprev:direction of next prev
    @param datepickerGo:goto selected date or week
    @param week:date
*/
function insertData(input_list, currentObj, refresh, m, nextprev, datepickerGo, week) {
    decode = input_list;
    refreshData = refresh
    currentobj = currentObj;
    me = m;
    nextPrev = nextprev;
    datepickergo = datepickerGo;
    Week = week;

    var appointment_store = Ext.getStore('appointment_store');

    input_list.forEach(function(input) {
        var weeknumber = new Date(input.start * 1000).getWeek();
        input.weeknumber = weeknumber + "" + new Date(input.start * 1000).getFullYear();
        appointment_store.insert(input);
    });

    appointment_store.each(function(record) {
        console.log(record);
    });

    db.transaction(function insertData(tx) {
            var q = 'INSERT INTO APPOINTMENTS (' +
                'appointment_id ,' +
                'start_time , ' +
                'end_time, ' +
                'subjects ,' +
                'teacher ,' +
                'groups ,' +
                'locations ,' +
                'type ,' +
                'remark ,' +
                'valid,' +
                'cancelled ,' +
                'modified ,' +
                'moved ,' +
                'new_appointment,' +
                'original_appointment,' +
                'updated_appointment,' +
                'change_description,weeknumber,refreshFlag) ' +
                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)';
            _(decode).each(function (decode) {
                var weeknumber = new Date(decode.start * 1000).getWeek();
                weeknumber = weeknumber + "" + new Date(decode.start * 1000).getFullYear();
                tx.executeSql(q, [decode.id.toString(), decode.start, decode.end, fix(decode.subjects).replace(/"/g, ''), fix(decode.teachers).replace(/"/g, ''), fix(decode.groups).replace(/"/g, ''),
                    fix(decode.locations).replace(/"/g, ''), decode.type, decode.remark, decode.valid, decode.cancelled, decode.modified, decode.moved,
                    decode.isNew, decode.original_appointment, decode.updated_appointment, decode.changeDescription, weeknumber, 'false'
                ]);
            });

        },
        function errorDB(err) {
            me.unmask();
            alert("Error processing SQL: " + err.message);
        },
        function successDB() {
            //create query for fetching all data from db
            var query = 'select appointment_id,start_time,end_time,subjects,teacher,locations,groups,type,cancelled,modified,moved,new_appointment,remark,change_description ,valid from APPOINTMENTS ';
            getAppointmentData(query, function () {
                if (refreshData) {
                    //calendar view only current day calendar view refresh
                    if (todayFlag && !datepickerGo && nextPrev == '') {
                        currentobj.destroyCalendar();
                        currentobj.renderFullCalendar();
                        if (dayview == "dayview")
                            currentobj.changeCalendarView('agendaDay');
                        currentobj.getScrollable().getScroller().scrollTo(0, scrollTopHeight - (scrollTopHeight * 10 / 100));
                    } else if (nextPrev != '') {
                        currentobj.navigateCalendar(nextPrev);

                    } else if (datepickergo) {
                        $('#' + currentobj.getPlaceholderid()).fullCalendar('gotoDate', Week.getFullYear(), Week.getMonth(), Week.getDate());
                        currentobj.changeTitle();
                    } else {
                        currentobj.renderCalendar();
                    }
                    updateView(currentobj);
                }
                // only first time render after getting  data from server
                else {
                    currentobj.renderFullCalendar();
                    currentobj.getScrollable().getScroller().scrollTo(0, scrollTopHeight - (scrollTopHeight * 10 / 100));
                    updateView(currentobj);
                }
                me.unmask();

            });

        });

}
/**Get count number of record of selected weeknumber
@param query: sql query
@param weeknumber: week number for get this week data
@param callBack : callback function
*/
function getRecodrdCount(query, weeknumber, callBack) {
    db.transaction(function (tx) {
        tx.executeSql(query, [weeknumber, 'true'], function (tx, result) {
            callBack(result.rows.item(0).count);
        }, errorDB);
    })
}
/**update refresh flag when refresh data 
@param query: sql query
*/
function updateRefreshFlag(query) {
    db.transaction(function (tx) {
        tx.executeSql(query, ['true'], function (tx, result) {
          //  console.log("update");
        }, errorDB);
    })
}

function logCollision(main, sub, eventArray) {
    if (eventArray[sub].valid == 'true') {
        eventArray[main].collision = true;
        console.log(eventArray[main].multiid, eventArray[sub].id, eventArray[main].multiid.includes("," + eventArray[sub].id));
        // if (!eventArray[main].multiid.substring("," + eventArray[sub].id)) {
            eventArray[main].multiid = (eventArray[main].multiid ? eventArray[main].multiid : eventArray[main].id) + "," + eventArray[sub].id;
        // }
    }
}

function detectCollision(i, j) {
    if (i.valid == 'true' 
        && j.valid == 'true' 
        && ((j.start_time <= i.start_time && i.start_time < j.end_time) || (i.start_time <= j.start_time && j.start_time < i.end_time))
    ) {
        var iMultiid = i.multiid ? i.multiid.split(",") : [i.id];
        var jMultiid = j.multiid ? j.multiid.split(",") : [j.id];
        var mergedMultiid = _.union(iMultiid, jMultiid).join(",");

        i.multiid = mergedMultiid;
        j.multiid = mergedMultiid;
        i.collision = true;
        j.collision = true;
    }
}

function getAppointmentData(query, callBack) {
    db.transaction(function (tx) {
        tx.executeSql(query, [], function (tx, results) {
            eventArray.length = 0;
            for (i = 0; i < results.rows.length; i++) {
                var start_date = new Date((results.rows.item(i).start_time) * 1000);
               // console.log("start : "+start_date);
                var end_date = new Date((results.rows.item(i).end_time) * 1000);
                //console.log("date : "+end_date);
                var obj = {
                    id: results.rows.item(i).appointment_id,
                    start: start_date,
                    end: end_date,
                    start_time:results.rows.item(i).start_time,
                    end_time:results.rows.item(i).end_time,
                    teacher: (results.rows.item(i).teacher).toUpperCase(),
                    subject: results.rows.item(i).subjects,
                    locations: results.rows.item(i).locations,
                    groups: results.rows.item(i).groups,
                    type: results.rows.item(i).type,
                    cancelled: results.rows.item(i).cancelled,
                    modified: results.rows.item(i).modified,
                    moved: results.rows.item(i).moved,
                    new_appointment: results.rows.item(i).new_appointment,
                    remark: results.rows.item(i).remark,
                    change_description: results.rows.item(i).change_description,
                    valid: results.rows.item(i).valid,
                    collision:false,
                    multiid:"",
                    allDay: false
                };
                eventArray.push(obj);
            }
            //get multiple appointment from data 
            for ( i = 0; i < eventArray.length; i++) {
                for ( j = i + 1; j < eventArray.length; j++) {
                    detectCollision(eventArray[i], eventArray[j]);
                }
            }
            
            callBack();
        }, errorCB);

    });
}

//fail query fire 
function errorCB(err) {
   // console.log("Error processing SQL: " + err.code);
    alert("Error processing SQL: " + err.code);
}
