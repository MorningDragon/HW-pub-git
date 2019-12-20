function TriangleTile(morton, level, west, south, east, north) {
    this.Morton = morton;
    this.level = level;
    this.west = west;
    this.south = south;
    this.east = east;
    this.north = north;
    this.height = undefined;
    this.cenLon = (west + east) / 2;
    this.cenLat = (south + north) / 2;
    this.center = Cesium.Cartesian3.fromDegrees(this.cenLon, this.cenLat);
    this.LTChild = undefined;
    this.RTChild = undefined;
    this.LBChild = undefined;
    this.RBChild = undefined;
    this.boundingBox = undefined;
    this.intersection = undefined;
    this.changeColor = false;
    // this.color = new Cesium.Color.CYAN.withAlpha(0.005);
}

function ThreeDimensionTriangleTile(morton, level, west, south, east, north, bottom, top) {
    this.Morton = morton;
    this.level = level;
    this.west = west;
    this.south = south;
    this.east = east;
    this.north = north;
    this.bottom = bottom;
    this.top = top;
    this.height = undefined;
    this.cenLon = (west + east) / 2;
    this.cenLat = (south + north) / 2;
    this.cenAlt = (bottom + top) / 2;
    this.center = Cesium.Cartesian3.fromDegrees(this.cenLon, this.cenLat, this.cenAlt);
    this.BLTChild = undefined;
    this.BRTChild = undefined;
    this.BLBChild = undefined;
    this.BRBChild = undefined;
    this.TLTChild = undefined;
    this.TRTChild = undefined;
    this.TLBChild = undefined;
    this.TRBChild = undefined;
    this.boundingBox = undefined;
    this.intersection = undefined;
 }

TriangleTile.prototype.update = function (tiles, camera) {
    var isPointVisible = isTriangleTileVisible(this, camera);
    var isSubDivision = isSubDivisionVisible(this, camera);
    if (this.cenLat > 0) {
        if (isSubDivision < c3 && isPointVisible) {
            if (this.LTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
                this.computeChildren();
            }
            this.LTChild.update(tiles, camera);
            this.LBChild.update(tiles, camera);
            this.RBChild.update(tiles, camera);
        }
        else if (isPointVisible) {
            this.LTChild = undefined;
            this.LBChild = undefined;
            this.RBChild = undefined;
            if (this.level > camera.maxWholeTileLevel) {
                camera.maxWholeTileLevel = this.level;
            }
            tiles.push(this);
        }
        if (!isPointVisible) {
            this.Morton = undefined;
            this.level = undefined;
            this.west = undefined;
            this.south = undefined;
            this.east = undefined;
            this.north = undefined;
            this.height = undefined;
            this.cenLon = undefined;
            this.cenLat = undefined;
            this.center = undefined;
            this.LTChild = undefined;
            this.LBChild = undefined;
            this.RBChild = undefined;
            this.boundingBox = undefined;
            this.intersection = undefined;
            // this.color = undefined;
        }
    }
    else {
        if (isSubDivision < c3 && isPointVisible) {
            if (this.LTChild == undefined && this.RTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
                this.computeChildren();
            }
            this.LTChild.update(tiles, camera);
            this.RTChild.update(tiles, camera);
            this.RBChild.update(tiles, camera);
        }
        else if (isPointVisible) {
            this.LTChild = undefined;
            this.RTChild = undefined;
            this.RBChild = undefined;
            if (this.level > camera.maxWholeTileLevel) {
                camera.maxWholeTileLevel = this.level;
            }
            tiles.push(this);
        }
        if (!isPointVisible) {
            this.Morton = undefined;
            this.level = undefined;
            this.west = undefined;
            this.south = undefined;
            this.east = undefined;
            this.north = undefined;
            this.width = undefined;
            this.height = undefined;
            this.cenLon = undefined;
            this.cenLat = undefined;
            this.center = undefined;
            this.LTChild = undefined;
            this.RTChild = undefined;
            this.RBChild = undefined;
            this.boundingBox = undefined;
            this.intersection = undefined;
            // this.color = undefined;
        }
    }
 };

