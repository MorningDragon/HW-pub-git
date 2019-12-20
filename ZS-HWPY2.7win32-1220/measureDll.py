# encoding:utf-8
from ctypes import *
import ctypes
import re
dllPath=ctypes.cdll.LoadLibrary("./static/dll/testDll(6).dll")
# 距离
def dis(stringA,stringB,scaleA,scaleB):
    dllPath.calculateDis.argtypes = [c_char_p,c_char_p,c_double,c_double]
    dllPath.calculateDis.restype = c_double
    dis=dllPath.calculateDis(stringA,stringB,scaleA,scaleB)
    return str(dis)
# 角度
def Ang(stringA,stringB,scaleA,scaleB):
    dllPath.calculateAng.argtypes = [c_char_p,c_char_p,c_double,c_double]
    dllPath.calculateAng.restype = c_double
    Ang=dllPath.calculateAng(stringA,stringB,scaleA,scaleB)
    return str(Ang)
# 输入经纬度查询编码
def LB2Code(doubleA, doubleB, doubleC, doubleD, doubleE, doubleF, intG):
    dllPath.testLB2MortonRegion_wNEh.argtypes=[c_double,c_double,c_double,c_double,c_double,c_double,c_int]
    dllPath.testLB2MortonRegion_wNEh.restype=c_char_p
    # code=dllPath.testLB2MortonRegion_wNEh(116.015625,40.078125,0.703125,-0.703125,116.215625,39.7753,15)
    code = dllPath.testLB2MortonRegion_wNEh(doubleA, doubleB, doubleC, doubleD, doubleE, doubleF, intG)
    # print 'doubleA',doubleA,type(doubleA)
    # print 'code:',code,type(code)
    return str(code)
# 输入编码查临近
def neaSear(nea_string):
    dllPath.gridC.argtypes=[c_char_p]
    dllPath.gridC.restype=c_char_p
    linjin=dllPath.gridC(nea_string)
    linjin_list=re.findall(r'.{12}',linjin)
    # print linjin_list
    return linjin_list
    # for i in linjin_list:
    #     print '查询临近编码:',i

