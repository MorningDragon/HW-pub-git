// 下列 ifdef 块是创建使从 DLL 导出更简单的
// 宏的标准方法。此 DLL 中的所有文件都是用命令行上定义的 TESTDLL_EXPORTS
// 符号编译的。在使用此 DLL 的
// 任何其他项目上不应定义此符号。这样，源文件中包含此文件的任何其他项目都会将
// TESTDLL_API 函数视为是从 DLL 导入的，而此 DLL 则将用此宏定义的
// 符号视为是被导出的。
#ifdef TESTDLL_EXPORTS
#define TESTDLL_API __declspec(dllexport)
#else
#define TESTDLL_API __declspec(dllimport)
#endif
#include<iostream>
#include<sstream>
#include<cmath>

typedef unsigned long long int  uint64_t;
using namespace std;
extern "C"
{	typedef struct rect_LB_double{
	double m_l;
	double m_b;
	double w;
	double h;
}rectLBf;
TESTDLL_API double calculateDis(char c[],char c2[],double a,double b);//两个编码与最小单元属性，返回值为两编码距离
TESTDLL_API	double calculateAng(char c[],char c2[],double a,double b);//返回值为距离
TESTDLL_API char *gridC(char ch[]);//返回值为字符串数组指针

TESTDLL_API uint64_t mortonEncode_LUT(unsigned int x,unsigned int y);
TESTDLL_API uint64_t LB2MortonRegion_wNEh_BIN(const rectLBf& rect,double L,double B,int level);
TESTDLL_API char * LB2MortonRegion_wNEh_QUA(const rectLBf& rect,double L,double B,int level);
TESTDLL_API char * testLB2MortonRegion_wNEh(double ml,double mb,double rw,double rh,double l,double b,int level);//ml、mb是局部左上角的经纬度 rw、rb为左上起经纬变化的大小 l、b为待求的经纬度 level为剖分的层次
}

