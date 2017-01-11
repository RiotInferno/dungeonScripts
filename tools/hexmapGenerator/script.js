//http://www.storminthecastle.com/2013/07/24/how-you-can-draw-regular-polygons-with-the-html5-canvas-api/

var hexmapApp = angular.module("hexmapApp", ['ngMaterial'])
    .controller('hexmapController',
        function hexmapController($scope, $http){
            function polygon(ctx, x, y, _radius, sides, startAngle, anticlockwise) {
                if (sides < 3) return;
                var a = Math.PI * 2 / sides;
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

            var _url = 'https://rawgit.com/RiotInferno/dungeonScripts/master/data/custom/terrainChart.json';
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
            var _tileMap = [[],[]];

            function _getCoords(row, column) {
                var x = _startX + column + (row % 2 === 0 ? 0 : 0.5 );
                var y = _startY + 0.75 * row;
                return {
                    x: x,
                    y: y 
                };
            }

            function _setCanvasSize(rows, columns) {
                var canvas = document.getElementById('canvasMap');
                canvas.width = columns * _radius * 2 + _startX * _radius * 2;
                canvas.height = rows * _radius * 2 + _startY * _radius * 2;
            }

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
            }

            var logItems = (value, key, obj) => {
                if (obj.hasOwnProperty(key)) {
                    console.log(`${key} => ${obj[key].result}`);
                }
            };

            var getArray = (value) => Array(value.weight).fill(value.result);

            var squash = function (value, key, obj) {
                var retVal = [];
                for (entry in value) {
                    retVal.push(value[entry]);
                }
                return R.flatten(retVal);
            };

            var _successCallback = function (response) {
                var alist = R.map(R.mapObjIndexed(getArray), response);
                _terrainChart = R.mapObjIndexed(squash, alist);
            };

            function _getData($http) {
                $.ajax({
                    dataType: "json",
                    url: _url, 
                    success: _successCallback,
                    async: false
                });
            }
            
            function _getNextTile(currentTile) {
                var max = 20;
                var min = 1;
                var chance = Math.floor(Math.random() * (max - min) + min);
                return _terrainChart[currentTile][chance - 1];
            }

            $scope.rows = 5;
            $scope.columns = 5;

            $scope.onCreateClick = function () {
                if ($scope.hexmapForm.$valid) {
                    _getData( $http );
                    _setCanvasSize($scope.rows, $scope.columns);
                    var tile = _getRandomTile();

                    _tileMap = new Array($scope.rows);
                    for (var i = 0; i< _tileMap.length; i++) {
                        _tileMap[i] = new Array($scope.columns);
                    }

                    for (var col = 0; col < $scope.columns; ++col) {
                        for (var row = 0; row < $scope.rows; ++row) {
                            if (row === 0 && col === 0) {
                                tile = _getRandomTile();
                            } else {
                                tile = row === 0 ? _tileMap[row][col - 1] : tile;
                            }
                            tile = _getNextTile(tile);
                            _tileMap[row][col] = tile;
                            _draw(_getCoords(row, col), tile );
                        }
                    }
                }
                else {
                    alert("Invalid Form");
                }
            };
        }
    );