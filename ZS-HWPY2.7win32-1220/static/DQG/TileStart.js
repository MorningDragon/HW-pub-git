
function TileStart(tiles, camera, drawFunction) {
    var octantTile = [];
    octantTile[0] = new TriangleTile("0", 0, 0.0, 0.0, 90.0, 90.0);
    octantTile[1] = new TriangleTile("1", 0, 90.0, 0.0, 180.0, 90.0);
    octantTile[2] = new TriangleTile("2", 0, -180.0, 0.0, -90.0, 90.0);
    octantTile[3] = new TriangleTile("3", 0, -90.0, 0.0, 0.0, 90.0);
    octantTile[4] = new TriangleTile("4", 0, 0.0, -90.0, 90.0, 0.0);
    octantTile[5] = new TriangleTile("5", 0, 90.0, -90.0, 180.0, 0.0);
    octantTile[6] = new TriangleTile("6", 0, -180.0, -90.0, -90.0, 0.0);
    octantTile[7] = new TriangleTile("7", 0, -90.0, -90.0, 0.0, 0.0);

    if (drawFunction === "drawSingleScaleTiles") {
        for (var i = 0; i < octantTile.length; i++) {
            var isOctantTileVisible = isTriangleTileVisible(octantTile[i], camera);
            if (isOctantTileVisible) {
                octantTile[i].singleScaleTileUpdate(tiles, camera);
            }
        }
    }
    else if (drawFunction === "drawMultiScaleTiles") {
        for (var i = 0; i < octantTile.length; i++) {
            var isOctantTileVisible = isTriangleTileVisible(octantTile[i], camera);
            if (isOctantTileVisible) {
                octantTile[i].update(tiles, camera);
            }
        }
    }

 }

var rectangleS = new Cesium.Rectangle();
function isIntersectionBestS(tile, camera) {
    rectangleS.west = tile.west * PI / 180;
    rectangleS.south = tile.south * PI / 180;
    rectangleS.east = tile.east * PI / 180;
    rectangleS.north = tile.north * PI / 180;

    // 构建格网包围盒(这里是包围球)
    tile.boundingBox = Cesium.BoundingSphere.fromRectangle3D(rectangleS, ellipsoid, 0.0, boundingBox);
    // 创建视椎体 camera.frustum是调用PerspectiveFrustum的默认值生成的，因而有computeCullingVolume函数并且只需输入三个参数
    var cullingVolume = camera.frustum.computeCullingVolume(camera.positionWC, camera.directionWC, camera.upWC);
    // 判断视椎体与格网包围盒是否相交(包围盒与包围球都有下面这个computeVisibility函数)
    var intersection = cullingVolume.computeVisibility(tile.boundingBox);
    var ifPointVisible = false;

    // 过滤视椎体中位于可视线（地球水平线）后面的点
    if (intersection != -1) {
        var occluder = new Cesium.EllipsoidalOccluder(ellipsoid, camera.position);
        var tileCenter = Cesium.Cartesian3.fromDegrees(tile.cenLon, tile.cenLat);
        var factor = 1 / Math.cos((tile.north - tile.south) * PI / 360);
        var point = Cesium.Cartesian3.multiplyByScalar(tileCenter, factor, unUsedPoint);
        var scaledSpacePoint = ellipsoid.transformPositionToScaledSpace(point);
        ifPointVisible = occluder.isScaledSpacePointVisible(scaledSpacePoint);
    }
    return ifPointVisible;
}

