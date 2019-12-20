// 实现格网分析、表达、应用的功能函数

/**
 * 为不同轨迹串生成随机颜色
 * @param arrayLength
 * @param alpha
 * @returns {[]}
 */
function gridRandomColor(arrayLength, alpha) {
    var gridsColor = [];
    gridsColor[0] = [Cesium.Color.GREENYELLOW, Cesium.Color.CYAN];
    if (alpha != undefined) {
        for (var i = 1; i < arrayLength; ++i) {
            gridsColor[i] = [Cesium.Color.fromRandom({alpha: alpha}), Cesium.Color.fromRandom({alpha: alpha})];
        }
        return gridsColor;
    }
    for (var j = 1; j < arrayLength; ++j) {
        gridsColor[j] = [Cesium.Color.fromRandom(), Cesium.Color.fromRandom()];
    }
    return gridsColor;
}

var gridPrimitives = [];
gridPrimitives[0] = [];
gridPrimitives[1] = [];

/**
 * 绘制带边框的面片
 * @param grids 要绘制的格网
 * @param outlineColor 格网线框颜色
 * @param patchColor 格网面片颜色
 * @param k 格网串的序号
 */
function drawOutlineAndPatch(grids, outlineColor, patchColor, k) {
    var num = k;
    var outlineInstances = [];
    var patchInstances = [];

    for (var m = 0; m < grids.length; ++m) {
        outlineInstances.push(
            new Cesium.GeometryInstance({
                geometry: new Cesium.RectangleOutlineGeometry({
                    rectangle: Cesium.Rectangle.fromDegrees(grids[m].west, grids[m].south, grids[m].east, grids[m].north),
                    height: 1.0
                }),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(outlineColor)
                }
            })
        );
    }
    for (var n = 0; n < grids.length; ++n) {
        patchInstances.push(
            new Cesium.GeometryInstance({
                geometry: new Cesium.RectangleGeometry({
                    rectangle: Cesium.Rectangle.fromDegrees(grids[n].west, grids[n].south, grids[n].east, grids[n].north),
                    height: 1.0
                }),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(patchColor)
                }
            })
        )
    }

    gridPrimitives[0][num] = new Cesium.Primitive({
        geometryInstances: outlineInstances,
        asymmetricKeySize: false,
        compressVertices: false,
        cull: false,
        show: false,
        appearance: new Cesium.PerInstanceColorAppearance({
            flat: true,
            translucent: false,
            renderState: {
                lineWidth: 1
            }
        })
    });
    gridPrimitives[1][num] = new Cesium.Primitive({
        geometryInstances: patchInstances,
        asynchronous : false,
        compressVertices: false,
        cull: false,
        show: false,
        appearance: new Cesium.PerInstanceColorAppearance({
            flat: true,
            translucent: true,
        })
    });
    scene.primitives.add(gridPrimitives[0][num]);
    scene.primitives.add(gridPrimitives[1][num]);
}

/**
 * 根据格网编码绘制格网
 * @param GridCodes DQG格网编码
 * @param gridsColor 格网线框、面片颜色
 */
function drawGridsFromCodes(GridCodes, gridsColor) {
    var trackGrids = [];
    var num = 0;

    if (gridPrimitives[0].length > 1) {
        for (var m = 0; m < gridPrimitives[0].length; ++m) {
            scene.primitives.remove(gridPrimitives[0][m]);
            scene.primitives.remove(gridPrimitives[1][m]);
        }
        gridPrimitives[0] = [];
        gridPrimitives[1] = [];
    }

    for (var k = 0; k < GridCodes.length; ++k) {
        trackGrids[k] = [];
        for (var i = 3, num = 0; i < GridCodes[k].length; ++i, ++num) {
            trackGrids[k][num] = codeToLonLat(GridCodes[k][i]);
        }
    }

    drawOutlineAndPatch(trackGrids[0], gridsColor[0][0], gridsColor[0][1], 0);
    gridPrimitives[0][0].show = true;
    gridPrimitives[1][0].show = true;
    for (var j = 1; j < trackGrids.length; ++j) {
        drawOutlineAndPatch(trackGrids[j], gridsColor[1][0], gridsColor[1][1], j);
    }
}

var multiScaleTilePrimitives = undefined;

/**
 * 绘制多尺度格网
 */
function drawMultiScaleTiles() {
    var multiScaleTileInstances = [];
    var DQGTiles = new Array();
    TileStart(DQGTiles, camera);
    scene.primitives.remove(multiScaleTilePrimitives);
    for (var i = 0; i < DQGTiles.length; i++) {
        multiScaleTileInstances.push(
            new Cesium.GeometryInstance({
                geometry: new Cesium.RectangleOutlineGeometry({
                    rectangle: Cesium.Rectangle.fromDegrees(DQGTiles[i].west, DQGTiles[i].south, DQGTiles[i].east, DQGTiles[i].north),
                    height: camera.altitudeDistance
                }),
                id: DQGTiles[i].Morton,
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CYAN) //GOLD //GREENYELLOW
                }
            })
        );
    }
    multiScaleTilePrimitives = new Cesium.Primitive({
        geometryInstances: multiScaleTileInstances,
        asynchronous : false,
        compressVertices: false,
        cull: false,
        appearance: new Cesium.PerInstanceColorAppearance({
            flat: true,
            translucent: false,
            renderState: {
                lineWidth: 1
            }
        })
    });
    scene.primitives.add(multiScaleTilePrimitives);
}

var singleScaleTilePrimitives = undefined;

/**
 * 绘制单尺度格网
 */
function drawSingleScaleTiles() {
    var singleScaleTileInstances = [];
    var DQGTiles = [];
    camera.maxTileLevel = 0;
    TileStart(DQGTiles, camera, "drawSingleScaleTiles");
    scene.primitives.remove(singleScaleTilePrimitives);
    for (var j = 0; j < DQGTiles.length; j++) {
        if (DQGTiles[j].level == camera.maxTileLevel) {
            singleScaleTileInstances.push(
                new Cesium.GeometryInstance({
                    geometry: new Cesium.RectangleOutlineGeometry({
                        rectangle: Cesium.Rectangle.fromDegrees(DQGTiles[j].west, DQGTiles[j].south, DQGTiles[j].east, DQGTiles[j].north),
                        height: camera.altitudeDistanceMorton
                    }),
                    compressVertices: false,
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.SILVER) //ORANGERED
                    }
                })
            );
        }
    }
    singleScaleTilePrimitives = new Cesium.Primitive({
        geometryInstances: singleScaleTileInstances,
        asynchronous : false,
        appearance: new Cesium.PerInstanceColorAppearance({
            flat: true,
            translucent: false,
            renderState: {
                lineWidth: 1.0
            }
        })
    });
    scene.primitives.add(singleScaleTilePrimitives);
}