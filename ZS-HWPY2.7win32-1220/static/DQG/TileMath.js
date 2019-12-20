// 支持格网分析、表达和应用的计算函数
// WGS84基本参数（以下所有函数，除非特别说明，否则都是基于WGS84椭球参数计算）
var WGS84a = 6378137.0;                             // 长半轴
var WGS84b = 6356752.3142451793;                    // 短半轴
var WGS84bSquared = WGS84b * WGS84b;
var WGS84eSquared = 0.0066943799013;                // 第一偏心率的平方
var WGS84eToFourth = WGS84eSquared * WGS84eSquared;
var WGS84eToSixth = WGS84eToFourth * WGS84eSquared;
var WGS84eToEighth = WGS84eToSixth * WGS84eSquared;

/**
 * 计算球心到相机视点在地球上投影点的距离
 * @param camera
 * @returns {number} 球面上点到圆心的距离
 */
function computeRadius(camera) {
    var cameraLongitude = camera.positionCartographic.longitude;
    var cameraLatitude = camera.positionCartographic.latitude;
    var currentPosition = Cesium.Cartesian3.fromRadians(cameraLongitude, cameraLatitude, 0.0);
    return Math.sqrt(currentPosition.x * currentPosition.x + currentPosition.y * currentPosition.y + currentPosition.z * currentPosition.z);
}

/**
 * 计算格网经差函数
 * @param tile 格网
 * @returns {number} 经差（输出度数）
 */
function computeWidth(tile) {
    var east = tile.east;
    var west = tile.west;
    if(east < west) {
        east += PI
    }
    return east - west;
}

/**
 * 计算格网纬差函数
 * @param tile
 * @returns {number} 纬差（输出度数）
 */
function computeHeight(tile) {
    return tile.north - tile.south;
}

var uselessDegreeToRadian;
/**
 * 计算格网分辨率（平行圈弧长）
 * @param tile
 * @returns {number}
 */
function computeResolutionRatio(tile) {
    var resolutionRatio;
    uselessDegreeToRadian = tile.cenLat * Math.PI / 180;
    var differenceOfLongitude = computeWidth(tile);     //计算经差
    resolutionRatio = differenceOfLongitude * Math.PI * WGS84a * Math.cos(uselessDegreeToRadian) / Math.sqrt(1 - WGS84eSquared * Math.sin(uselessDegreeToRadian) * Math.sin(uselessDegreeToRadian)) / 180;
    return resolutionRatio;
}

var uselessRectangleWest;
var uselessRectangleSouth;
var uselessRectangleEast;
var uselessRectangleNorth;
var uselessLongitude;
var uselessLatitude;

/**
 * 判断矩形是否包含指定点
 * @param rectangle
 * @param point
 * @returns {boolean|*}
 */
function isRectangleContiansPoint(rectangle, point) {
    uselessRectangleWest = rectangle.west;
    uselessRectangleSouth = rectangle.south;
    uselessRectangleEast = rectangle.east;
    uselessRectangleNorth = rectangle.north;
    uselessLongitude = point.longitude;
    uselessLatitude = point.latitude;
    // 暂时不考虑格网跨180°情况（DQG没有此情况），后面有时间会完善
    // if (uselessRectangleEast < uselessRectangleWest) {
    //     uselessRectangleEast += Cesium.CesiumMath.TWO_PI;
    // }
    return (uselessLongitude > uselessRectangleWest || Cesium.Math.equalsEpsilon(uselessLongitude, uselessRectangleWest, Cesium.Math.EPSILON14)) &&
           (uselessLongitude < uselessRectangleEast || Cesium.Math.equalsEpsilon(uselessLongitude, uselessRectangleEast, Cesium.Math.EPSILON14)) &&
           (uselessLatitude >= uselessRectangleSouth) && (uselessLatitude <= uselessRectangleNorth)
}

/**
 * 计算地球上格网面积
 * @param tile
 * @returns {number}
 */
function computeGridArea(tile) {
    var differenceOfLongitude = computeWidth(tile);
    var differenceOfLatitude = computeHeight(tile);
    var centerLatitude = tile.cenLat * Math.PI / 180;
    differenceOfLongitude = differenceOfLongitude * Math.PI / 180;
    differenceOfLatitude = differenceOfLatitude * Math.PI / 180;
    var A = 1 + (0.5) * WGS84eSquared + (3 / 8) * WGS84eToFourth + (35 / 112) * WGS84eToSixth + (630 / 2304) * WGS84eToEighth;
    var B = (1 / 6) * WGS84eSquared + (15 / 80) * WGS84eToFourth + (21 / 112) * WGS84eToSixth + (420 / 2304) * WGS84eToEighth;
    var C = (3 / 80) * WGS84eToFourth + (7 / 112) * WGS84eToSixth + (180 / 2304) * WGS84eToEighth;
    var D = (1 / 112) * WGS84eToSixth + (45 / 2304) * WGS84eToEighth;
    var E = (5 / 2304) * WGS84eToEighth;
    return 2 * WGS84bSquared * differenceOfLongitude * (A * Math.sin(0.5 * differenceOfLatitude) * Math.cos(centerLatitude)
        - B * Math.sin(1.5 * differenceOfLatitude) * Math.cos(3 * centerLatitude) + C * Math.sin(2.5 * differenceOfLatitude) * Math.cos(5 * centerLatitude)
        - D * Math.sin(3.5 * differenceOfLatitude) * Math.cos(7 * centerLatitude) + E * Math.sin(4.5 * differenceOfLatitude) * Math.cos(9 * centerLatitude));
}

