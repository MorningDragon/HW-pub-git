function QuadTile(morton, level, west, south, east, north) {
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
    // this.westNormal = new Cesium.Cartesian3();
    // this.southNormal = new Cesium.Cartesian3();
    // this.eastNormal = new Cesium.Cartesian3();
    // this.northNormal = new Cesium.Cartesian3();
    // this.southwestCornerCartesian = new Cesium.Cartesian3();
    // this.northeastCornerCartesian = new Cesium.Cartesian3();
    // this.color = new Cesium.Color.CYAN.withAlpha(0.005);
}

function ThreeDimensionQuadTile(morton, level, west, south, east, north, bottom, top) {
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
    // this.westNormal = new Cesium.Cartesian3();
    // this.southNormal = new Cesium.Cartesian3();
    // this.eastNormal = new Cesium.Cartesian3();
    // this.northNormal = new Cesium.Cartesian3();
    // this.southwestCornerCartesian = new Cesium.Cartesian3();
    // this.northeastCornerCartesian = new Cesium.Cartesian3();
    this.color = new Cesium.Color(1.0,1.0,1.0,0.4);
}

var PI = Math.PI;
var ellipsoid = Cesium.Ellipsoid.WGS84;
var c1 = 2.0;    // 格网细分条件的参数
var c2 = 18.0;   // 格网细分条件的参数
var c3 = c1 * c2;
// var distance = 0.0;

QuadTile.prototype.update = function (rects, camera) {

    var isPointVisible = isQuadTileVisible(this, camera);
    if (isPointVisible) {
        var isSubDivision = isSubDivisionVisible(this, camera);
        if (isSubDivision < c3) {
            if (this.LTChild == undefined && this.RTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
                this.computeChildren();
            }
            this.LTChild.update(rects, camera);
            this.RTChild.update(rects, camera);
            this.LBChild.update(rects, camera);
            this.RBChild.update(rects, camera);
        }
        if (this.level > camera.maxWholeTileLevel) {
            camera.maxWholeTileLevel = this.level;
        }
        this.LTChild = undefined;
        this.RTChild = undefined;
        this.LBChild = undefined;
        this.RBChild = undefined;
        rects.push(this);
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
        this.RTChild = undefined;
        this.LBChild = undefined;
        this.RBChild = undefined;
        this.boundingBox = undefined;
        this.intersection = undefined;
        this.changeColor = false;
        // this.westNormal = undefined;
        // this.southNormal = undefined;
        // this.eastNormal = undefined;
        // this.northNormal = undefined;
        // this.southwestCornerCartesian = undefined;
        // this.northeastCornerCartesian = undefined;
        // this.color = undefined;
    }
};

// 莫顿码显示
var mortonString = "nihao";
QuadTile.prototype.mortonUpdate = function (rects, camera) {

    var isPointVisible = isQuadTileVisible(this, camera);
    if (isPointVisible) {
        var isSubDivision = isMortonSubDivisionVisible(this, camera);
        if (isSubDivision < camera.subdivisionFactor) {
            if (this.LTChild == undefined && this.RTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
                this.computeChildren();
            }
            this.LTChild.mortonUpdate(rects, camera);
            this.RTChild.mortonUpdate(rects, camera);
            this.LBChild.mortonUpdate(rects, camera);
            this.RBChild.mortonUpdate(rects, camera);
        }
        this.LTChild = undefined;
        this.RTChild = undefined;
        this.LBChild = undefined;
        this.RBChild = undefined;
        if (this.level > camera.maxTileLevel) {
            camera.maxTileLevel = this.level;
        }
        var a = this.level;
        if (a == 4 || a == 5) {
            mortonString = this.Morton.slice(0, 3) + "\n" + this.Morton.slice(3);
            this.Morton = mortonString;
        }
        else if (a == 6 || a == 7) {
            mortonString = this.Morton.slice(0, 4) + "\n" + this.Morton.slice(4);
            this.Morton = mortonString;
        }
        else if (a == 8 || a == 9) {
            mortonString = this.Morton.slice(0, 5) + "\n" + this.Morton.slice(5);
            this.Morton = mortonString;
        }
        else if (a == 10 || a == 11) {
            mortonString = this.Morton.slice(0, 4) + "\n" + this.Morton.slice(4, 8) + "\n" + this.Morton.slice(8);
            this.Morton = mortonString;
        }
        else if (a == 12 || a == 13 || a == 14 || a == 15) {
            mortonString = this.Morton.slice(0, 5) + "\n" + this.Morton.slice(5, 10) + "\n" + this.Morton.slice(10, 15) + "\n" + this.Morton.slice(15);
            this.Morton = mortonString;
        }
        else if (a == 16 || a == 17 || a == 18 || a == 19) {
            mortonString = this.Morton.slice(0, 5) + "\n" + this.Morton.slice(5, 10) + "\n" + this.Morton.slice(10, 15) + "\n" + this.Morton.slice(15);
            this.Morton = mortonString;
        }
        else if (a == 20 || a == 21 || a == 22 || a == 23 || a == 24) {
            mortonString = this.Morton.slice(0, 5) + "\n" + this.Morton.slice(5, 10) + "\n" + this.Morton.slice(10, 15) + "\n" + this.Morton.slice(15, 20) +
                "\n" + this.Morton.slice(20);
            this.Morton = mortonString;
        }
        else if (a == 25 || a == 26 || a == 27 || a == 28 || a == 29) {
            mortonString = this.Morton.slice(0, 5) + "\n" + this.Morton.slice(5, 10) + "\n" + this.Morton.slice(10, 15) + "\n" + this.Morton.slice(15, 20) +
                "\n" + this.Morton.slice(20, 25) + "\n" + this.Morton.slice(25);
            this.Morton = mortonString;
        }
        else if (a == 30 || a == 31 || a == 32) {
            mortonString = this.Morton.slice(0, 6) + "\n" + this.Morton.slice(6, 12) + "\n" + this.Morton.slice(12, 18) + "\n" + this.Morton.slice(24, 30) +
                "\n" + this.Morton.slice(30);
            this.Morton = mortonString;
        }
        rects.push(this);
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
        this.RTChild = undefined;
        this.LBChild = undefined;
        this.RBChild = undefined;
        this.boundingBox = undefined;
        this.intersection = undefined;
        // this.westNormal = undefined;
        // this.southNormal = undefined;
        // this.eastNormal = undefined;
        // this.northNormal = undefined;
        // this.southwestCornerCartesian = undefined;
        // this.northeastCornerCartesian = undefined;
        this.color = undefined;
        this.changeColor = false;
    }
};

