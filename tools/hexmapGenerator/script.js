//http://www.storminthecastle.com/2013/07/24/how-you-can-draw-regular-polygons-with-the-html5-canvas-api/

var hexmapApp = angular.module("hexmapApp", ['ngMaterial'])
    .controller('hexmapController',
        function hexmapController($scope, $http){
            function polygon(ctx, x, y, _radius, sides, startAngle, anticlockwise) {
                if (sides < 3) return;
                var a = (Math.PI * 2) / sides;
                a = anticlockwise ? -a : a;
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(startAngle);
                ctx.moveTo(_radius, 0);
                for (var i = 1; i < sides; i++) {
                    ctx.lineTo(_radius * Math.cos(a * i), _radius * Math.sin(a * i));
                }
                ctx.closePath();
                ctx.restore();
            }

            var _radius = 20;
            var _startX = 1.5;
            var _startY = 1.5;
            var _tiles = {
                plain: 'LightGreen',
                scrub: 'Khaki',
                forest: 'ForestGreen',
                rough: 'Olive',
                desert: 'Peru',
                hills: 'DarkKhaki',
                mountains: 'Sienna',
                marsh: 'LightSlateGray',
                water: 'SkyBlue'
            };
            var _terrainChart = null;

            function _getCoords(row, column) {
                var x = _startX + column + ((row % 2 == 0) ? 0 : 0.5 );
                var y = _startY + (0.75 * row);
                return {
                    x: x,
                    y: y 
                };
            };

            function _setCanvasSize(rows, columns) {
                var canvas = document.getElementById('canvasMap');
                canvas.width = columns * _radius * 2 + (_startX * _radius * 2);
                canvas.height = rows * _radius * 2 + (_startY * _radius * 2);
            };

            function _getRandomTile() {
                var ret;
                var c = 0;
                for (var key in _tiles) {
                    if (Math.random() < 1 / ++c) {
                        ret = key;
                    }
                }
                return ret;
            }

            function _draw(coords, tile) {
                var xscale = 2 * .90;
                var yscale = 2;

                var context = document.getElementById('canvasMap').getContext('2d');
                context.beginPath();
                var x = xscale * _radius * coords.x;
                var y = yscale * _radius * coords.y;
                polygon(context, x, y, _radius, 6, -Math.PI / 2);
                context.fillStyle = _tiles[tile];
                context.fill();
                context.stroke();
            };

            var _successCallback = function (response) {
                _terrainChart = response.data;

            };

            function _getData($http) {
                $.ajax({
                    dataType: "json",
                    url: 'terrainChart.json',
                    success: _successCallback,
                    async: false
                });
            };

            $scope.rows = 5;
            $scope.columns = 5;

            $scope.onCreateClick = function () {
                if ($scope.hexmapForm.$valid) {
                    _getData( $http );
                    _setCanvasSize($scope.rows, $scope.columns);
                    for (var col = 0; col < $scope.columns; ++col) {
                        for (var row = 0; row < $scope.rows; ++row) {
                            _draw(_getCoords(row, col), _getRandomTile() );
                        }
                    }
                }
                else {
                    alert("Invalid Form");
                }
            };
        }
    );