/**
 * 32位编码转行列号
 * @param code DQG格网编码
 * @param rowCol 格网所在行列号
 */
function code32ToRowCol(code, rowCol) {
    var row = 0;
    var col = 0;
    var m = 0;
    var n = 0;
    var movecount = 0;
    while (code & 0xffffffff) {
        m = code & 2;
        n = code & 1;
        m <<= movecount;
        n <<= movecount;
        row |= m;
        col |= n;
        code >>>= 2;
        ++movecount;
    }
    rowCol[0] = row >>> 1;
    rowCol[1] = col;
}

/**
 * 64位编码转行列号
 * @param code DQG格网编码
 * @param rowCol 格网所在行列号
 */
function code64ToRowCol(code, rowCol) {
    var row = 0n;
    var col = 0n;
    var m = 0n;
    var n = 0n;
    var movecount = 0n;
    while (code & 0xffffffffffffffffn) {
        m = code & 2n;
        n = code & 1n;
        m <<= movecount;
        n <<= movecount;
        row |= m;
        col |= n;
        code >>= 2n;
        ++movecount;
    }
    rowCol[0] = row >> 1n;
    rowCol[1] = col;
}

/**
 * 根据格网单元所在行数计算该单元经差
 * @param col
 * @returns {*}
 */
function computeIntLon(col) {
    var n = 0;
    if (col !== 0) {
        n = 1;
        while (col & 0xfffffffe) {
            col >>= 1;
            n += 1;
        }
    }
    return Math.pow(2,n);
}

/**
 * 根据格网编码计算格网四个角点经纬度坐标
 * @param GridCodes DQG格网编码
 * @returns DQGGrid 一个DQG格网对象包含四个角点经纬度坐标
 */
function codeToLonLat(GridCodes) {
    var str = GridCodes;
    var oct = str.substr(0,1);
    var len = str.length - 1;
    var row = 0;            // 行
    var col = 0;            // 列
    var interval_Lat = 0.0;
    var interval_Lon = 0.0;

    var DQGGrid = new Object();
    DQGGrid.west = null;
    DQGGrid.south = null;
    DQGGrid.east = null;
    DQGGrid.north = null;

    if (len < 16) {
        var code32 = parseInt(parseInt(str.substr(1)), 4);
        var rowCol = new Array();
        code32ToRowCol(code32, rowCol);
        row = rowCol[0];
        col = rowCol[1];
        var intLon = computeIntLon(row);
        interval_Lat = 90.0 / (1 << len);
        interval_Lon = 90.0 / intLon;
    }
    else {
        var code64 = BigInt(parseInt(BigInt(str.substr(1)), 4));
        var rowCol = new Array();
        code64ToRowCol(code64, rowCol);
        row = parseInt(rowCol[0]);
        col = parseInt(rowCol[1]);
        var intLon = computeIntLon(row);
        interval_Lat = 90.0 / (1 << len);
        interval_Lon = 90.0 / intLon;
    }

    switch (parseInt(oct)) {
        case 0:
            DQGGrid.west = col * interval_Lon;
            DQGGrid.south = 90.0 - (row + 1) * interval_Lat;
            DQGGrid.east = (col + 1) * interval_Lon;
            DQGGrid.north = 90.0 - row * interval_Lat;
            break;
        case 1:
            DQGGrid.west = 90.0 + col * interval_Lon;
            DQGGrid.south = 90.0 - (row + 1) * interval_Lat;
            DQGGrid.east = 90.0 + (col + 1) * interval_Lon;
            DQGGrid.north = 90.0 - row * interval_Lat;
            break;
        case 2:
            DQGGrid.west = -180.0 + col * interval_Lon;
            DQGGrid.south = 90.0 - (row + 1) * interval_Lat;
            DQGGrid.east = -180.0 + (col + 1) * interval_Lon;
            DQGGrid.north = 90.0 - row * interval_Lat;
            break;
        case 3:
            DQGGrid.west = -270.0 + col * interval_Lon;
            DQGGrid.south = 90.0 - (row + 1) * interval_Lat;
            DQGGrid.east = -270.0 + (col + 1) * interval_Lon;
            DQGGrid.north = 90.0 - row * interval_Lat;
            break;
        case 4:
            DQGGrid.west = col * interval_Lon;
            DQGGrid.south = -(row + 1) * interval_Lat;
            DQGGrid.east = (col + 1) * interval_Lon;
            DQGGrid.north = -row * interval_Lat;
            break;
        case 5:
            DQGGrid.west = 90.0 + col * interval_Lon;
            DQGGrid.south = -(row + 1) * interval_Lat;
            DQGGrid.east = 90.0 + (col + 1) * interval_Lon;
            DQGGrid.north = -row * interval_Lat;
            break;
        case 6:
            DQGGrid.west = -180.0 + col * interval_Lon;
            DQGGrid.south = -(row + 1) * interval_Lat;
            DQGGrid.east = -180.0 + (col + 1) * interval_Lon;
            DQGGrid.north = -row * interval_Lat;
            break;
        case 7:
            DQGGrid.west = -270.0 + col * interval_Lon;
            DQGGrid.south = -(row + 1) * interval_Lat;
            DQGGrid.east = -270.0 + (col + 1) * interval_Lon;
            DQGGrid.north = -row * interval_Lat;
            break;
    }

    return DQGGrid;
}