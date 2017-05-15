/**
 * Created by i855919 on 5/2/17.
 */
angular.module('mwl.calendar.docs', ['mwl.calendar', 'ngAnimate', 'ui.bootstrap', 'colorpicker.module']);
angular
    .module('mwl.calendar.docs') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
    .controller('KitchenSinkCtrl', function(moment, alert, calendarConfig,$http, $scope) {

        var vm = this;
        $http({
            method: "GET",
            url: '/getEvents'
        }).then(function (data) {

            vm.events = data.data;

        });
        $scope.addAppointment = function(){
            var time = $scope.events;
            $http({
                method:'post',
                url:'/addEvents',
                data:time
            }).then(function(res) {
                console.log(res);
                $http({
                    method: "GET",
                    url: '/getEvents'
                }).then(function (data) {

                    vm.events = data.data;

                });
            })
        }
        //These variables MUST be set as a minimum for the calendar to work
        vm.calendarView = 'month';
        vm.viewDate = new Date();
        var actions = [{
            label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
            onClick: function(args) {
                alert.show('Edited', args.calendarEvent);
            }
        }, {
            label: '<i class=\'glyphicon glyphicon-remove\'></i>',
            onClick: function(args) {
                alert.show('Deleted', args.calendarEvent);
            }
        }];


        // var i;
        // for (i = 0; i < 5; i++) {
        //     vm.events = [
        //
        //         {
        //             title: 'new event',
        //             color: calendarConfig.colorTypes.warning,
        //             startsAt: new Date(2017,4,1,1,30),
        //             endsAt: new Date(2017,4,1,2),
        //             draggable: true,
        //             resizable: true,
        //             actions: actions
        //         },{
        //             title: 'new event',
        //             color: calendarConfig.colorTypes.warning,
        //             startsAt: new Date(2017,4,1,1,30),
        //             endsAt: new Date(2017,4,1,2),
        //             draggable: true,
        //             resizable: true,
        //             actions: actions
        //         },
        //     ];
        //
        // }

        vm.cellIsOpen = true;

        vm.addEvent = function() {
            vm.events.push({
                title: 'New event',
                startsAt: moment().startOf('day').toDate(),
                endsAt: moment().endOf('day').toDate(),
                color: calendarConfig.colorTypes.important,
                draggable: true,
                resizable: true
            });
        };

        vm.eventClicked = function(event) {
            alert.show('Clicked', event);
        };

        vm.eventEdited = function(event) {
            alert.show('Edited', event);
        };

        vm.eventDeleted = function(event) {
            alert.show('Deleted', event);
        };

        vm.eventTimesChanged = function(event) {
            alert.show('Dropped or resized', event);
        };

        vm.toggle = function($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();
            event[field] = !event[field];
        };

        vm.timespanClicked = function(date, cell) {

            if (vm.calendarView === 'month') {
                if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
                    vm.cellIsOpen = false;
                } else {
                    vm.cellIsOpen = true;
                    vm.viewDate = date;
                }
            } else if (vm.calendarView === 'year') {
                if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
                    vm.cellIsOpen = false;
                } else {
                    vm.cellIsOpen = true;
                    vm.viewDate = date;
                }
            }

        };

    });