QuadTile.prototype.singleScaleTileUpdate = function (rects, camera) {
    var isPointVisible = isQuadTileVisible(this, camera);
    if (isPointVisible) {
        var isSubDivision = isMortonSubDivisionVisible(this, camera);
        if (isSubDivision < camera.subdivisionFactor) {
            if (this.LTChild === undefined && this.RTChild === undefined && this.LBChild === undefined && this.RBChild === undefined) {
                this.computeChildren();
            }
            this.LTChild.singleScaleTileUpdate(rects, camera);
            this.RTChild.singleScaleTileUpdate(rects, camera);
            this.LBChild.singleScaleTileUpdate(rects, camera);
            this.RBChild.singleScaleTileUpdate(rects, camera);
        }
        this.LTChild = undefined;
        this.RTChild = undefined;
        this.LBChild = undefined;
        this.RBChild = undefined;
        if (this.level > camera.maxTileLevel) {
            camera.maxTileLevel = this.level;
        }
        rects.push(this);
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
        this.RTChild = undefined;
        this.LBChild = undefined;
        this.RBChild = undefined;
        this.boundingBox = undefined;
        this.intersection = undefined;
        this.color = undefined;
        this.changeColor = false;
    }
};

QuadTile.prototype.singleThreeDimensionUpdate = function (rects, camera) {

    var isPointVisible = isQuadTileVisible(this, camera);
    if (isPointVisible) {
        var isSubDivision = isSingleThreeDimensionSubDivisionVisible(this, camera);
        if (isSubDivision < camera.subdivisionFactor) {
            if (this.LTChild == undefined && this.RTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
                this.computeChildren();
            }
            this.LTChild.singleThreeDimensionUpdate(rects, camera);
            this.RTChild.singleThreeDimensionUpdate(rects, camera);
            this.LBChild.singleThreeDimensionUpdate(rects, camera);
            this.RBChild.singleThreeDimensionUpdate(rects, camera);
        }
        this.LTChild = undefined;
        this.RTChild = undefined;
        this.LBChild = undefined;
        this.RBChild = undefined;
        if (this.level > camera.maxTileLevel) {
            camera.maxTileLevel = this.level;
        }
        rects.push(this);
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
        this.RTChild = undefined;
        this.LBChild = undefined;
        this.RBChild = undefined;
        this.boundingBox = undefined;
        this.intersection = undefined;
        this.color = undefined;
    }
};

ThreeDimensionQuadTile.prototype.threeDimensionUpdate = function (rects, camera) {
    if (this.level < 3) {
        if (this.BLTChild == undefined && this.BRTChild == undefined && this.BLBChild == undefined && this.BRBChild == undefined &&
            this.TLTChild == undefined && this.TRTChild == undefined && this.TLBChild == undefined && this.TRBChild == undefined) {
            this.computeThreeDimensionChildren();
        }
        this.BLTChild.threeDimensionUpdate(rects, camera);
        this.BRTChild.threeDimensionUpdate(rects, camera);
        this.BLBChild.threeDimensionUpdate(rects, camera);
        this.BRBChild.threeDimensionUpdate(rects, camera);
        this.TLTChild.threeDimensionUpdate(rects, camera);
        this.TRTChild.threeDimensionUpdate(rects, camera);
        this.TLBChild.threeDimensionUpdate(rects, camera);
        this.TRBChild.threeDimensionUpdate(rects, camera);
    }
    this.BLTChild = undefined;
    this.BRTChild = undefined;
    this.BLBChild = undefined;
    this.BRBChild = undefined;
    this.TLTChild = undefined;
    this.TRTChild = undefined;
    this.TLBChild = undefined;
    this.TRBChild = undefined;
    if (this.level > camera.maxTileLevel) {
        camera.maxTileLevel = this.level;
    }
    rects.push(this);
};