TriangleTile.prototype.singleScaleTileUpdate = function (tiles, camera) {
    var isPointVisible = isTriangleTileVisible(this, camera);
    var isSubDivision = isMortonSubDivisionVisible(this, camera);
    if (this.cenLat > 0) {
        if (isSubDivision < camera.subdivisionFactor && isPointVisible) {
            if (this.LTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
                this.computeChildren();
            }
            this.LTChild.singleScaleTileUpdate(tiles, camera);
            this.LBChild.singleScaleTileUpdate(tiles, camera);
            this.RBChild.singleScaleTileUpdate(tiles, camera);
        }
        else if (isPointVisible) {
            this.LTChild = undefined;
            this.LBChild = undefined;
            this.RBChild = undefined;
            tiles.push(this);
        }
        if (!isPointVisible) {
            this.Morton = undefined;
            this.level = undefined;
            this.west = undefined;
            this.south = undefined;
            this.east = undefined;
            this.north = undefined;
            this.height = undefined;
            this.cenLon = undefined;
            this.cenLat = undefined;
            this.center = undefined;
            this.LTChild = undefined;
            this.LBChild = undefined;
            this.RBChild = undefined;
            this.boundingBox = undefined;
            this.intersection = undefined;
        }
    }
    else {
        if (isSubDivision < camera.subdivisionFactor && isPointVisible) {
            if (this.LTChild == undefined && this.RTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
                this.computeChildren();
            }
            this.LTChild.singleScaleTileUpdate(tiles, camera);
            this.RTChild.singleScaleTileUpdate(tiles, camera);
            this.RBChild.singleScaleTileUpdate(tiles, camera);
        }
        else if (isPointVisible) {
            this.LTChild = undefined;
            this.RTChild = undefined;
            this.RBChild = undefined;
            tiles.push(this);
        }
        if (!isPointVisible) {
            this.Morton = undefined;
            this.level = undefined;
            this.west = undefined;
            this.south = undefined;
            this.east = undefined;
            this.north = undefined;
            this.width = undefined;
            this.height = undefined;
            this.cenLon = undefined;
            this.cenLat = undefined;
            this.center = undefined;
            this.LTChild = undefined;
            this.RTChild = undefined;
            this.RBChild = undefined;
            this.boundingBox = undefined;
            this.intersection = undefined;
        }
    }
};

TriangleTile.prototype.singleThreeDimensionUpdate = function (tiles, camera) {
    var isPointVisible = isTriangleTileVisible(this, camera);
    var isSubDivision = isSingleThreeDimensionSubDivisionVisible(this, camera);
    if (this.cenLat > 0) {
        if (isSubDivision < camera.subdivisionFactor && isPointVisible) {
            if (this.LTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
                this.computeChildren();
            }
            this.LTChild.singleThreeDimensionUpdate(tiles, camera);
            this.LBChild.singleThreeDimensionUpdate(tiles, camera);
            this.RBChild.singleThreeDimensionUpdate(tiles, camera);
        }
        else if (isPointVisible) {
            this.LTChild = undefined;
            this.LBChild = undefined;
            this.RBChild = undefined;
            tiles.push(this);
        }
        if (!isPointVisible) {
            this.Morton = undefined;
            this.level = undefined;
            this.west = undefined;
            this.south = undefined;
            this.east = undefined;
            this.north = undefined;
            this.height = undefined;
            this.cenLon = undefined;
            this.cenLat = undefined;
            this.center = undefined;
            this.LTChild = undefined;
            this.LBChild = undefined;
            this.RBChild = undefined;
            this.boundingBox = undefined;
            this.intersection = undefined;
        }
    }
    else {
        if (isSubDivision < camera.subdivisionFactor && isPointVisible) {
            if (this.LTChild == undefined && this.RTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
                this.computeChildren();
            }
            this.LTChild.singleThreeDimensionUpdate(tiles, camera);
            this.RTChild.singleThreeDimensionUpdate(tiles, camera);
            this.RBChild.singleThreeDimensionUpdate(tiles, camera);
        }
        else if (isPointVisible) {
            this.LTChild = undefined;
            this.RTChild = undefined;
            this.RBChild = undefined;
            tiles.push(this);
        }
        if (!isPointVisible) {
            this.Morton = undefined;
            this.level = undefined;
            this.west = undefined;
            this.south = undefined;
            this.east = undefined;
            this.north = undefined;
            this.width = undefined;
            this.height = undefined;
            this.cenLon = undefined;
            this.cenLat = undefined;
            this.center = undefined;
            this.LTChild = undefined;
            this.RTChild = undefined;
            this.RBChild = undefined;
            this.boundingBox = undefined;
            this.intersection = undefined;
        }
    }
};

