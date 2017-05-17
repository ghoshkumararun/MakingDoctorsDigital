/**
 * Created by i855919 on 5/2/17.
 */
angular
    .module('mwl.calendar.docs')
    .factory('alert', function($uibModal) {

        function show(action, event) {
            return $uibModal.open({
                templateUrl: 'javascripts/modalContent.html',
                controller: function() {
                    var vm = this;
                    vm.action = action;
                    vm.event = event;
                },
                controllerAs: 'vm'
            });
        }

        return {
            show: show
        };

    });
