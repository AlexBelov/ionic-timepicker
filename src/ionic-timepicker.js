//By Rajeshwar Patlolla
//https://github.com/rajeshwarpatlolla

angular.module('ionic-timepicker', ['ionic', 'ionic-timepicker.templates'])

// Defining `ionicTimepicker` directive
  .directive('ionicTimepicker', ['$ionicPopup', function ($ionicPopup) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        etime: '=etime',        //epoch time getting from a template
        format: '=format',      //format getting from a template
        step: '=step',          //step getting from a template
        callback: '=callback',  //callback function
        title: '=?title'        //optional popup title
      },
      link: function (scope, element, attrs) {

        element.on("click", function () {

          var obj = {epochTime: scope.etime, step: scope.step, format: scope.format, title: scope.title};

          scope.time = {hours: 0, minutes: 0, meridian: ""};

          var objDate = new Date(obj.epochTime * 60 * 1000);       // Epoch time in milliseconds.

          //Increasing the hours
          scope.increaseHours = function () {
            scope.time.hours = Number(scope.time.hours);
            if (obj.format == 12) {
              if (scope.time.hours != 12) {
                scope.time.hours += 1;
              } else {
                scope.time.hours = 1;
              }
            }
            if (obj.format == 24) {
              if (scope.time.hours != 23) {
                scope.time.hours += 1;
              } else {
                scope.time.hours = 0;
              }
            }
            scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
          };

          //Decreasing the hours
          scope.decreaseHours = function () {
            scope.time.hours = Number(scope.time.hours);
            if (obj.format == 12) {
              if (scope.time.hours > 1) {
                scope.time.hours -= 1;
              } else {
                scope.time.hours = 12;
              }
            }
            if (obj.format == 24) {
              if (scope.time.hours > 0) {
                scope.time.hours -= 1;
              } else {
                scope.time.hours = 23;
              }
            }
            scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
          };

          //Increasing the minutes
          scope.increaseMinutes = function () {
            scope.time.minutes = Number(scope.time.minutes);

            if (scope.time.minutes <= (60 - obj.step)) {
              scope.time.minutes += obj.step;
            } else {
              scope.time.minutes = 0;
            }
            scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
          };

          //Decreasing the hours
          scope.decreaseMinutes = function () {
            scope.time.minutes = Number(scope.time.minutes);
            if (scope.time.minutes >= obj.step) {
              scope.time.minutes -= obj.step;
            } else {
              scope.time.minutes = 60 - obj.step;
            }
            scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
          };

          if (obj.format == 12) {

            scope.time.meridian = (objDate.getUTCHours() >= 12) ? "PM" : "AM";
            scope.time.hours = (objDate.getUTCHours() > 12) ? ((objDate.getUTCHours() - 12)) : (objDate.getUTCHours());
            scope.time.minutes = (objDate.getUTCMinutes());

            if (scope.time.hours == 0 && scope.time.meridian == "AM") {
              scope.time.hours = 12;
            }

            scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
            scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;

            scope.changeMeridian = function () {
              scope.time.meridian = (scope.time.meridian === "AM") ? "PM" : "AM";
            };

            //Showing time picker modal for 12 hour format
            $ionicPopup.show({
              templateUrl: 'time-picker-12-hour.html',
              title: obj.title || '<strong>12-Hour Format</strong>',
              subTitle: '',
              scope: scope,
              buttons: [
                {
                  text: 'Close',
                  onTap: function (e) {
                    scope.callback(undefined);
                  }
                },
                {
                  text: 'Set',
                  type: 'button-positive',
                  onTap: function (e) {
                    scope.loadingContent = true;

                    var totalMin = 0;

                    if (!isNaN(parseInt(scope.time.minutes)) && !isNaN(parseInt(scope.time.hours))) {
                      if (scope.time.hours != 12) {
                        totalMin = (parseInt(scope.time.hours) * 60) + parseInt(scope.time.minutes);
                      } else {
                        totalMin = parseInt(scope.time.minutes);
                      }

                      if (scope.time.meridian === "AM") {
                        totalMin += 0;
                      } else if (scope.time.meridian === "PM") {
                        totalMin += 720;
                      }
                      scope.etime = totalMin;
                      scope.callback(scope.etime);
                    }
                  }
                }
              ]
            })

          } else if (obj.format == 24) {

            scope.time.hours = (objDate.getUTCHours());
            scope.time.minutes = (objDate.getUTCMinutes());

            scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
            scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;

            //Showing time picker modal for 24 hour format
            $ionicPopup.show({
              templateUrl: 'time-picker-24-hour.html',
              title: obj.title || '<strong>24-Hour Format</strong>',
              subTitle: '',
              scope: scope,
              buttons: [
                {
                  text: 'Close',
                  onTap: function (e) {
                    scope.callback(undefined);
                  }
                },
                {
                  text: 'Set',
                  type: 'button-positive',
                  onTap: function (e) {

                    scope.loadingContent = true;

                    var totalMin = 0;

                    if (scope.time.hours != 24) {
                      totalMin = (parseInt(scope.time.hours) * 60) + parseInt(scope.time.minutes);
                    } else {
                      totalMin = parseInt(scope.time.minutes);
                    }
                    scope.etime = totalMin;
                    scope.callback(scope.etime);
                  }
                }
              ]
            })

          }

        });

      }
    };
  }]);