QuadTile.prototype.carBufferAreaUpdate = function (rects, camera, car) {

    var isPointVisible = isTileVisibleInBuffer(this, camera, car);
    if (isPointVisible == 0 && this.level < car.level) {
        if (this.LTChild == undefined && this.RTChild == undefined && this.LBChild == undefined && this.RBChild == undefined) {
            this.computeChildren();
        }
        this.LTChild.carBufferAreaUpdate(rects, camera, car);
        this.RTChild.carBufferAreaUpdate(rects, camera, car);
        this.LBChild.carBufferAreaUpdate(rects, camera, car);
        this.RBChild.carBufferAreaUpdate(rects, camera, car);
    }
    else if (isPointVisible == 1) {
        this.LTChild = undefined;
        this.RTChild = undefined;
        this.LBChild = undefined;
        this.RBChild = undefined;
        rects.push(this);
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
        this.RTChild = undefined;
        this.LBChild = undefined;
        this.RBChild = undefined;
        this.boundingBox = undefined;
        this.intersection = undefined;
        this.color = undefined;
        this.changeColor = false;
    }
};

var angleA = undefined;                     // 球心到地平线与球心到视点的夹角
var angleB = undefined;                     // 球新到瓦片中心与球心到时间的夹角
var angleC = undefined;                     // 球心到地平线与球心到视点的夹角
var angleD = undefined;                     // 球新到瓦片中心与球心到时间的夹角
var angleE = undefined;
var angleF = undefined;
var angleFactor = undefined;

/**
 * 判断细分函数
 * @param tile 格网
 * @param camera 相机
 * @returns {number} 参数
 */
function isSubDivisionVisible(tile, camera) {
    var cameraPosition = camera.position;
    var height = computeHeight(tile) * PI / 180;
    // 全球部分在视椎体内
     if (camera.cameraDistance < camera.radiusDistance) {   //18400000.0 //12713504.628490359 //24643229.007640
        angleA = camera.angle;
        angleB = Cesium.Cartesian3.angleBetween(tile.center,cameraPosition);
        angleFactor = angleB / angleA;
        if (angleFactor < 0.6) {
            angleB = angleA * 0.1;
        }
        else if (angleFactor < 0.85) {
            angleB = angleA * 0.3;
        }
    }
    // 全球都在视椎体内
    else {
        angleA = camera.fovyRadians;
        angleB = Cesium.Cartesian3.angleBetween(tile.center,cameraPosition);
        angleFactor = angleB / angleA;
        if (angleFactor < 0.15) {
            angleB = angleA * 0.05;
        }
        else if (angleFactor < 0.4) {
            angleB = angleA * 0.1;
        }
    }

    var f1 = angleA / height;
    var f2 = angleB / height;
    return f1 * f2;
}

//莫顿显示
function isMortonSubDivisionVisible(tile, camera) {
    var height = computeHeight(tile) * PI / 180;
    // 粗单尺度
    if (camera.cameraDistance < 6430000) {
        angleC = camera.angle;
        angleD = angleC;
        camera.subdivisionFactor = 1;
    }
    // 全球部分在视椎体内
    else if (camera.cameraDistance < camera.radiusDistance) {   //18400000.0 //12713504.628490359 //24643229.007640
        angleC = camera.angle;
        angleD = angleC;
        camera.subdivisionFactor = 2;   // 3
    }
    // 全球都在视椎体内
    else {
        angleC = camera.fovyRadians;
        angleD = angleC;
        camera.subdivisionFactor = 4;   // 5
    }
    var g1 = angleC / height;
    var g2 = angleD / height;
    return g1 * g2;
}

function isThreeDimensionSubDivisionVisible(tile, camera) {
    var height = computeHeight(tile) * PI / 180;
    if (camera.cameraDistance < 6387000) {
        angleA = camera.angle;
        angleB = angleA * 0.45
    }
    // 全球部分在视椎体内
    else if (camera.cameraDistance < 12713504.628490359) {   //18400000.0
        angleA = camera.angle;
        angleB = angleA * 0.8;
    }
    // 全球都在视椎体内
    else {
        angleA = camera.fovyRadians;
        angleB = angleA * 0.5;
    }
    var h1 = angleA / height;
    var h2 = angleB / height;
    return h1 * h2;
}