ThreeDimensionTriangleTile.prototype.threeDimensionUpdate = function (tiles, camera) {
    if (this.cenLat > 0) {
        if (this.level < 3) {
            if (this.BLTChild == undefined && this.BLBChild == undefined && this.BRBChild == undefined &&
                this.TLTChild == undefined && this.TLBChild == undefined && this.TRBChild == undefined) {
                this.computeThreeDimensionChildren();
            }
            this.BLTChild.threeDimensionUpdate(tiles, camera);
            this.BLBChild.threeDimensionUpdate(tiles, camera);
            this.BRBChild.threeDimensionUpdate(tiles, camera);
            this.TLTChild.threeDimensionUpdate(tiles, camera);
            this.TLBChild.threeDimensionUpdate(tiles, camera);
            this.TRBChild.threeDimensionUpdate(tiles, camera);
        }
        else {
            this.BLTChild = undefined;
            this.BLBChild = undefined;
            this.BRBChild = undefined;
            this.TLTChild = undefined;
            this.TLBChild = undefined;
            this.TRBChild = undefined;
            tiles.push(this);
        }
    }
    else {
        if (this.level < 3) {
            if (this.BLTChild == undefined && this.BRTChild == undefined && this.BRBChild == undefined &&
                this.TLTChild == undefined && this.TRTChild == undefined && this.TRBChild == undefined) {
                this.computeThreeDimensionChildren();
            }
            this.BLTChild.threeDimensionUpdate(tiles, camera);
            this.BRTChild.threeDimensionUpdate(tiles, camera);
            this.BRBChild.threeDimensionUpdate(tiles, camera);
            this.TLTChild.threeDimensionUpdate(tiles, camera);
            this.TRTChild.threeDimensionUpdate(tiles, camera);
            this.TRBChild.threeDimensionUpdate(tiles, camera);
        }
        else {
            this.BLTChild = undefined;
            this.BRTChild = undefined;
            this.BRBChild = undefined;
            this.TLTChild = undefined;
            this.TRTChild = undefined;
            this.TRBChild = undefined;
            tiles.push(this);
        }
    }
};

TriangleTile.prototype.carBufferAreaUpdate = function (tiles, camera, car) {
    var isPointVisible = isTileVisibleInBuffer(this, camera, car);
    if (this.cenLat > 0) {
        if (isPointVisible == 0 && this.level < car.level) {
            if (this.LTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
                this.computeChildren();
            }
            this.LTChild.carBufferAreaUpdate(tiles, camera, car);
            this.LBChild.carBufferAreaUpdate(tiles, camera, car);
            this.RBChild.carBufferAreaUpdate(tiles, camera, car);
        }
        else if (isPointVisible == 1) {
            this.LTChild = undefined;
            this.LBChild = undefined;
            this.RBChild = undefined;
            tiles.push(this);
        }
        else {
            this.Morton = undefined;
            this.level = undefined;
            this.west = undefined;
            this.south = undefined;
            this.east = undefined;
            this.north = undefined;
            this.height = undefined;
            this.cenLon = undefined;
            this.cenLat = undefined;
            this.center = undefined;
            this.LTChild = undefined;
            this.LBChild = undefined;
            this.RBChild = undefined;
            this.boundingBox = undefined;
            this.intersection = undefined;
            this.changeColor = false;
        }
    }
    else {
        if (isPointVisible == 0 && this.level < car.level) {
            if (this.LTChild == undefined && this.RTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
                this.computeChildren();
            }
            this.LTChild.carBufferAreaUpdate(tiles, camera, car);
            this.RTChild.carBufferAreaUpdate(tiles, camera, car);
            this.RBChild.carBufferAreaUpdate(tiles, camera, car);
        }
        else if (isPointVisible == 1) {
            this.LTChild = undefined;
            this.RTChild = undefined;
            this.RBChild = undefined;
            tiles.push(this);
        }
        else {
            this.Morton = undefined;
            this.level = undefined;
            this.west = undefined;
            this.south = undefined;
            this.east = undefined;
            this.north = undefined;
            this.width = undefined;
            this.height = undefined;
            this.cenLon = undefined;
            this.cenLat = undefined;
            this.center = undefined;
            this.LTChild = undefined;
            this.RTChild = undefined;
            this.RBChild = undefined;
            this.boundingBox = undefined;
            this.intersection = undefined;
            this.changeColor = false;
        }
    }
};

