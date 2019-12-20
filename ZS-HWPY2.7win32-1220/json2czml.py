#encoding:utf-8
import json

def loaddata(url,nameset):
    # 打开json数据
    f = open(url)
    setting = json.load(f)
    geos = setting['features']
    data = []
    # josn数据的name集合，减少遍历
    names = nameset
    # 根据轨迹编码名称
    for name in names:
        coorlist = []
        for coor in geos:
            if coor['properties']['Field1'] == name:
                # 将经纬度添加到数组中
                coordinates = coor['geometry']['coordinates']
                coorlist.append(coordinates[0])
                coorlist.append(coordinates[1])
                coorlist.append(1)
        data.append(coorlist)
    return data