function isSingleThreeDimensionSubDivisionVisible(tile, camera) {
    var height = computeHeight(tile) * PI / 180;
    // 粗单尺度
    if (camera.cameraDistance < 6387000) {
        angleE = camera.angle;
        angleF = angleE;
        camera.subdivisionFactor = 20;
    }
    // 全球部分在视椎体内
    else if (camera.cameraDistance < camera.radiusDistance) {   //18400000.0 //12713504.628490359 //24643229.007640
        angleE = camera.angle;
        angleF = angleE;
        camera.subdivisionFactor = 20;
    }
    // 全球都在视椎体内
    else {
        angleE = camera.fovyRadians;
        angleF = angleE;
        camera.subdivisionFactor = 25;
    }
    var h1 = angleE / height;
    var h2 = angleF / height;
    return h1 * h2;
}
var rectangle = new Cesium.Rectangle();
var unUsedPoint = new Cesium.Cartesian3();
var boundingBox = new Cesium.BoundingSphere();
var scratchPlane = new Cesium.Plane(new Cesium.Cartesian3(1.0, 0.0, 0.0), 0.0);

/**
 * 判断视窗体相交函数
 * 可视点坐标为包围球的中点向量*（半径 / cos((north - south) / 2))
 * @param tile  要剖分显示的格网
 * @param camera    场景中的相机
 * @returns {ifPointVisible|Boolean|*}
 */
