// Code goes here
var spellbookApp = angular.module("spellbookApp", ['ngMaterial'])

function filterByClass(text, value) {
   return value["Spell Level"].includes(text)
}

spellbookApp.controller('spellbookController',
   function spellbookController($scope, $http) {
      var _data;
      var url = 'http://rawgit.com/RiotInferno/dungeonScripts/master/data/Swords%20%26%20Wizardry/Spells/spellData.json'
      var successCallback = function(response) {
         $scope.ClassItems = ['Magic-User', 'Cleric', 'Druid'];
         _data = response.data;
      };

      $http.get(url).then(successCallback, function(response) {});

      var _coords = [0.25, 5.75, 11.25, 16.75];

      var _getCoords = function(page) {
         var x = ((page - 1) % 2 === 0 ? 0.25 : 4.50);
         var y = _coords[parseInt((page - 1) / 2)];
         return [x, y];
      };

      var _getPositionStyle = function(page) {
         var coords = _getCoords(page);
         var x = coords[0];
         var y = coords[1];
         return 'style="position:absolute; ' +
            'left:' + x + 'in;' +
            'top:' + y + 'in";';
      };

      var _getHtml = function(spell, page) {
         if (spell === undefined) {
            return '';
         }

         return '<div id="spellPage' + page + '" class="spellView" ' +
            _getPositionStyle(page) + '>' +
            '<div>' +
            '<b>Name: </b>' + spell['Spell Name'] + '<br>' +
            '<b>Level: </b>' + spell['Spell Level'] + '<br>' +
            '<b>Range: </b>' + spell.Range + '<br>' +
            '<b>Duration: </b>' + spell.Duration + '<br>' +
            '<b>Description: </b><p>' + spell.Description +
            '</p></div></div>';
      };

      var _getImg = function(image, page) {
         if (image === undefined) {
            return '';
         }
         var coords = _getCoords(page);
         var x = coords[0];
         var y = coords[1];

         return '<div id="spellPage' + page + '" class="spellView" ' +
            _getPositionStyle(page) + '>' +
            '<img class="coverView" src="' + image + '"/>' +
            '</div>';
      };

      var _getStyle = function() {
         var html = $('<style>');
         $.ajax({
            url: 'style.css',
            success: function(data) {
               html.append(data);
            },
            async: false
         });
         return html;
      };

      $scope.save = function() {
         var html = "";

         var spellCount = ($scope.usePictures ? 6 : 8);
         var picCount = ($scope.usePictures ? 2 : 0);

         for (i = 1; i <= spellCount; i++) {
            html += _getHtml($scope['spellPage' + i.toString()], i);
         }

         if (picCount > 0) {
            html += _getImg($scope.backCover, 7);
            html += _getImg($scope.frontCover, 8);
         }

         var w = window.open();
         $(w.document.head).append(_getStyle());
         $(w.document.body).html(html);

         for (i = 1; i <= spellCount; i++) {
            var id = '#spellPage' + i;
            var divId = id + ' div';
            var h1 = $(divId, w.document.body).height();
            var h2 = $(id, w.document.body).height();
            while ($(divId, w.document.body).height() > $(id, w.document.body).height()) {
               $(divId, w.document.body).css('font-size', (parseInt($(divId, w.document.body).css('font-size')) - 1) + "px");
            }
         }
      };

      $scope.changed = function() {
         $scope.SpellData = _data.filter(filterByClass.bind(this, $scope.spellClass));
      };
   }
);