var triangle = new Cesium.Rectangle();

function isTriangleTileVisible(tile, camera) {

    triangle.west = tile.west * PI / 180;
    triangle.south = tile.south * PI / 180;
    triangle.east = tile.east * PI / 180;
    triangle.north = tile.north * PI / 180;

    tile.boundingBox = Cesium.BoundingSphere.fromRectangle3D(triangle, ellipsoid, 0.0, boundingBox);
    var cullingVolume = camera.cullingVolume;
    var intersection = cullingVolume.computeVisibility(tile.boundingBox);
    var ifPointVisible = false;
    if (intersection != -1) {
        var occluder = camera.occluder;
        var factor = 1 / Math.cos((tile.north - tile.south) * PI / 360);
        var point = Cesium.Cartesian3.multiplyByScalar(tile.center, factor, unUsedPoint);
        var scaledSpacePoint = ellipsoid.transformPositionToScaledSpace(point);
        ifPointVisible = occluder.isScaledSpacePointVisible(scaledSpacePoint);
        if (intersection == 0 && !ifPointVisible) {
            var points = Cesium.Cartesian3.fromRadiansArray([triangle.west, triangle.north, triangle.west, triangle.south,
                triangle.east, triangle.south, triangle.east, triangle.north]);
            if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[0]))) {
                ifPointVisible = true;
            }
            else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[1]))) {
                ifPointVisible = true;
            }
            else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[2]))) {
                ifPointVisible = true;
            }
            else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[3]))) {
                ifPointVisible = true;
            }
        }
    }
    return ifPointVisible;
}

function isThreeDimensionTriangleTileVisible(tile, camera) {

    triangle.west = tile.west * PI / 180;
    triangle.south = tile.south * PI / 180;
    triangle.east = tile.east * PI / 180;
    triangle.north = tile.north * PI / 180;
    var threeDimensionHeight = tile.top - tile.bottom;

    // 需要改成三维立方体的包围盒
    tile.boundingBox = Cesium.BoundingSphere.fromRectangleWithHeights2D(triangle, Cesium.GeographicProjection(ellipsoid), 0.0, threeDimensionHeight, boundingBox);
    var cullingVolume = camera.cullingVolume;
    var intersection = cullingVolume.computeVisibility(tile.boundingBox);
    var ifPointVisible = false;
    if (intersection != -1) {
        var occluder = camera.occluder;
        var factor = 1 / Math.cos((tile.north - tile.south) * PI / 360);
        var point = Cesium.Cartesian3.multiplyByScalar(tile.center, factor, unUsedPoint);
        var scaledSpacePoint = ellipsoid.transformPositionToScaledSpace(point);
        ifPointVisible = occluder.isScaledSpacePointVisible(scaledSpacePoint);
        if (intersection == 0 && !ifPointVisible) {
            var points = Cesium.Cartesian3.fromRadiansArray([triangle.west, triangle.north, triangle.west, triangle.south,
                triangle.east, triangle.south, triangle.east, triangle.north]);
            if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[0]))) {
                ifPointVisible = true;
            }
            else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[1]))) {
                ifPointVisible = true;
            }
            else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[2]))) {
                ifPointVisible = true;
            }
            else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[3]))) {
                ifPointVisible = true;
            }
        }
    }
    return ifPointVisible;
}