function isQuadTileVisible(tile, camera) {

    rectangle.west = tile.west * PI / 180;
    rectangle.south = tile.south * PI / 180;
    rectangle.east = tile.east * PI / 180;
    rectangle.north = tile.north * PI / 180;

    // 构建格网包围盒(这里是包围球)
    tile.boundingBox = Cesium.BoundingSphere.fromRectangle3D(rectangle, ellipsoid, 0.0, boundingBox);
    // 创建视椎体 camera.frustum是调用PerspectiveFrustum的默认值生成的，因而有computeCullingVolume函数并且只需输入三个参数
    var cullingVolume = camera.cullingVolume;
    // 判断视椎体与格网包围盒是否相交(包围盒与包围球都有下面这个computeVisibility函数)
    var intersection = cullingVolume.computeVisibility(tile.boundingBox);

    var ifPointVisible = false;
    // 过滤视椎体中位于可视线（地球水平线）后面的点
    if (intersection != -1) {
        var occluder = camera.occluder;
        if (intersection == 0) {
            var factor = 1 / Math.cos((tile.north - tile.south) * PI / 360);
            var point0 = Cesium.Cartesian3.multiplyByScalar(tile.center, factor, unUsedPoint);
            var scaledSpacePoint0 = ellipsoid.transformPositionToScaledSpace(point0);
            ifPointVisible = occluder.isScaledSpacePointVisible(scaledSpacePoint0);
        }
        else if (intersection == 1 && tile.level < 3) {
            var points = Cesium.Cartesian3.fromRadiansArray([rectangle.west, rectangle.north, rectangle.west, rectangle.south,
                rectangle.east, rectangle.south, rectangle.east, rectangle.north]);
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
        else if (intersection == 1) {
            var scaledSpacePoint1 = ellipsoid.transformPositionToScaledSpace(tile.center);
            ifPointVisible = occluder.isScaledSpacePointVisible(scaledSpacePoint1);
        }
    }
    return ifPointVisible;
}

function isThreeDimensionQuadTileVisible(tile, camera) {

    rectangle.west = tile.west * PI / 180;
    rectangle.south = tile.south * PI / 180;
    rectangle.east = tile.east * PI / 180;
    var threeDimensionHeight = tile.top - tile.bottom;

    // 需要改成三维立方体的包围盒
    tile.boundingBox = Cesium.BoundingSphere.fromRectangleWithHeights2D(triangle, Cesium.GeographicProjection(ellipsoid), 0.0, threeDimensionHeight, boundingBox);
    // 创建视椎体 camera.frustum是调用PerspectiveFrustum的默认值生成的，因而有computeCullingVolume函数并且只需输入三个参数
    var cullingVolume = camera.cullingVolume;
    // 判断视椎体与格网包围盒是否相交(包围盒与包围球都有下面这个computeVisibility函数)
    var intersection = cullingVolume.computeVisibility(tile.boundingBox);

    var ifPointVisible = false;
    // 过滤视椎体中位于可视线（地球水平线）后面的点
    if (intersection != -1) {
        var occluder = camera.occluder;
        if (intersection == 0) {
            var factor = 1 / Math.cos((tile.north - tile.south) * PI / 360);
            var point0 = Cesium.Cartesian3.multiplyByScalar(tile.center, factor, unUsedPoint);
            var scaledSpacePoint0 = ellipsoid.transformPositionToScaledSpace(point0);
            ifPointVisible = occluder.isScaledSpacePointVisible(scaledSpacePoint0);
        }
        else if (intersection == 1 && tile.level < 3) {
            var points = Cesium.Cartesian3.fromRadiansArray([rectangle.west, rectangle.north, rectangle.west, rectangle.south,
                rectangle.east, rectangle.south, rectangle.east, rectangle.north]);
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
        else if (intersection == 1) {
            var scaledSpacePoint1 = ellipsoid.transformPositionToScaledSpace(tile.center);
            ifPointVisible = occluder.isScaledSpacePointVisible(scaledSpacePoint1);
        }
    }
    return ifPointVisible;
}

var bufferAreaTileCenterPosition = new Cesium.Cartesian3();
// var rectangleWestPosition = new Cesium.Cartesian3();
// var rectangleSouthPosition = new Cesium.Cartesian3();
// var rectangleEastPosition = new Cesium.Cartesian3();
// var rectangleNorthPosition = new Cesium.Cartesian3();
function isTileVisibleInBuffer(tile, camera, car) {
    rectangle.west = tile.west * PI / 180;
    rectangle.south = tile.south * PI / 180;
    rectangle.east = tile.east * PI / 180;
    rectangle.north = tile.north * PI / 180;
    var intersection = -1;
    tile.boundingBox = Cesium.BoundingSphere.fromRectangle3D(rectangle, ellipsoid, 0.0, boundingBox);
    if (car.isDrawFrustumTile) {
        var cullingVolume = camera.cullingVolume;
        var cullingVolumeIntersection = cullingVolume.computeVisibility(tile.boundingBox);
        if (cullingVolumeIntersection != -1) {
            var carBufferAreaBoundingSphereRadius = car.bufferAreaRadius;
            bufferAreaTileCenterPosition = tile.boundingBox.center;
            var tileDistance = Cesium.Cartesian3.distance(bufferAreaTileCenterPosition, car.position);
            var tileRadius = tile.boundingBox.radius;
            // 判断缓冲区包围盒与格网包围盒是否相交
            if (tileDistance < tileRadius + carBufferAreaBoundingSphereRadius) {
                if (tileDistance + tileRadius < carBufferAreaBoundingSphereRadius) {
                    intersection = 1;   // 说明包围盒是包含关系
                }
                else {
                    intersection = 0;   // 说明包围盒是相交关系
                }
            }
        }
    }
    else {
        var carBufferAreaBoundingSphereRadius = car.bufferAreaRadius;
        bufferAreaTileCenterPosition = tile.boundingBox.center;
        var tileDistance = Cesium.Cartesian3.distance(bufferAreaTileCenterPosition, car.position);
        var tileRadius = tile.boundingBox.radius;
        // 判断缓冲区包围盒与格网包围盒是否相交
        if (tileDistance < tileRadius + carBufferAreaBoundingSphereRadius) {
            if (tileDistance + tileRadius < carBufferAreaBoundingSphereRadius) {
                intersection = 1;   // 说明包围盒是包含关系
                for (var i = 0; i < car.otherCars.length; i++) {
                    if(isRectangleContiansPoint(rectangle, car.otherCars[i].otherCarLonLat)) {
                        tile.changeColor = true;
                        break;
                    }
                }
            }
            else {
                intersection = 0;   // 说明包围盒是相交关系
            }
        }
    }
    return intersection;


    // var carBufferAreaBoundingSphereRadius = car.bufferAreaRadius;
    //
    // rectangleWestPosition = Cesium.Cartesian3.fromRadians(rectangle.west);
    // rectangleSouthPosition = Cesium.Cartesian3.fromRadians(rectangle.south);
    // rectangleEastPosition = Cesium.Cartesian3.fromRadians(rectangle.east);
    // rectangleNorthPosition = Cesium.Cartesian3.fromRadians(rectangle.north);
    //
    // var intersection = -1;
    // var rectangleWestPositionDistance = Cesium.Cartesian3.distance(rectangleWestPosition, car.position);
    // var rectangleSouthPositionDistance = Cesium.Cartesian3.distance(rectangleSouthPosition, car.position);
    // var rectangleEastPositionDistance = Cesium.Cartesian3.distance(rectangleEastPosition, car.position);
    // var rectangleNorthPositionDistance = Cesium.Cartesian3.distance(rectangleNorthPosition, car.position);
    // if (rectangleWestPositionDistance <= carBufferAreaBoundingSphereRadius) {
    //     intersection++;
    // }
    // if (rectangleSouthPositionDistance <= carBufferAreaBoundingSphereRadius) {
    //     intersection++;
    // }
    // if (rectangleEastPositionDistance <= carBufferAreaBoundingSphereRadius) {
    //     intersection++;
    // }
    // if (rectangleNorthPositionDistance <= carBufferAreaBoundingSphereRadius) {
    //     intersection++;
    // }
    // if (intersection == 3) {
    //     return 1;
    // }
    // else if (intersection != -1) {
    //     return 0;
    // }
    // else {
    //     return -1;
    // }
}

QuadTile.prototype.computeChildren = function() {
    if (this.cenLat >0) {
        if (this.LTChild == undefined) {
            this.LTChild = new QuadTile(this.Morton + "0", this.level + 1, this.west, this.cenLat, this.cenLon, this.north)
        }
        if (this.RTChild == undefined) {
            this.RTChild = new QuadTile(this.Morton + '1', this.level + 1, this.cenLon, this.cenLat, this.east, this.north)
        }
        if (this.LBChild == undefined) {
            this.LBChild = new QuadTile(this.Morton + '2', this.level + 1, this.west, this.south, this.cenLon, this.cenLat)
        }
        if (this.RBChild == undefined) {
            this.RBChild = new QuadTile(this.Morton + '3', this.level + 1, this.cenLon, this.south, this.east, this.cenLat)
        }
    }
    else {
        if (this.RBChild == undefined) {
            this.RBChild = new QuadTile(this.Morton + '0', this.level + 1, this.cenLon, this.south, this.east, this.cenLat)
        }
        if (this.LBChild == undefined) {
            this.LBChild = new QuadTile(this.Morton + '1', this.level + 1, this.west, this.south, this.cenLon, this.cenLat)
        }
        if (this.RTChild == undefined) {
            this.RTChild = new QuadTile(this.Morton + '2', this.level + 1, this.cenLon, this.cenLat, this.east, this.north)
        }
        if (this.LTChild == undefined) {
            this.LTChild = new QuadTile(this.Morton + "3", this.level + 1, this.west, this.cenLat, this.cenLon, this.north)
        }
    }
};

ThreeDimensionQuadTile.prototype.computeThreeDimensionChildren = function() {
    if (this.cenLat >0) {
        if (this.BLTChild == undefined) {
            this.BLTChild = new ThreeDimensionQuadTile(this.Morton + "0", this.level + 1, this.west, this.cenLat, this.cenLon, this.north, this.bottom, this.cenAlt)
        }
        if (this.BRTChild == undefined) {
            this.BRTChild = new ThreeDimensionQuadTile(this.Morton + '1', this.level + 1, this.cenLon, this.cenLat, this.east, this.north, this.bottom, this.cenAlt)
        }
        if (this.BLBChild == undefined) {
            this.BLBChild = new ThreeDimensionQuadTile(this.Morton + '2', this.level + 1, this.west, this.south, this.cenLon, this.cenLat, this.bottom, this.cenAlt)
        }
        if (this.BRBChild == undefined) {
            this.BRBChild = new ThreeDimensionQuadTile(this.Morton + '3', this.level + 1, this.cenLon, this.south, this.east, this.cenLat, this.bottom, this.cenAlt)
        }
        if (this.TLTChild == undefined) {
            this.TLTChild = new ThreeDimensionQuadTile(this.Morton + "4", this.level + 1, this.west, this.cenLat, this.cenLon, this.north, this.cenAlt, this.top)
        }
        if (this.TRTChild == undefined) {
            this.TRTChild = new ThreeDimensionQuadTile(this.Morton + '5', this.level + 1, this.cenLon, this.cenLat, this.east, this.north, this.cenAlt, this.top)
        }
        if (this.TLBChild == undefined) {
            this.TLBChild = new ThreeDimensionQuadTile(this.Morton + '6', this.level + 1, this.west, this.south, this.cenLon, this.cenLat, this.cenAlt, this.top)
        }
        if (this.TRBChild == undefined) {
            this.TRBChild = new ThreeDimensionQuadTile(this.Morton + '7', this.level + 1, this.cenLon, this.south, this.east, this.cenLat, this.cenAlt, this.top)
        }
    }
    else {
        if (this.BRBChild == undefined) {
            this.BRBChild = new ThreeDimensionQuadTile(this.Morton + '0', this.level + 1, this.cenLon, this.south, this.east, this.cenLat, this.bottom, this.cenAlt)
        }
        if (this.BLBChild == undefined) {
            this.BLBChild = new ThreeDimensionQuadTile(this.Morton + '1', this.level + 1, this.west, this.south, this.cenLon, this.cenLat, this.bottom, this.cenAlt)
        }
        if (this.BRTChild == undefined) {
            this.BRTChild = new ThreeDimensionQuadTile(this.Morton + '2', this.level + 1, this.cenLon, this.cenLat, this.east, this.north, this.bottom, this.cenAlt)
        }
        if (this.BLTChild == undefined) {
            this.BLTChild = new ThreeDimensionQuadTile(this.Morton + "3", this.level + 1, this.west, this.cenLat, this.cenLon, this.north, this.bottom, this.cenAlt)
        }
        if (this.TRBChild == undefined) {
            this.TRBChild = new ThreeDimensionQuadTile(this.Morton + '4', this.level + 1, this.cenLon, this.south, this.east, this.cenLat, this.cenAlt, this.top)
        }
        if (this.TLBChild == undefined) {
            this.TLBChild = new ThreeDimensionQuadTile(this.Morton + '5', this.level + 1, this.west, this.south, this.cenLon, this.cenLat, this.cenAlt, this.top)
        }
        if (this.TRTChild == undefined) {
            this.TRTChild = new ThreeDimensionQuadTile(this.Morton + '6', this.level + 1, this.cenLon, this.cenLat, this.east, this.north, this.cenAlt, this.top)
        }
        if (this.TLTChild == undefined) {
            this.TLTChild = new ThreeDimensionQuadTile(this.Morton + "7", this.level + 1, this.west, this.cenLat, this.cenLon, this.north, this.cenAlt, this.top)
        }
    }
};

// var cartesian3Scratch = new Cesium.Cartesian3();
// var cartesian3Scratch2 = new Cesium.Cartesian3();
// var cartesian3Scratch3 = new Cesium.Cartesian3();
// var eastWestNormalScratch = new Cesium.Cartesian3();
// var westernMidpointScratch = new Cesium.Cartesian3();
// var easternMidpointScratch = new Cesium.Cartesian3();
// var cartographicScratch = new Cesium.Cartographic();
// var planeScratch = new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0);
// var rayScratch = new Cesium.Ray();
// function computeBoxQ(tileBB, rectangle, ellipsoid) {
//     ellipsoid.cartographicToCartesian(Cesium.Rectangle.southwest(rectangle), tileBB.southwestCornerCartesian);
//     ellipsoid.cartographicToCartesian(Cesium.Rectangle.northeast(rectangle), tileBB.northeastCornerCartesian);
//
//     // The middle latitude on the western edge.
//     cartographicScratch.longitude = rectangle.west;
//     cartographicScratch.latitude = (rectangle.south + rectangle.north) * 0.5;
//     cartographicScratch.height = 0.0;
//     var westernMidpointCartesian = ellipsoid.cartographicToCartesian(cartographicScratch, westernMidpointScratch);
//
//     // Compute the normal of the plane on the western edge of the tile.
//     // 垂直与三维坐标向量和Z轴并穿过左边中间点向左的向量
//     var westNormal = Cesium.Cartesian3.cross(westernMidpointCartesian, Cesium.Cartesian3.UNIT_Z, cartesian3Scratch);
//     Cesium.Cartesian3.normalize(westNormal, tileBB.westNormal); // 西向量
//
//     // The middle latitude on the eastern edge.
//     // 右边中点
//     cartographicScratch.longitude = rectangle.east;
//     var easternMidpointCartesian = ellipsoid.cartographicToCartesian(cartographicScratch, easternMidpointScratch);
//
//     // Compute the normal of the plane on the eastern edge of the tile.
//     // 垂直与三维坐标向量和Z轴并穿过右边中间点向左的向量
//     var eastNormal = Cesium.Cartesian3.cross(Cesium.Cartesian3.UNIT_Z, easternMidpointCartesian, cartesian3Scratch);
//     Cesium.Cartesian3.normalize(eastNormal, tileBB.eastNormal);    // 西向量
//
//     // Compute the normal of the plane bounding the southern edge of the tile.
//     // 左边中点向量-右边中点向量=从右边中点指向左边中点向量
//     var westVector = Cesium.Cartesian3.subtract(westernMidpointCartesian, easternMidpointCartesian, cartesian3Scratch);
//     // 向量归一化
//     var eastWestNormal = Cesium.Cartesian3.normalize(westVector, eastWestNormalScratch);
//
//     var south = rectangle.south;
//     var southSurfaceNormal;
//
//     if (south > 0.0) {
//         // Compute a plane that doesn't cut through the tile.
//         // 底边中点
//         cartographicScratch.longitude = (rectangle.west +  rectangle.east) * 0.5;
//         cartographicScratch.latitude = south;
//         // 求出底边中点三维坐标，并作为射线起点
//         var southCenterCartesian = ellipsoid.cartographicToCartesian(cartographicScratch, rayScratch.origin);
//         // eastWestNormal作为射线的方向
//         Cesium.Cartesian3.clone(eastWestNormal, rayScratch.direction);
//         // 从平面上的法线和点，创建一个平面：左下角，西法线，创建了西边的围墙
//         var westPlane = Cesium.Plane.fromPointNormal(tileBB.southwestCornerCartesian, tileBB.westNormal, planeScratch);
//         // Find a point that is on the west and the south planes
//         Cesium.IntersectionTests.rayPlane(rayScratch, westPlane, tileBB.southwestCornerCartesian);
//         //计算给定位置上与椭球表面相切的平面的法线（三维坐标），返回归一化的向量
//         southSurfaceNormal = ellipsoid.geodeticSurfaceNormal(southCenterCartesian, cartesian3Scratch2);
//
//     } else {
//         // 过右下格点的切平面的法线
//         southSurfaceNormal = ellipsoid.geodeticSurfaceNormalCartographic(Cesium.Rectangle.southeast(rectangle), cartesian3Scratch2);
//     }
//     // 南向量：北半球的话用底边中点，南半球用左下格点，向量从右到左，方向可能向北
//     var southNormal = Cesium.Cartesian3.cross(southSurfaceNormal, westVector, cartesian3Scratch3);
//     Cesium.Cartesian3.normalize(southNormal, tileBB.southNormal);  // 南向量
//
//     // Compute the normal of the plane bounding the northern edge of the tile.
//     var north = rectangle.north;
//     var northSurfaceNormal;
//     if (north < 0.0) {
//         // Compute a plane that doesn't cut through the tile.
//         // 如果在南半球，上边中点
//         cartographicScratch.longitude = (rectangle.west + rectangle.east) * 0.5;
//         cartographicScratch.latitude = north;
//         var northCenterCartesian = ellipsoid.cartographicToCartesian(cartographicScratch, rayScratch.origin);
//         // eastWestNormal各轴取反
//         Cesium.Cartesian3.negate(eastWestNormal, rayScratch.direction);
//         //东边的围墙
//         var eastPlane = Cesium.Plane.fromPointNormal(tileBB.northeastCornerCartesian, tileBB.eastNormal, planeScratch);
//         // Find a point that is on the east and the north planes 东北
//         Cesium.IntersectionTests.rayPlane(rayScratch, eastPlane, tileBB.northeastCornerCartesian);
//         // 方向向下？
//         northSurfaceNormal = ellipsoid.geodeticSurfaceNormal(northCenterCartesian, cartesian3Scratch2);
//
//     } else {
//         // 过左上角的点 方向向上？
//         northSurfaceNormal = ellipsoid.geodeticSurfaceNormalCartographic(Cesium.Rectangle.northwest(rectangle), cartesian3Scratch2);
//     }
//     var northNormal = Cesium.Cartesian3.cross(westVector, northSurfaceNormal, cartesian3Scratch3);
//     Cesium.Cartesian3.normalize(northNormal, tileBB.northNormal);  // 北向量
// }
//
// var southwestCornerScratch = new Cesium.Cartesian3();
// var northeastCornerScratch = new Cesium.Cartesian3();
// var negativeUnitY = new Cesium.Cartesian3(0.0, -1.0, 0.0);
// var negativeUnitZ = new Cesium.Cartesian3(0.0, 0.0, -1.0);
// var vectorScratch = new Cesium.Cartesian3();
//
// function computeDistanceToCamera(tile, camera) {
//     var rectangleQ = new Cesium.Rectangle();
//     rectangleQ.west = tile.west * PI / 180;
//     rectangleQ.south = tile.south * PI / 180;
//     rectangleQ.east = tile.east * PI / 180;
//     rectangleQ.north = tile.north * PI / 180;
//
//     computeBoxQ(tile, rectangleQ, ellipsoid);
//
//     var cameraCartesianPosition = camera.positionWC;
//     var cameraCartographicPosition = camera.positionCartographic;
//     var result = 0.0;
//     if (!Cesium.Rectangle.contains(rectangleQ, cameraCartographicPosition)) {
//         var southwestCornerCartesian = tile.southwestCornerCartesian;
//         var northeastCornerCartesian = tile.northeastCornerCartesian;
//         var westNormal = tile.westNormal;
//         var southNormal = tile.southNormal;
//         var eastNormal = tile.eastNormal;
//         var northNormal = tile.northNormal;
//
//         var vectorFromSouthwestCorner = Cesium.Cartesian3.subtract(cameraCartesianPosition, southwestCornerCartesian, vectorScratch);
//         var distanceToWestPlane = Cesium.Cartesian3.dot(vectorFromSouthwestCorner, westNormal);
//         var distanceToSouthPlane = Cesium.Cartesian3.dot(vectorFromSouthwestCorner, southNormal);
//
//         var vectorFromNortheastCorner = Cesium.Cartesian3.subtract(cameraCartesianPosition, northeastCornerCartesian, vectorScratch);
//         var distanceToEastPlane = Cesium.Cartesian3.dot(vectorFromNortheastCorner, eastNormal);
//         var distanceToNorthPlane = Cesium.Cartesian3.dot(vectorFromNortheastCorner, northNormal);
//
//         if (distanceToWestPlane > 0.0) {
//             result += distanceToWestPlane * distanceToWestPlane;
//         } else if (distanceToEastPlane > 0.0) {
//             result += distanceToEastPlane * distanceToEastPlane;
//         }
//
//         if (distanceToSouthPlane > 0.0) {
//             result += distanceToSouthPlane * distanceToSouthPlane;
//         } else if (distanceToNorthPlane > 0.0) {
//             result += distanceToNorthPlane * distanceToNorthPlane;
//         }
//     }
//
//     var cameraHeight;
//     var minimumHeight;
//     var maximumHeight;
//     cameraHeight = cameraCartographicPosition.height;
//     minimumHeight = 0.0;
//     maximumHeight = 0.0;
//
//     if (cameraHeight > maximumHeight) {
//         var distanceAboveTop = cameraHeight - maximumHeight;
//         result += distanceAboveTop * distanceAboveTop;
//     } else if (cameraHeight < minimumHeight) {
//         var distanceBelowBottom = minimumHeight - cameraHeight;
//         result += distanceBelowBottom * distanceBelowBottom;
//     }
//
//     return Math.sqrt(result);
// }