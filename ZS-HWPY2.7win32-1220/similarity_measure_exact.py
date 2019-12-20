#!/usr/bin/python
# -*- coding:utf8 -*-
from __future__ import division
from ctypes import *
import ctypes
import time
import heapq
import re


'''
points_LB=[]
with open('tra_demo.txt','r') as f:
 for line in f:
     points_LB.append(list(line.strip('\n').split(',')))
# print(len(points_LB))
'''
def safe_float(number):
    """
    将经纬度坐标文本转为浮点型
    """
    try:
        return float(number)
    except:
        return None
def longestCommonPrefix(strs):
    """
    :type strs: List[str]
    :rtype: str
    """
    if not strs:
        return ''
    s1 = min(strs)
    s2 = max(strs)
    for i, c in enumerate(s1):
        if c != s2[i]:
            return s1[:i]
    return s1
def jaccard_exact(tra1,tra2):
    jaccard_exact= (len(tra_dict[tra1].intersection(tra_dict[tra2])))/len(tra_dict[tra1].union(tra_dict[tra2]))#Jaccard系数计算相似度
    return jaccard_exact
def simpson_exact(tra1,tra2):
    simpson_exact=len(tra_dict[tra1].intersection(tra_dict[tra2]))/min([len(tra_dict[tra1]),len(tra_dict[tra2])])
    return simpson_exact
#读取数据，并将其写入数据结构
dllPath=ctypes.cdll.LoadLibrary("./static/dll/testDll.dll")
tra_dict = {}
key_list = []
val_list = []
tra_LB = []
tra_dict_LB = {}
#读入原始经纬度数据
# i = 1
with open('./static/data/points_in_study_area_new_id.txt', 'r') as f:
    for line in f.readlines():
        key = line.strip().split("\t")[0]
        val = line.strip().split("\t")[3:5]
        key_list.append(key)
        val_list.append(val)
time_start=time.time()
# 将原始经纬度坐标转为四叉树编码，并以轨迹ID为Key，轨迹编码集合为value
dllPath.testLB2MortonRegion_wNEh.argtypes=[c_double,c_double]
dllPath.testLB2MortonRegion_wNEh.restype=c_char_p
for x in range(len(val_list)):
        if key_list[x] in tra_dict:
            #116.015625,40.078125,0.703125,-0.703125,
            bianma=dllPath.testLB2MortonRegion_wNEh(list(map(safe_float,val_list[x]))[0],list(map(safe_float,val_list[x]))[1],11)
            # tra_dict[key_list[x]] += [bianma]
            tra_code.add(bianma)
            tra_LB.append(list(map(safe_float,val_list[x])))
            tra_dict[key_list[x]] = tra_code
            tra_dict_LB[key_list[x]] = tra_LB

        else:
            bianma=dllPath.testLB2MortonRegion_wNEh(list(map(safe_float,val_list[x]))[0],list(map(safe_float,val_list[x]))[1],11)
            tra_code=set()
            tra_LB=[]
            tra_code.add(bianma)
            tra_LB.append(list(map(safe_float, val_list[x])))
            tra_dict[key_list[x]] = tra_code
            tra_dict_LB[key_list[x]] = tra_LB
key_list=list(set(key_list))
time_end=time.time()
print('input data and code  transformation cost',time_end-time_start)

'''
#直接读取编码到字典
tra_code=set()
tra_dict={}
for i in range(len(points_LB)):
    if i !=(len(points_LB)-1):
        if points_LB[i][0]==points_LB[i+1][0]:
            tra_code.add(points_LB[i][1])
            tra_dict[points_LB[i][0]]=tra_code
        else:
            tra_code.add(points_LB[i][1])
            tra_dict[points_LB[i][0]]=tra_code
            # print("jieidan")
            tra_code=set()
            tra_code.add(points_LB[i+1][1])
            tra_dict[points_LB[i+1][0]]=tra_code
    else:
        tra_code.add(points_LB[i][1])
        tra_dict[points_LB[i][0]]=tra_code
        print tra_dict
        break
'''
#定义杰卡德相似性度量函数


#测试

'''
# 遍历所有轨迹，用于查询相似性较高的轨迹对
for j in range(len(key_list)):
    for i in range(len(key_list)):
        tra_similarity=jaccard_exact(key_list[j],key_list[i])
        if tra_similarity >=1.2 and len(tra_dict[key_list[j]])>50 and key_list[j]!=key_list[i]:
            # print(key_list[i],key_list[j])
            # print("==========================")
            pass
'''
'''
#不用过滤直接查询相似轨迹
for i in range(len(key_list)):
    tra_similarity=jaccard_exact("5796467",key_list[i])
    if tra_similarity >=0.5:
        print(key_list[i])
        print(tra_similarity)
        print("==========================")
'''
def similar_trajectory_search(tra_id,k=4):
    similarity_list =[]
    traid_list=[]
    for i in range(len(key_list)):
        tra_similarity=jaccard_exact(tra_id,key_list[i])
        similarity_list.append(tra_similarity)
    large_index=map(similarity_list.index, heapq.nlargest(k, similarity_list))
    for j in range(k):
        traid_list.append(key_list[large_index[j]])
    return traid_list

def line_code(tra_id,level):
    level_1 = str(level + 1)
    tra_one_line_code = []
    for i in range(len(tra_dict_LB[tra_id])-1): #获取轨迹经纬度对串
        dllPath.insert_grids_line.argtypes = [c_double, c_double, c_double, c_double, c_int]
        dllPath.insert_grids_line.restype = c_char_p
        char_line=dllPath.insert_grids_line(tra_dict_LB[tra_id][i][0],tra_dict_LB[tra_id][i][1],
                                            tra_dict_LB[tra_id][i+1][0],tra_dict_LB[tra_id][i+1][1], level)
        line_list=re.findall(r'.{'+level_1+'}', char_line)
        tra_one_line_code.extend(line_list)
    tra_one_line_code = list(set(tra_one_line_code))
    tra_one_global_line_code = list(map(lambda x: '1210032' + x, tra_one_line_code))

    return list(tra_one_global_line_code)
def simlar_tra_line_code(similar_tra_id,level):
    tra_all_line_code=[]
    for tra_id in similar_tra_id:
        tra_one_line_code = line_code(tra_id,level)
        tra_all_line_code.append(tra_one_line_code)
    return tra_all_line_code
# print'The exact similarity between two trajectories is:',jaccard_exact('563304','563340')
'''
#利用公共前缀过滤
time_start=time.time()
key_list_lcp=[]
tra_lcp_dict={}
for i in range(len(key_list)):
    longestCommonPrefix_val=longestCommonPrefix(tra_dict[key_list[i]])
    tra_lcp_dict[key_list[i]] = longestCommonPrefix_val
#查找特定轨迹的相似轨迹
for i in range(len(key_list)):
    if tra_lcp_dict[key_list[i]]==tra_lcp_dict["5633042"]:
        tra_similarity=jaccard_exact("5633042",key_list[i])
        # if tra_similarity >0.5:
        #     print(tra_similarity)
time_end=time.time()
print('longestCommonPrefix cost',time_end-time_start)
'''
if __name__=='__main__':
    b = simlar_tra_line_code(similar_trajectory_search("5796467",6),11)
    # print b