TriangleTile.prototype.computeChildren = function() {
    if (this.cenLat >0) {
        if (this.LTChild == undefined) {
            this.LTChild = new TriangleTile(this.Morton + "0", this.level + 1, this.west, this.cenLat, this.east, this.north)
        }
        if (this.LBChild == undefined) {
            this.LBChild = new QuadTile(this.Morton + '2', this.level + 1, this.west, this.south, this.cenLon, this.cenLat);
        }
        if (this.RBChild == undefined) {
            this.RBChild = new QuadTile(this.Morton + '3', this.level + 1, this.cenLon, this.south, this.east, this.cenLat)
        }
    }
    else {
        if (this.RBChild == undefined) {
            this.RBChild = new TriangleTile(this.Morton + '0', this.level + 1, this.west, this.south, this.east, this.cenLat)
        }
        if (this.RTChild == undefined) {
            this.RTChild = new QuadTile(this.Morton + '2', this.level + 1, this.cenLon, this.cenLat, this.east, this.north)
        }
        if (this.LTChild == undefined) {
            this.LTChild = new QuadTile(this.Morton + "3", this.level + 1, this.west, this.cenLat, this.cenLon, this.north)
        }
    }
};

ThreeDimensionTriangleTile.prototype.computeThreeDimensionChildren = function() {
    if (this.cenLat >0) {
        if (this.BLTChild == undefined) {
            this.BLTChild = new ThreeDimensionTriangleTile(this.Morton + "0", this.level + 1, this.west, this.cenLat, this.east, this.north, this.bottom, this.cenAlt);
        }
        if (this.BLBChild == undefined) {
            this.BLBChild = new ThreeDimensionQuadTile(this.Morton + '2', this.level + 1, this.west, this.south, this.cenLon, this.cenLat, this.bottom, this.cenAlt);
        }
        if (this.BRBChild == undefined) {
            this.BRBChild = new ThreeDimensionQuadTile(this.Morton + '3', this.level + 1, this.cenLon, this.south, this.east, this.cenLat, this.bottom, this.cenAlt);
        }
        if (this.TLTChild == undefined) {
            this.TLTChild = new ThreeDimensionTriangleTile(this.Morton + "4", this.level + 1, this.west, this.cenLat, this.east, this.north, this.cenAlt, this.top);
        }
        if (this.TLBChild == undefined) {
            this.TLBChild = new ThreeDimensionQuadTile(this.Morton + '6', this.level + 1, this.west, this.south, this.cenLon, this.cenLat, this.cenAlt, this.top);
        }
        if (this.TRBChild == undefined) {
            this.TRBChild = new ThreeDimensionQuadTile(this.Morton + '7', this.level + 1, this.cenLon, this.south, this.east, this.cenLat, this.cenAlt, this.top);
        }
    }
    else {
        if (this.BRBChild == undefined) {
            this.BRBChild = new ThreeDimensionTriangleTile(this.Morton + '0', this.level + 1, this.west, this.south, this.east, this.cenLat, this.bottom, this.cenAlt)
        }
        if (this.BRTChild == undefined) {
            this.BRTChild = new ThreeDimensionQuadTile(this.Morton + '2', this.level + 1, this.cenLon, this.cenLat, this.east, this.north, this.bottom, this.cenAlt)
        }
        if (this.BLTChild == undefined) {
            this.BLTChild = new ThreeDimensionQuadTile(this.Morton + "3", this.level + 1, this.west, this.cenLat, this.cenLon, this.north, this.bottom, this.cenAlt)
        }
        if (this.TRBChild == undefined) {
            this.TRBChild = new ThreeDimensionTriangleTile(this.Morton + '4', this.level + 1, this.west, this.south, this.east, this.cenLat, this.cenAlt, this.top)
        }
        if (this.TRTChild == undefined) {
            this.TRTChild = new ThreeDimensionQuadTile(this.Morton + '6', this.level + 1, this.cenLon, this.cenLat, this.east, this.north, this.cenAlt, this.top)
        }
        if (this.TLTChild == undefined) {
            this.TLTChild = new ThreeDimensionQuadTile(this.Morton + "7", this.level + 1, this.west, this.cenLat, this.cenLon, this.north, this.cenAlt, this.top)
        }
    }
};